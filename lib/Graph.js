'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _NodeJs = require('./Node.js');

var _NodeJs2 = _interopRequireDefault(_NodeJs);

var _EdgeJs = require('./Edge.js');

var _EdgeJs2 = _interopRequireDefault(_EdgeJs);

var _QueryJs = require('./Query.js');

var _QueryJs2 = _interopRequireDefault(_QueryJs);

/**
 * A Graph Instance.
 */

var Graph = (function () {

  /**
   * Creates a new Graph. Make sure to call `.load()`!
   * @return {Graph}
   */

  function Graph(db) {
    _classCallCheck(this, Graph);

    this._db = db;
    this._graph = {
      nodes: {},
      edges: {}
    };
  }

  _createClass(Graph, [{
    key: 'init',

    /**
     * Initialize vagabond.
     * @return {Promise} A Promise.
     */
    value: function init() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        // TODO make sure this is only called once

        _this._db.createValueStream({ gt: 'node:', lt: 'node:􏿿' }).on('data', function (data) {
          _this._graph.nodes[data.id] = new _NodeJs2['default'](_this, data.id, data.label);
          _this._graph.nodes[data.id]._properties = data.properties;
        }).on('error', function (error) {
          reject(error);
        }).on('end', function () {
          _this._db.createValueStream({ gt: 'edge:', lt: 'edge:􏿿' }).on('data', function (data) {
            _this._graph.edges[data.id] = new _EdgeJs2['default'](_this, data.id, data.label, _this._graph.nodes[data.from], _this._graph.nodes[data.to]);
            _this._graph.edges[data.id]._properties = data.properties;
          }).on('error', function (error) {
            reject(error);
          }).on('end', function () {
            resolve(_this);
          });
        });
      });
    }
  }, {
    key: 'addNode',

    /**
     * Adds a node to the graph.
     * @param {String} id The node's id.
     * @param {String} label The node's label.
     * @throws Error if id is already used.
     * @return {Promise} A Promise resolving to the {@link Node}.
     */
    value: function addNode(id, label) {
      if (typeof this._graph.nodes[id] !== 'undefined') {
        throw new Error('Duplicate key ' + id);
      }
      var node = new _NodeJs2['default'](this, id, label);
      this._graph.nodes[id] = node;

      return new Promise(function (resolve, reject) {
        node._persist().then(function (value) {
          return resolve(node);
        })['catch'](function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getNode',

    /**
     * Gets a node from the graph.
     * @param {String} id The node id.
     * @return {Promise} A Promise resolving to the {@link Node}.
     */
    value: function getNode(id) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (typeof _this2._graph.nodes[id] !== 'undefined') {
          resolve(_this2._graph.nodes[id]);
        } else {
          reject(new Error('Node ' + id + ' not found'));
        }
      });
    }
  }, {
    key: 'getNodes',

    /**
     * Get all of the nodes in the graph.
     * Note that this returns an ES6 Generator.
     * @return {Node} Generates Nodes.
     */
    value: regeneratorRuntime.mark(function getNodes() {
      var id;
      return regeneratorRuntime.wrap(function getNodes$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = regeneratorRuntime.keys(this._graph.nodes);

          case 1:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 7;
              break;
            }

            id = context$2$0.t1.value;
            context$2$0.next = 5;
            return this._graph.nodes[id];

          case 5:
            context$2$0.next = 1;
            break;

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, getNodes, this);
    })
  }, {
    key: 'removeNode',

    /**
     * Remove a node from the graph.
     * @param  {String} id The node id to remove.
     * @return {Promise} A Promise.
     */
    value: function removeNode(id) {
      var _this3 = this;

      // TODO remove all connected edges
      return new Promise(function (resolve, reject) {
        _this3._db.del('node:' + id, function (error) {
          if (error) {
            reject(error);
          } else {
            delete _this3._graph.nodes[id];
            resolve(null);
          }
        });
      });
    }
  }, {
    key: 'addEdge',

    /**
     * Adds an edge to the graph.
     * @param {String} id       The edge id.
     * @param {String} label    The edge label.
     * @param {Node} fromNode The from node.
     * @param {Node} toNode   The to node.
     * @return {Promise} A Promise resolving to the {@link Edge}.
     */
    value: function addEdge(id, label, fromNode, toNode) {
      if (typeof this._graph.edges[id] !== 'undefined') {
        throw new Error('Duplicate key ' + id);
      }

      var edge = new _EdgeJs2['default'](this, id, label, fromNode, toNode);
      this._graph.edges[id] = edge;

      return new Promise(function (resolve, reject) {
        Promise.all([edge._persist(), fromNode._persist(), toNode._persist()]).then(function (value) {
          return resolve(edge);
        })['catch'](function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'getEdge',

    /**
     * Get an edge.
     * @param  {String} id The edge id.
     * @return {Promise} Resolves to the {@link Edge}.
     */
    value: function getEdge(id) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (typeof _this4._graph.edges[id] !== 'undefined') {
          resolve(_this4._graph.edges[id]);
        } else {
          reject(new Error('Edge ' + id + ' not found'));
        }
      });
    }
  }, {
    key: 'getEdges',

    /**
     * Get all of the edges in the graph.
     * Note that this returns an ES6 Generator.
     * @return {Edge} Generates Edges.
     */
    value: regeneratorRuntime.mark(function getEdges() {
      var id;
      return regeneratorRuntime.wrap(function getEdges$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = regeneratorRuntime.keys(this._graph.edges);

          case 1:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 7;
              break;
            }

            id = context$2$0.t1.value;
            context$2$0.next = 5;
            return this._graph.edges[id];

          case 5:
            context$2$0.next = 1;
            break;

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, getEdges, this);
    })
  }, {
    key: 'removeEdge',

    /**
     * Remove an edge from the graph.
     * @param  {String} id The edge to remove.
     * @return {Promise} A Promise.
     */
    value: function removeEdge(id) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5._db.del('edge:' + id, function (error) {
          if (error) {
            reject(error);
          } else {
            // TODO remove references.
            delete _this5._graph.edges[id];
            resolve(null);
          }
        });
      });
    }
  }, {
    key: 'query',

    /**
     * Create a new graph query
     * @return {Query} the new Query.
     */
    value: function query() {
      return new _QueryJs2['default'](this);
    }
  }]);

  return Graph;
})();

exports['default'] = Graph;
module.exports = exports['default'];