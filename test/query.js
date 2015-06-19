import Graph from '../lib/Graph.js';
import Query from '../lib/Query.js';

let expect = require('chai').expect;
let levelup = require('levelup');
let db = levelup('/does/not/matter', {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
let graph = new Graph(db);

describe('Query', function() {

  describe('Constructor', function() {

    it('Should Initialize');

  });

  describe('has', function() {

    it('Should accept 1 parameter', function(done) {

      Promise.all([
        graph.addNode('1234', 'label'),
        graph.addNode('5678', 'label'),
        graph.addNode('9012', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new Query(graph).has('foo');
        let expectedIDs = ['1234', '5678'];
        for (let node of query.nodes()) {
          expect(expectedIDs).to.include(node.id);
          // Remove it from the array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept 2 parameters');

  });

});
