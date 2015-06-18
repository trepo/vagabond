import Node from '../lib/Node.js';
import Graph from '../lib/Graph.js';

let expect = require('chai').expect;
let levelup = require('levelup');
let db = levelup('/does/not/matter', {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
let graph = new Graph(db);

describe('Node', function() {

  describe('Constructor', function() {

    it('Should Initialize');

  });

  describe('Getters & Setters', function() {

    it('Should Error on setting id');

    it('Should Error on setting label');

  });

  describe('Properties', function() {

    it('Should add property');

  });

  describe('Persistence', function() {

    it('Should Persist on adding a property', function(done) {
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
    it('Should Persist on removing a property');

  });

});
