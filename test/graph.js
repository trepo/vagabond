import Graph from '../lib/Graph';

let expect = require('chai').expect;

describe('Graph', function(){
  
  it('ES6/Babel work', function() {
    expect(true).to.equal(true);
  });

  it('Graph work', function() {
    let graph = new Graph();
    expect(graph.name).to.equal("foo");
  });

});