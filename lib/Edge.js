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
 * An edge in the graph.
 */
// Note: extends only works in IE >= 11

var Edge = (function (_Element) {

  /**
   * Create a new Edge
   * @param  {Graph} graph The graph instance.
   * @param  {String} id The edge id.
   * @param  {String} label The edge label.
   * @param  {Node} from The node this edge goes from.
   * @param  {Node} to The node this edge goes to.
   * @return {Edge} The new edge.
   */

  function Edge(graph, id, label, from, to) {
    _classCallCheck(this, Edge);

    _get(Object.getPrototypeOf(Edge.prototype), 'constructor', this).call(this, graph, id, label);
    this._from = from;
    from._out[id] = this;
    this._to = to;
    to._in[id] = this;
  }

  _inherits(Edge, _Element);

  _createClass(Edge, [{
    key: 'getNode',

    /**
     * Get a node in the specified Direction.
     * @param  {Direction} direction The direction.
     * @return {Promise} Resolves to the Node.
     */
    value: function getNode(direction) {
      switch (direction) {
        case _DirectionJs2['default'].IN:
          return Promise.resolve(this._to);
        case _DirectionJs2['default'].OUT:
          return Promise.resolve(this._from);
        default:
          throw new Error('Invalid Direction');
      }
    }
  }, {
    key: '_persist',

    /***
     * Persist this Edge to the database.
     * @return {Promise} A Promise resolving to this.
     */
    value: function _persist() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this._graph._db.put('edge:' + _this._id, {
          id: _this._id,
          label: _this._label,
          from: _this._from._id,
          to: _this._to._id,
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

  return Edge;
})(_ElementJs2['default']);

exports['default'] = Edge;
module.exports = exports['default'];