'use strict';

import Node from './Node.js';

/**
 * A Graph.
 */
class Graph {

  /**
   * Creates a new Graph. Make sure to call `.load()`!
   * @return {Graph}
   */
  constructor (db) {
    this._db = db;
    this._graph = {};
  }

  /**
   * Initialize vagabond
   * @return {Promise} A Promise
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
    if (typeof this._graph[id] !== 'undefined') {
      throw new Error('Duplicate key ' + id);
    }
    let node = new Node(this, id, label);
    this._graph[id] = new Node(this, id, label);

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
    return this._graph[id];
  }

  addEdge(id, label, fromNode, toNode) {
    if (typeof this._graph[id] !== 'undefined') {
      throw new Error('Duplicate key ' + id);
    }

    let edge = new Edge(this, id, label, fromNode, toNode);
    this._graph[id] = new Edge(this, id, label, fromNode, toNode);

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

}

export default Graph;
