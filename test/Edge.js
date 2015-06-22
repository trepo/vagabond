import Edge from '../lib/Node.js';
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

  describe('getNode', function() {

    it('Should get in node');

    it('Should get out node');

    it('Should Error on invalid direction');

  });

  describe('Persistence', function() {

    it('Should Persist on a property change');

  });

});
