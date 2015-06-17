'use strict';

import Element from './Element.js';

class Edge extends Element {

  constructor(graph, id, label, from, to) {
    super(graph, id, label);
    this._from = from;
    from._out.push(this);
    this._to = to;
    to._in.push(this);
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

}

export default Edge;
