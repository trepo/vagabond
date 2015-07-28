'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _ElementJs = require('./Element.js');

var _ElementJs2 = _interopRequireDefault(_ElementJs);

var _DirectionJs = require('./Direction.js');

var _DirectionJs2 = _interopRequireDefault(_DirectionJs);

/**
 * A node in the graph.
 */
// Note: extends only works in IE >= 11

var Node = (function (_Element) {

  /**
   * Create a new Node
   * @param  {Graph} graph The graph instance.
   * @param  {String} id The node id.
   * @param  {String} label The node label.
   * @return {Node} The new node.
   */

  function Node(graph, id, label) {
    _classCallCheck(this, Node);

    _get(Object.getPrototypeOf(Node.prototype), 'constructor', this).call(this, graph, id, label);
    this._out = {};
    this._in = {};
  }

  _inherits(Node, _Element);

  _createClass(Node, [{
    key: 'addEdge',

    /**
     * Add an edge from this node to the specified node.
     * @param {Node} node  The node to go to.
     * @param {String} label The label.
     */
    value: function addEdge(id, label, node) {
      if (this._id == node._id) {
        throw new Error('A node may not create an edge to itself');
      }
      return this._graph.addEdge(id, label, this, node);
    }
  }, {
    key: 'getEdges',

    /**
     * Get all edges in the following direction, optionally filtered by edge label.
     * Note that this is an ES6 Generator.
     * @param  {Direction} direction The direction.
     * @param  {...String} labels One or more labels to filter on.
     * @return {Edge} Generates Edges.
     */
    value: regeneratorRuntime.mark(function getEdges(direction) {
      for (var _len = arguments.length, labels = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        labels[_key - 1] = arguments[_key];
      }

      var id, edge;
      return regeneratorRuntime.wrap(function getEdges$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(direction === _DirectionJs2['default'].OUT || direction === _DirectionJs2['default'].BOTH)) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.t0 = regeneratorRuntime.keys(this._out);

          case 2:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 15;
              break;
            }

            id = context$2$0.t1.value;
            edge = this._out[id];

            if (!(labels.length > 0)) {
              context$2$0.next = 11;
              break;
            }

            if (!(labels.indexOf(edge._label) >= 0)) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 9;
            return edge;

          case 9:
            context$2$0.next = 13;
            break;

          case 11:
            context$2$0.next = 13;
            return edge;

          case 13:
            context$2$0.next = 2;
            break;

          case 15:
            if (!(direction === _DirectionJs2['default'].IN || direction === _DirectionJs2['default'].BOTH)) {
              context$2$0.next = 30;
              break;
            }

            context$2$0.t2 = regeneratorRuntime.keys(this._in);

          case 17:
            if ((context$2$0.t3 = context$2$0.t2()).done) {
              context$2$0.next = 30;
              break;
            }

            id = context$2$0.t3.value;
            edge = this._in[id];

            if (!(labels.length > 0)) {
              context$2$0.next = 26;
              break;
            }

            if (!(labels.indexOf(edge._label) >= 0)) {
              context$2$0.next = 24;
              break;
            }

            context$2$0.next = 24;
            return edge;

          case 24:
            context$2$0.next = 28;
            break;

          case 26:
            context$2$0.next = 28;
            return edge;

          case 28:
            context$2$0.next = 17;
            break;

          case 30:
          case 'end':
            return context$2$0.stop();
        }
      }, getEdges, this);
    })
  }, {
    key: 'getNodes',

    /**
     * Get all nodes in the following direction, optionally filtered by edge label.
     * Note that this is an ES6 Generator.
     * @param  {Direction} direction The direction.
     * @param  {...String} labels One or more labels to filter on.
     * @return {Node} Generates Nodes.
     */
    value: regeneratorRuntime.mark(function getNodes(direction) {
      for (var _len2 = arguments.length, labels = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        labels[_key2 - 1] = arguments[_key2];
      }

      var id, edge;
      return regeneratorRuntime.wrap(function getNodes$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(direction === _DirectionJs2['default'].OUT || direction === _DirectionJs2['default'].BOTH)) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.t0 = regeneratorRuntime.keys(this._out);

          case 2:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 15;
              break;
            }

            id = context$2$0.t1.value;
            edge = this._out[id];

            if (!(labels.length > 0)) {
              context$2$0.next = 11;
              break;
            }

            if (!(labels.indexOf(edge._label) >= 0)) {
              context$2$0.next = 9;
              break;
            }

            context$2$0.next = 9;
            return edge._to;

          case 9:
            context$2$0.next = 13;
            break;

          case 11:
            context$2$0.next = 13;
            return edge._to;

          case 13:
            context$2$0.next = 2;
            break;

          case 15:
            if (!(direction === _DirectionJs2['default'].IN || direction === _DirectionJs2['default'].BOTH)) {
              context$2$0.next = 30;
              break;
            }

            context$2$0.t2 = regeneratorRuntime.keys(this._in);

          case 17:
            if ((context$2$0.t3 = context$2$0.t2()).done) {
              context$2$0.next = 30;
              break;
            }

            id = context$2$0.t3.value;
            edge = this._in[id];

            if (!(labels.length > 0)) {
              context$2$0.next = 26;
              break;
            }

            if (!(labels.indexOf(edge._label) >= 0)) {
              context$2$0.next = 24;
              break;
            }

            context$2$0.next = 24;
            return edge._from;

          case 24:
            context$2$0.next = 28;
            break;

          case 26:
            context$2$0.next = 28;
            return edge._from;

          case 28:
            context$2$0.next = 17;
            break;

          case 30:
          case 'end':
            return context$2$0.stop();
        }
      }, getNodes, this);
    })
  }, {
    key: '_persist',

    /***
     * Persist this Node to the database.
     * @return {Promise} A Promise resolving to this.
     */
    value: function _persist() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._graph._db.put('node:' + _this._id, {
          id: _this._id,
          label: _this._label,
          properties: _this._properties
        }, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(_this);
          }
        });
      });
    }
  }]);

  return Node;
})(_ElementJs2['default']);

exports['default'] = Node;
module.exports = exports['default'];