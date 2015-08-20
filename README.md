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

* npm - `npm install trepo/vagabond`
* bower - `bower install trepo/vagabond`

# Building/Testing/Coverage

````bash
npm compile # es6(./src) -> es5(./lib)

npm test # runs all the tests using mocha

npm run coverage # istanbul code coverage output to ./coverage
````

# Documentation

View at [vagabond.trepo.io](http://vagabond.trepo.io/).

````bash
npm run doc # JSDoc output in ./doc
````

# License
[MIT](LICENSE)