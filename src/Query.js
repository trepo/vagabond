'use strict';

/**
 * A Graph Query.
 */
class Query {

  /**
   * Create a new Query.
   * Note that all filters are ANDed together.
   * @param  {Graph} graph The Graph instance.
   * @return {Query} The query.
   */
  constructor(graph) {
    this._graph = graph;
    this._ops = [];
  }

  /**
   * Filter for elements that contain this property key.
   * Note that if value is passed in it is compared against using `===`.
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {Query} This query, for chaining.
   */
  has(key) {
    // If we have key, value
    if (arguments.length == 2) {
      this._ops.push((props) => {
        return props.hasOwnProperty(arguments[0]) &&
          props[arguments[0]] === arguments[1];
      });
    } else {
      this._ops.push((props) => {
        return props.hasOwnProperty(arguments[0]);
      });
    }

    return this;
  }

  /**
   * Filter for elements that do not comtain this property key.
   * Note that if value is passed in it is compared against using `===`.
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {Query} This query, for chaining.
   */
  hasNot(key) {
    // If we have key, value
    if (arguments.length == 2) {
      this._ops.push((props) => {
        return !(props.hasOwnProperty(arguments[0]) &&
          props[arguments[0]] === arguments[1]);
      });
    } else {
      this._ops.push((props) => {
        return !props.hasOwnProperty(arguments[0]);
      });
    }

    return this;
  }

  /**
   * Pass an optional function to use for filtering.
   * It will be called with `function(properties, id, label)`.
   * The function **must** return true **synchronously** for the element to be included.
   * @param  {function} func The function to use for filtering
   * @return {Query} This query, for chaining.
   */
  filter(func) {
    if (typeof func !== 'function') {
      throw new Error('filter requires a function');
    }
    this._ops.push(func);
    return this;
  }

  /**
   * Execute the query and return all of the edges that match.
   * Note that this function is a ES6 generator.
   * @return {Edge} Generates Edges.
   */
  * edges() {
    for (let id in this._graph._graph.edges) {
      let edge = this._graph._graph.edges[id];
      let include = true;
      for (let func of this._ops) {
        let result = func.call(this, edge._properties, edge._id, edge._label);
        if (!(result === true)) {
          include = false;
          break;
        }
      }
      if (include) {
        yield edge;
      }
    }
  }

  /**
   * Execute the query and return all of the nodes that match.
   * Note that this function is a ES6 generator.
   * @return {Node} Generates Nodes.
   */
  * nodes() {
    for (let id in this._graph._graph.nodes) {
      let node = this._graph._graph.nodes[id];
      let include = true;
      for (let func of this._ops) {
        let result = func.call(this, node._properties, node._id, node._label);
        if (!(result === true)) {
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
