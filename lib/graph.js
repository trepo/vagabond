'use strict';

import Node from './Node.js';
import Edge from './Edge.js';
import Query from './Query.js';

/**
 * A Graph Instance.
 */
class Graph {

  /**
   * Creates a new Graph. Make sure to call `.load()`!
   * @return {Graph}
   */
  constructor (db) {
    this._db = db;
    this._graph = {
      nodes: {},
      edges: {}
    };
  }

  /**
   * Initialize vagabond.
   * @return {Promise} A Promise.
   */
  init() {
    return new Promise((resolve, reject) => {
      // TODO Actually load from the DB :)
      resolve('loaded');
    });
  }

  /**
   * Adds a node to the graph.
   * @param {String} id The node's id.
   * @param {String} label The node's label.
   * @throws Error if id is already used.
   */
  addNode(id, label) {
    if (typeof this._graph.nodes[id] !== 'undefined') {
      throw new Error('Duplicate key ' + id);
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
   * @param {String} id The node id.
   */
  getNode(id) {
    return new Promise((resolve, reject) => {
      if (typeof this._graph.nodes[id] !== 'undefined') {
        resolve(this._graph.nodes[id]);
      } else {
        reject(new Error('Node ' + id + ' not found'));
      }
    });
  }

  /**
   * Get all of the nodes in the graph.
   * Note that this returns an ES6 Generator.
   * @return {Node} Generates Nodes.
   */
  * getNodes() {
    for (let id in this._graph.nodes) {
      yield this._graph.nodes[id];
    }
  }

  /**
   * Remove a node from the graph.
   * @param  {String} id The node id to remove.
   * @return {Promise} A Promise.
   */
  removeNode(id) {
    return new Promise((resolve, reject) => {
      this._db.del('node:' + id, error => {
        if (error) {
          reject(error);
        } else {
          delete this._graph.nodes[id];
          resolve(null);
        }
      })
    });
  }

  /**
   * Adds an edge to the graph.
   * @param {String} id       The edge id.
   * @param {String} label    The edge label.
   * @param {Node} fromNode The from node.
   * @param {Node} toNode   The to node.
   * @return {Promise} A Promise resolving to the added edge.
   */
  addEdge(id, label, fromNode, toNode) {
    if (typeof this._graph.edges[id] !== 'undefined') {
      throw new Error('Duplicate key ' + id);
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
   * @param  {String} id The edge id.
   * @return {Promise} Resolves to the Edge.
   */
  getEdge(id) {
    return new Promise((resolve, reject) => {
      if (typeof this._graph.edges[id] !== 'undefined') {
        resolve(this._graph.edges[id]);
      } else {
        reject(new Error('Edge ' + id + ' not found'));
      }
    });
  }

  /**
   * Get all of the edges in the graph.
   * Note that this returns an ES6 Generator.
   * @return {Edge} Generates Edges.
   */
  * getEdges() {
    for (let id in this._graph.edges) {
      yield this._graph.edges[id];
    }
  }

  /**
   * Remove an edge from the graph.
   * @param  {String} id The edge to remove.
   * @return {Promise} A Promise.
   */
  removeEdge(id) {
    return new Promise((resolve, reject) => {
      this._db.del('edge:' + id, error => {
        if (error) {
          reject(error);
        } else {
          delete this._graph.edges[id];
          resolve(null);
        }
      })
    });
  }

  /**
   * Create a new graph query
   * @return {Query} the new Query.
   */
  query() {
    return new Query(this);
  }
}

export default Graph;
