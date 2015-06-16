/**
 * A Graph.
 */
export default class Graph {
    
  constructor () {
    this._graph = {};
  }

  addNode(id, label) {
    // TODO validate ID
    this._graph[id] = {
      id: id,
      label: label,
      properties: {}
    }
  }

  getNode(id) {
    return this._graph[id]
  }

}