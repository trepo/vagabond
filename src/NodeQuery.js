'use strict';

import Direction from './Direction.js';

/**
 * A Node Query.
 */
class NodeQuery {

  /**
   * Create a new Query.
   * Note that all filters are ANDed together.
   *
   * @param  {Graph} node The Node.
   */
  constructor(node, direction) {
    this._node = node;
    this._direction = direction;
    this._ops = [];
  }

  /**
   * Filter for elements that contain this property key.
   * Note that if value is passed in it is compared against using `===`.
   *
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {NodeQuery} This query, for chaining.
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
   *
   * @param {String} key The key to filter on.
   * @param {Object} [value] The value to compare against.
   * @return {NodeQuery} This query, for chaining.
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
   * Restrict the query to edges that have one of the labels.
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
   * The function **must** return true **synchronously** for the element to be included.
   *
   * @param  {function} func The function to use for filtering
   * @return {NodeQuery} This query, for chaining.
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
    if (this._direction === Direction.OUT ||
        this._direction === Direction.BOTH) {
      for (let id in this._node._out) {
        let edge = this._node._out[id];
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
    if (this._direction === Direction.IN ||
        this._direction === Direction.BOTH) {
      for (let id in this._node._in) {
        let edge = this._node._in[id];
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
  }

  /**
   * Execute the query and return all of the nodes that match.
   * Note that this function is a ES6 generator.
   */
  * nodes() {
    if (this._direction === Direction.OUT ||
        this._direction === Direction.BOTH) {
      for (let id in this._node._out) {
        let edge = this._node._out[id];
        let include = true;
        for (let func of this._ops) {
          let result = func.call(this, edge._properties, edge._id, edge._label);
          if (!(result === true)) {
            include = false;
            break;
          }
        }
        if (include) {
          yield edge._to;
        }
      }
    }
    if (this._direction === Direction.IN ||
        this._direction === Direction.BOTH) {
      for (let id in this._node._in) {
        let edge = this._node._in[id];
        let include = true;
        for (let func of this._ops) {
          let result = func.call(this, edge._properties, edge._id, edge._label);
          if (!(result === true)) {
            include = false;
            break;
          }
        }
        if (include) {
          yield edge._from;
        }
      }
    }
  }

}

export default NodeQuery;
