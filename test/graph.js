import Graph from '../lib/Graph';

let expect = require('chai').expect;
let levelup = require('levelup');
let db = levelup('/does/not/matter', {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });

describe('Graph', function() {

  it('ES6/Babel work', function() {
    expect(true).to.equal(true);
  });

  it('Graph work', function() {
    let graph = new Graph(db);
    graph.addNode('1234', 'foo');
    expect(graph.getNode('1234').label).to.equal('foo');
  });

});
