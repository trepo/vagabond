/**
 * A Graph Query.
 */
class GraphQuery {

  /**
   * Create a new GraphQuery.
   * Note that all filters are ANDed together.
   *
   * @param  {Graph} graph The Graph instance.
   */
  constructor(graph) {
    this._graph = graph;
    this._ops = [];
  }

  /**
   * Filter for elements that contain this property key.
   * Note that if value is passed in it is compared against using `===`.
   *
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {GraphQuery} This query, for chaining.
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
   * Filter for elements that do not contain this property key.
   * Note that if value is passed in it is compared against using `===`.
   *
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {GraphQuery} This query, for chaining.
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
   * Restrict the query to elements that have one of the labels.
   *
   * @param  {...String} labels The labels.
   * @return {NodeQuery} This query, for chaining.
   */
  labels(...labels) {
    this._ops.push((properties, id, label) => {
      return (labels.indexOf(label) >= 0);
    });

    return this;
  }

  /**
   * Pass an optional function to use for filtering.
   * It will be called with `function(properties, id, label)`.
   * The function **must** return true **synchronously**
   * for the element to be included.
   *
   * @param  {function} func The function to use for filtering
   * @return {GraphQuery} This query, for chaining.
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

module.exports = GraphQuery;
