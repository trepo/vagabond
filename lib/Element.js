'use strict';

class Element {

  /**
   * @param  {String} id The Element's id.
   * @param  {String} label The Elements label.
   * @return {Element} The Element.
   */
  constructor(graph, id, label) {
    this._graph = graph;
    this._id = id;
    this._label = label;
    this._properties = {};
  }

  get id() {
    return this._id;
  }

  set id(value) {
    throw new Error('id is immutable');
  }

  get label() {
    return this._label;
  }

  get properties() {
    return this._properties;
  }

  addProperty(key, value) {
    this.properties[key] = value;
  }

  removeProperty(key) {
    delete this.properties[key];
  }
}

export default Element;
