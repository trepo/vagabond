import LevelUp from 'levelup';
import Memdown from 'memdown';
import Node from './Node.js';
import Edge from './Edge.js';
import GraphQuery from './GraphQuery.js';

/**
 * A Graph Instance.
 */
class Graph {

  /**
   * Creates a new Graph. Make sure to call `.init()`!
   *
   * options.db - A LevelDOWN API Compatible Constructor (Defaults to MemDOWN).
   *
   * options.name - The LevelUP db name (Defaults to a UUIDv4).
   *
   * @param  {Object} options Graph options.
   */
  constructor(options = {}) {
    let {db = Memdown,
      name = this._generateUUIDv4()} = options;

    this._db = LevelUp(name, {
      db: db,
      keyEncoding: 'utf8',
      valueEncoding: 'json'
    });
    this._graph = {
      nodes: {},
      edges: {}
    };
    this._initialized = false;
  }

  /**
   * Initialize vagabond.
   *
   * @return {Promise} A Promise.
   */
  init() {
    return new Promise((resolve, reject) => {
      // If init is already called, just skip
      if (this._initialized) {
        return resolve(this);
      }

      // Node serialization [id, label, properties]
      this._db.createValueStream({gt: 'n:', lt: 'n:\udbff\udfff'})
        .on('data', data => {
          this._graph.nodes[data[0]] = new Node(this, data[0], data[1]);
          this._graph.nodes[data[0]]._properties = data[2];
        })
        .on('error', error => {
          reject(error);
        })
        .on('end', () => {
          // Edge serialization [id, label, from, to, properties]
          this._db.createValueStream({gt: 'e:', lt: 'e:\udbff\udfff'})
            .on('data', data => {
              this._graph.edges[data[0]] = new Edge(
                this,
                data[0],
                data[1],
                this._graph.nodes[data[2]],
                this._graph.nodes[data[3]]
              );
              this._graph.edges[data[0]]._properties = data[4];
            })
            .on('error', error => {
              reject(error);
            })
            .on('end', () => {
              this._initialized = true;
              resolve(this);
            });
        });
    });
  }

  /**
   * Adds a node to the graph.
   *
   * @param {String} id The node's id.
   * @param {String} label The node's label.
   * @throws Error if id is already used.
   * @return {Promise} A Promise resolving to the {@link Node}.
   */
  addNode(id, label) {
    if (typeof this._graph.nodes[id] !== 'undefined') {
      throw new Error('Duplicate Key');
    }
    let node = new Node(this, id, label);
    this._graph.nodes[id] = node;

    return new Promise((resolve, reject) => {
      node._persist()
        .then(value => resolve(node))
        .catch(error => reject(error));
    });
  }

  /**
   * Gets a node from the graph.
   *
   * @param {String} id The node id.
   * @return {Promise} A Promise resolving to the {@link Node}.
   */
  getNode(id) {
    return new Promise((resolve, reject) => {
      if (typeof this._graph.nodes[id] !== 'undefined') {
        resolve(this._graph.nodes[id]);
      } else {
        reject(new Error('Node Not Found'));
      }
    });
  }

  /**
   * Get all of the nodes in the graph.
   * Note that this returns an ES6 Generator.
   */
  * getNodes() {
    for (let id in this._graph.nodes) {
      yield this._graph.nodes[id];
    }
  }

  /**
   * Remove a node from the graph.
   *
   * @param  {String} id The node id to remove.
   * @return {Promise} A Promise.
   */
  removeNode(id) {

    let promises = [];

    for (let edge in this._graph.nodes[id]._in) {
      promises.push(this.removeEdge(edge));
    }

    for (let edge in this._graph.nodes[id]._out) {
      promises.push(this.removeEdge(edge));
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(() => {
          this._db.del('n:' + id, error => {
            if (error) {
              reject(error);
            } else {
              delete this._graph.nodes[id];
              resolve(null);
            }
          });
        }).catch(error => reject(error));
    });

  }

  /**
   * Adds an edge to the graph.
   *
   * @param {String} id       The edge id.
   * @param {String} label    The edge label.
   * @param {Node} fromNode The from node.
   * @param {Node} toNode   The to node.
   * @return {Promise} A Promise resolving to the {@link Edge}.
   */
  addEdge(id, label, fromNode, toNode) {
    if (typeof this._graph.edges[id] !== 'undefined') {
      throw new Error('Duplicate Key');
    }

    let edge = new Edge(this, id, label, fromNode, toNode);
    this._graph.edges[id] = edge;

    return new Promise((resolve, reject) => {
      Promise.all([
          edge._persist(),
          fromNode._persist(),
          toNode._persist()
        ])
      .then(value => resolve(edge))
      .catch(error => reject(error));
    });
  }

  /**
   * Get an edge.
   *
   * @param  {String} id The edge id.
   * @return {Promise} Resolves to the {@link Edge}.
   */
  getEdge(id) {
    return new Promise((resolve, reject) => {
      if (typeof this._graph.edges[id] !== 'undefined') {
        resolve(this._graph.edges[id]);
      } else {
        reject(new Error('Edge Not Found'));
      }
    });
  }

  /**
   * Get all of the edges in the graph.
   * Note that this returns an ES6 Generator.
   */
  * getEdges() {
    for (let id in this._graph.edges) {
      yield this._graph.edges[id];
    }
  }

  /**
   * Remove an edge from the graph.
   *
   * @param  {String} id The edge to remove.
   * @return {Promise} A Promise.
   */
  removeEdge(id) {
    let fromNode = this._graph.edges[id]._from.id;
    let toNode = this._graph.edges[id]._to.id;

    return new Promise((resolve, reject) => {
      this._db.del('e:' + id, error => {
        if (error) {
          reject(error);
        } else {
          delete this._graph.nodes[fromNode]._out[id];
          delete this._graph.nodes[toNode]._in[id];
          delete this._graph.edges[id];
          resolve(null);
        }
      });
    });
  }

  /**
   * Create a new graph query.
   *
   * @return {GraphQuery} the new Query.
   */
  query() {
    return new GraphQuery(this);
  }

  _generateUUIDv4() {
    // From http://blog.snowfinch.net/post/3254029029/uuid-v4-js
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      let random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += '-';
      }

      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }
}

export default Graph;
