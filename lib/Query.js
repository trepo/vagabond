'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * A Graph Query.
 */

var Query = (function () {

  /**
   * Create a new Query.
   * Note that all filters are ANDed together.
   * @param  {Graph} graph The Graph instance.
   * @return {Query} The query.
   */

  function Query(graph) {
    _classCallCheck(this, Query);

    this._graph = graph;
    this._ops = [];
  }

  _createClass(Query, [{
    key: 'has',

    /**
     * Filter for elements that contain this property key.
     * Note that if value is passed in it is compared against using `===`.
     * @param {String} key The key to filter on.
     * @param {Object} [value] The value to compare against.
     * @return {Query} This query, for chaining.
     */
    value: function has(key) {
      var _arguments = arguments;

      // If we have key, value
      if (arguments.length == 2) {
        this._ops.push(function (props) {
          return props.hasOwnProperty(_arguments[0]) && props[_arguments[0]] === _arguments[1];
        });
      } else {
        this._ops.push(function (props) {
          return props.hasOwnProperty(_arguments[0]);
        });
      }

      return this;
    }
  }, {
    key: 'hasNot',

    /**
     * Filter for elements that do not comtain this property key.
     * Note that if value is passed in it is compared against using `===`.
     * @param {String} key The key to filter on.
     * @param {Object} [value] The value to compare against.
     * @return {Query} This query, for chaining.
     */
    value: function hasNot(key) {
      var _arguments2 = arguments;

      // If we have key, value
      if (arguments.length == 2) {
        this._ops.push(function (props) {
          return !(props.hasOwnProperty(_arguments2[0]) && props[_arguments2[0]] === _arguments2[1]);
        });
      } else {
        this._ops.push(function (props) {
          return !props.hasOwnProperty(_arguments2[0]);
        });
      }

      return this;
    }
  }, {
    key: 'filter',

    /**
     * Pass an optional function to use for filtering.
     * It will be called with `function(properties, id, label)`.
     * The function **must** return true **synchronously** for the element to be included.
     * @param  {function} func The function to use for filtering
     * @return {Query} This query, for chaining.
     */
    value: function filter(func) {
      if (typeof func !== 'function') {
        throw new Error('filter requires a function');
      }
      this._ops.push(func);
      return this;
    }
  }, {
    key: 'edges',

    /**
     * Execute the query and return all of the edges that match.
     * Note that this function is a ES6 generator.
     * @return {Edge} Generates Edges.
     */
    value: regeneratorRuntime.mark(function edges() {
      var id, edge, include, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, func, result;

      return regeneratorRuntime.wrap(function edges$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = regeneratorRuntime.keys(this._graph._graph.edges);

          case 1:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 38;
              break;
            }

            id = context$2$0.t1.value;
            edge = this._graph._graph.edges[id];
            include = true;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$2$0.prev = 8;
            _iterator = this._ops[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              context$2$0.next = 19;
              break;
            }

            func = _step.value;
            result = func.call(this, edge._properties, edge._id, edge._label);

            if (result === true) {
              context$2$0.next = 16;
              break;
            }

            include = false;
            return context$2$0.abrupt('break', 19);

          case 16:
            _iteratorNormalCompletion = true;
            context$2$0.next = 10;
            break;

          case 19:
            context$2$0.next = 25;
            break;

          case 21:
            context$2$0.prev = 21;
            context$2$0.t2 = context$2$0['catch'](8);
            _didIteratorError = true;
            _iteratorError = context$2$0.t2;

          case 25:
            context$2$0.prev = 25;
            context$2$0.prev = 26;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 28:
            context$2$0.prev = 28;

            if (!_didIteratorError) {
              context$2$0.next = 31;
              break;
            }

            throw _iteratorError;

          case 31:
            return context$2$0.finish(28);

          case 32:
            return context$2$0.finish(25);

          case 33:
            if (!include) {
              context$2$0.next = 36;
              break;
            }

            context$2$0.next = 36;
            return edge;

          case 36:
            context$2$0.next = 1;
            break;

          case 38:
          case 'end':
            return context$2$0.stop();
        }
      }, edges, this, [[8, 21, 25, 33], [26,, 28, 32]]);
    })
  }, {
    key: 'nodes',

    /**
     * Execute the query and return all of the nodes that match.
     * Note that this function is a ES6 generator.
     * @return {Node} Generates Nodes.
     */
    value: regeneratorRuntime.mark(function nodes() {
      var id, node, include, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, func, result;

      return regeneratorRuntime.wrap(function nodes$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = regeneratorRuntime.keys(this._graph._graph.nodes);

          case 1:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 38;
              break;
            }

            id = context$2$0.t1.value;
            node = this._graph._graph.nodes[id];
            include = true;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            context$2$0.prev = 8;
            _iterator2 = this._ops[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              context$2$0.next = 19;
              break;
            }

            func = _step2.value;
            result = func.call(this, node._properties, node._id, node._label);

            if (result === true) {
              context$2$0.next = 16;
              break;
            }

            include = false;
            return context$2$0.abrupt('break', 19);

          case 16:
            _iteratorNormalCompletion2 = true;
            context$2$0.next = 10;
            break;

          case 19:
            context$2$0.next = 25;
            break;

          case 21:
            context$2$0.prev = 21;
            context$2$0.t2 = context$2$0['catch'](8);
            _didIteratorError2 = true;
            _iteratorError2 = context$2$0.t2;

          case 25:
            context$2$0.prev = 25;
            context$2$0.prev = 26;

            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }

          case 28:
            context$2$0.prev = 28;

            if (!_didIteratorError2) {
              context$2$0.next = 31;
              break;
            }

            throw _iteratorError2;

          case 31:
            return context$2$0.finish(28);

          case 32:
            return context$2$0.finish(25);

          case 33:
            if (!include) {
              context$2$0.next = 36;
              break;
            }

            context$2$0.next = 36;
            return node;

          case 36:
            context$2$0.next = 1;
            break;

          case 38:
          case 'end':
            return context$2$0.stop();
        }
      }, nodes, this, [[8, 21, 25, 33], [26,, 28, 32]]);
    })
  }]);

  return Query;
})();

exports['default'] = Query;
module.exports = exports['default'];