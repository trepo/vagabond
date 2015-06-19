'use strict';

class Query {
  constructor(graph) {
    this._graph = graph;
    this._ops = [];
  }

  has() {
    switch (arguments.length) {
      case 2: this._ops.push((props) => {
        return props.hasOwnProperty(arguments[0]) &&
          props[arguments[0]] === arguments[1];
      });
      default: this._ops.push((props) => {
        return props.hasOwnProperty(arguments[0]);
      });
    }
    return this;
  }

  hasNot() {
    switch (arguments.length) {
      case 2: this._ops.push((props) => {
        return !(props.hasOwnProperty(arguments[0]) &&
          props[arguments[0]] === arguments[1]);
      });
      default: this._ops.push((props) => {
        return !props.hasOwnProperty(arguments[0]);
      });
    }
    return this;
  }

  filter(func) {
    this._ops.push(func);
    return this;
  }

  *edges() {
    for (let id in this._graph._graph.edges) {
      let edge = this._graph._graph.edges[id];
      let include = true;
      for (let func of this._ops) {
        if (!func.apply(this, [edge._properties, edge._id, edge._label])) {
          include = false;
          break;
        }
      }
      if (include) {
        yield edge;
      }
    }
  }

  *nodes() {
    for (let id in this._graph._graph.nodes) {
      let node = this._graph._graph.nodes[id];
      let include = true;
      for (let func of this._ops) {
        if (!func.apply(this, [node._properties, node._id, node._label])) {
          include = false;
          break;
        }
      }
      if (include) {
        yield node;
      }
    }
  }

}

export default Query;
