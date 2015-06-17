import Graph from '../lib/Graph';

let expect = require('chai').expect;

describe('Graph', function() {

  it('ES6/Babel work', function() {
    expect(true).to.equal(true);
  });

  it('Graph work', function() {
    let graph = new Graph();
    graph.addNode('1234', 'foo');
    expect(graph.getNode('1234').label).to.equal('foo');
  });

});
