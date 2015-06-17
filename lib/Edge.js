'use strict';

import Element from './Element.js';

class Edge extends Element {

  constructor(graph, id, label, from, to) {
    super(graph, id, label);
    this._from = from;
    this._to = to;
  }

}

export default Edge;
