'use strict';

import Element from './Element.js';

class Edge extends Element {

  constructor(graph, id, label, from, to) {
    super(graph, id, label);
    this._from = from;
    from._out[id] = this;
    this._to = to;
    to._in[id] = this;
  }

  get from() {
    return this._from;
  }

  set from(value) {
    throw new Error('Connections are immutable');
  }

  get to() {
    return this._to;
  }

  set to(value) {
    throw new Error('Connections are immutable');
  }

  getNode() {
    // TODO
  }

  _persist() {
    let self = this;
    return new Promise(function(resolve, reject) {
      graph._db.put('edge:' + self._id, {
        id: self._id,
        label: self._label,
        from: self._from._id,
        to: self._to._id,
        properties: self._properties
      }, error => {
        if (error) {
          reject(error);
        } else {
          resolve(self);
        }
      })
    });
  }

}

export default Edge;
