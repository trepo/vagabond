'use strict';

import Node from './Node.js';

/**
 * A Graph.
 */
class Graph {

  /**
   * @return {Graph}
   */
  constructor () {
    this._graph = {};
  }

  /**
   * Adds a node to the graph.
   * @param {String} id The node's id.
   * @param {String} label The node's label.
   * @throws Error if id is already used.
   */
  addNode(id, label) {
    // TODO error if id is in use.
    this._graph[id] = new Node(this, id, label);
  }

  /**
   * Gets a node from the graph.
   * @param {String} id The node id.
   */
  getNode(id) {
    return this._graph[id];
  }

  addEdge(id, label, fromNode, toNode) {
    this._graph[id] = new Edge(this, id, label, fromNode, toNode);
  }

}

export default Graph;
