'use strict';

import Element from './Element.js';

/**
 * A node in the graph.
 */
// Note: extends only works in IE >= 11
class Node extends Element {

  /**
   * Create a new Node
   * @param  {Graph} graph The graph instance.
   * @param  {String} id The node id.
   * @param  {String} label The node label.
   * @return {Node} The new node.
   */
  constructor(graph, id, label) {
    super(graph, id, label);
    this._out = {};
    this._in = {};
  }

  /**
   * Add an edge from this node to the specified node.
   * @param {Node} node  The node to go to.
   * @param {String} label The label.
   */
  addEdge(node, label) {
    return this._graph.addEdge(id, label, this, node);
  }

  /**
   * Get all edges in the following direction, optionally filtered by edge label.
   * Note that this is an ES6 Generator.
   * @param  {Direction} direction The direction.
   * @param  {...String} labels One or more labels to filter on.
   * @return {Edge} Generates Edges.
   */
  * getEdges(direction, ...labels) {
    // TODO
  }

  /**
   * Get all nodes in the following direction, optionally filtered by edge label.
   * Note that this is an ES6 Generator.
   * @param  {Direction} direction The direction.
   * @param  {...String} labels One or more labels to filter on.
   * @return {Node} Generates Nodes.
   */
  * getNodes(direction, ...labels) {
    // TODO
  }

  /***
   * Persist this Node to the database.
   * @return {Promise} A Promise resolving to this.
   */
  _persist() {
    return new Promise((resolve, reject) => {
      this._graph._db.put('node:' + this._id, {
        id: this._id,
        label: this._label,
        properties: this._properties
      }, error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      })
    });
  }

}

export default Node;
