'use strict';

import Node from './Node.js';
import Edge from './Edge.js';
import Query from './Query.js';

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
    this._graph = {
      nodes: {},
      edges: {}
    };
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
    // TODO make async
    return this._graph.nodes[id];
  }

  getNodes() {
    // TODO
  }

  removeNode(id) {
    // TODO
  }

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

  getEdge(id) {
    // TODO
  }

  getEdges() {
    // TODO
  }

  removeEdge() {
    // TODO
  }

  query() {
    return new Query(this);
  }
}

export default Graph;
