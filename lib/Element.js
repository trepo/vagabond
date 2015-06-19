'use strict';

/**
 * An Element in the Graph, either a Node or Edge.
 * Note that this is more of an abstract class, as it is never directly instantiated.
 */
class Element {

  /**
   * @param {Graph} graph The Graph.
   * @param  {String} id The Element's id.
   * @param  {String} label The Elements label.
   * @return {Element} The Element.
   */
  constructor(graph, id, label) {
    this._graph = graph;
    this._id = id;
    this._label = label;
    // TODO change this to a map?
    this._properties = {};
  }

  /**
   * The element's id.
   * @throws {Error} If any change is made.
   */
  get id() {
    return this._id;
  }

  set id(value) {
    throw new Error('id is immutable');
  }

  /**
   * The element's label.
   * @throws {Error} If any change is made.
   */
  get label() {
    return this._label;
  }

  set label(value) {
    throw new Error('label is immutable');
  }

  getPropertyKeys() {
    // TODO
  }

  /**
   * Get a property.
   * @param  {String} key The property key.
   * @return {Promise} Resolves to the value of the property.
   */
  getProperty(key) {
    return new Promise((resolve, reject) => {
      resolve(this._properties[key]);
    });
  }

  /**
   * Get all of the properties of this element.
   * @return {Promise} Resolves to a map of the properties.
   */
  getProperties() {
    return new Promise((resolve, reject) => {
      resolve(this._properties);
    });
  }

  /**
   * Set a property.
   * @param {String} key The property key.
   * @param {String} value The property value.
   * @return {Promise} Resolves to this element.
   */
  setProperty(key, value) {
    this._properties[key] = value;
    return this._persist();
  }

  /**
   * Overwrite the properties of this element.
   * @param {Object} properties A map of properties.
   * @return {Promise} Resolves to this element.
   */
  setProperties(properties) {
    // TODO
    return this._persist();
  }

  /**
   * Remove a property.
   * @param  {String} key The property key.
   * @return {Promise} Resolves to this element.
   */
  removeProperty(key) {
    delete this._properties[key];
    return this._persist();
  }

  /**
   * Remove a set of proeprties.
   * @param  {String} [keys] An optional list of keys to remove.
   * @return {Promise} Resolves to this element.
   */
  removeProperties(keys) {
    // TODO
    return this._persist();
  }
}

export default Element;
