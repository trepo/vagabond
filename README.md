# Vagabond
A Javascript Graph Database backed by LevelUp and written in ES6.

# Example

````javascript
'use strict';

import Graph from 'vagabond.js';

let graph = new Graph(levelUp);

graph.init()
  .then(graph => {
    return graph.addNode('1234', 'label');
  })
  .then(node => {
    return node.setProperty('key', 'value');
  })
  .catch(error => {
    console.error(error);
  });

````

# Installation

* npm
* bower
* es6 module

# Documentation
// TODO point to jsdoc?

# License
// TODO