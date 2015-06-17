'use strict';

import Element from './Element.js';

class Node extends Element {

  constructor(graph, id, label) {
    super(graph, id, label);
    this._out = [];
    this._in = [];
  }

}

export default Node;
