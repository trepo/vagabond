'use strict';

import Element from './Element.js';

// Note: extends works in IE >= 11
class Node extends Element {

  constructor(graph, id, label) {
    super(graph, id, label);
    this._out = [];
    this._in = [];
  }

}

export default Node;
