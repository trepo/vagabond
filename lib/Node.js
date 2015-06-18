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
    let self = this;
    return new Promise(function(resolve, reject) {
      self._graph._db.put('node:' + self._id, {
        id: self._id,
        label: self._label,
        properties: self._properties
      }, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve(self);
        }
      })
    });
  }

}

export default Node;
