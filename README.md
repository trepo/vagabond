# Vagabond
A Javascript Graph Database backed by LevelUp and written in ES6.

# Example

````javascript
'use strict';

import Graph from 'vagabond-db';

let graph = new Graph({
  db: LevelDown, // Defaults to Memdown
  name: 'my-graph' // Defaults to a new UUIDv4
});

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

* npm - `npm install vagabond-db`

# Testing/Coverage

````bash
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