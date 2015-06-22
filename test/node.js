import Node from '../lib/Node.js';
import Graph from '../lib/Graph.js';

let expect = require('chai').expect;
let levelup = require('levelup');
let db;
let graph;

beforeEach(() => {
  db = levelup('/does/not/matter', {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
  graph = new Graph(db);
});

describe('Node', function() {

  describe('Constructor', function() {

    it('Should Initialize');

  });

  describe('addEdge', function() {

    it('Should work');

    it('Should Error on circular references');

  });

  describe('getEdges', function() {

    it('Should return in edges');

    it('Should filter in edges');

    it('Should return out edges');

    it('Should filter out edges');

    it('Should return in and out edges');

  });

  describe('getNodes', function() {

    it('Should return in nodes');

    it('Should filter in nodes');

    it('Should return out nodes');

    it('Should filter out nodes');

    it('Should return in and out nodes');

  });

  describe('Persistence', function() {

    it('Should Persist on a property change', function(done) {
      let node = new Node(graph, '1234', 'label');

      node
        .setProperty('key', 'value')
        .then(value => {

          expect(value).to.be.an.instanceof(Node);
          expect(value).to.deep.equal(node);

          db.get('node:1234', (error, value) => {
            expect(error).to.be.null;
            expect(value.properties['key']).to.equal('value');
            done();
          });
        }, error => done(error));
    });

  });

});
