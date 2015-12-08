import Element from './Element.js';
import Direction from './Direction.js';
import NodeQuery from './NodeQuery.js';

/**
 * A node in the graph.
 */
// Note: extends only works in IE >= 11
class Node extends Element {

  /**
   * Create a new Node.
   *
   * @param  {Graph} graph The graph instance.
   * @param  {String} id The node id.
   * @param  {String} label The node label.
   */
  constructor(graph, id, label) {
    super(graph, id, label);
    this._out = {};
    this._in = {};
  }

  /**
   * Add an edge from this node to the specified node.
   *
   * @param {Id} id The id of the edge.
   * @param {String} label The label.
   * @param {Node} node The node to go to.
   * @return {Edge} The Edge.
   */
  addEdge(id, label, node) {
    if (this._id == node._id) {
      throw new Error('A node may not create an edge to itself');
    }
    return this._graph.addEdge(id, label, this, node);
  }

  /**
   * Get all edges in the following direction, optionally filtered by edge label.
   * Note that this is an ES6 Generator.
   *
   * @param  {Direction} direction The direction.
   * @param  {...String} labels One or more labels to filter on.
   */
  * getEdges(direction, ...labels) {
    if (direction === Direction.OUT || direction === Direction.BOTH) {
      for (let id in this._out) {
        let edge = this._out[id];
        if (labels.length > 0) {
          if (labels.indexOf(edge._label) >= 0) {
            yield edge;
          }
        } else {
          yield edge;
        }
      }
    }
    if (direction === Direction.IN || direction === Direction.BOTH) {
      for (let id in this._in) {
        let edge = this._in[id];
        if (labels.length > 0) {
          if (labels.indexOf(edge._label) >= 0) {
            yield edge;
          }
        } else {
          yield edge;
        }
      }
    }
  }

  /**
   * Get all nodes in the following direction, optionally filtered by edge label.
   * Note that this is an ES6 Generator.
   *
   * @param  {Direction} direction The direction.
   * @param  {...String} labels One or more labels to filter on.
   */
  * getNodes(direction, ...labels) {
    if (direction === Direction.OUT || direction === Direction.BOTH) {
      for (let id in this._out) {
        let edge = this._out[id];
        if (labels.length > 0) {
          if (labels.indexOf(edge._label) >= 0) {
            yield edge._to;
          }
        } else {
          yield edge._to;
        }
      }
    }
    if (direction === Direction.IN || direction === Direction.BOTH) {
      for (let id in this._in) {
        let edge = this._in[id];
        if (labels.length > 0) {
          if (labels.indexOf(edge._label) >= 0) {
            yield edge._from;
          }
        } else {
          yield edge._from;
        }
      }
    }
  }

  /**
   * Get a new NodeQuery.
   *
   * @param  {Direction} direction The direction.
   * @return {NodeQuery} The NodeQuery.
   */
  query(direction) {
    return new NodeQuery(this, direction);
  }

  /***
   * Persist this Node to the database.
   * @return {Promise} A Promise resolving to this.
   */
  _persist() {
    return new Promise((resolve, reject) => {
      this._graph._db.put('node:' + this._id, this._serialize(), error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  _serialize() {
    return {
      id: this._id,
      label: this._label,
      properties: this._properties
    };
  }

}

export default Node;
