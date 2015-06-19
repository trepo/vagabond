'use strict';

import Element from './Element.js';

// Note: extends works in IE >= 11
class Node extends Element {

  constructor(graph, id, label) {
    super(graph, id, label);
    this._out = {};
    this._in = {};
  }

  _persist() {
    return new Promise((resolve, reject) => {
      this._graph._db.put('node:' + this._id, {
        id: this._id,
        label: this._label,
        properties: this._properties
      }, error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      })
    });
  }

}

export default Node;
