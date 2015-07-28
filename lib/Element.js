'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * An Element in the Graph, either a Node or Edge.
 * Note that this is more of an abstract class, as it is never directly instantiated.
 */

var Element = (function () {

  /**
   * @param {Graph} graph The Graph.
   * @param  {String} id The Element's id.
   * @param  {String} label The Elements label.
   * @return {Element} The Element.
   */

  function Element(graph, id, label) {
    _classCallCheck(this, Element);

    this._graph = graph;
    this._id = id;
    this._label = label;
    this._properties = {};
  }

  _createClass(Element, [{
    key: 'getPropertyKeys',

    /**
     * Gets all of the elements property keys.
     * @return {Promise} A Promise resolving array of the property keys.
     */
    value: function getPropertyKeys() {
      return Promise.resolve(Object.keys(this._properties));
    }
  }, {
    key: 'getProperty',

    /**
     * Get a property.
     * @param  {String} key The property key.
     * @return {Promise} Resolves to the value of the property.
     */
    value: function getProperty(key) {
      return Promise.resolve(this._properties[key]);
    }
  }, {
    key: 'getProperties',

    /**
     * Get all of the properties of this element.
     * @return {Promise} Resolves to a map of the properties.
     */
    value: function getProperties() {
      return Promise.resolve(this._properties);
    }
  }, {
    key: 'setProperty',

    /**
     * Set a property.
     * @param {String} key The property key.
     * @param {String} value The property value.
     * @return {Promise} Resolves to this element.
     */
    value: function setProperty(key, value) {
      this._properties[key] = value;
      return this._persist();
    }
  }, {
    key: 'setProperties',

    /**
     * Overwrite the properties of this element.
     * @param {Object} properties A map of properties.
     * @return {Promise} Resolves to this element.
     */
    value: function setProperties(properties) {
      this._properties = properties;
      return this._persist();
    }
  }, {
    key: 'removeProperty',

    /**
     * Remove a property.
     * @param  {String} key The property key.
     * @return {Promise} Resolves to this element.
     */
    value: function removeProperty(key) {
      delete this._properties[key];
      return this._persist();
    }
  }, {
    key: 'removeProperties',

    /**
     * Remove a set of properties.
     * @param  {String} [keys] An optional array of keys to remove.
     * @return {Promise} Resolves to this element.
     */
    value: function removeProperties(keys) {
      if (keys) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            delete this._properties[key];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        this._properties = {};
      }
      return this._persist();
    }
  }, {
    key: 'id',

    /**
     * The element's id.
     * @throws {Error} If any change is made.
     */
    get: function () {
      return this._id;
    },
    set: function (value) {
      throw new Error('id is immutable');
    }
  }, {
    key: 'label',

    /**
     * The element's label.
     * @throws {Error} If any change is made.
     */
    get: function () {
      return this._label;
    },
    set: function (value) {
      throw new Error('label is immutable');
    }
  }]);

  return Element;
})();

exports['default'] = Element;
module.exports = exports['default'];