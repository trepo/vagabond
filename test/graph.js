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

describe('Graph', function() {

  describe('Constructor', function() {

    it('Should Initialize');

  });

  describe('init', function() {

    it('Should load nodes');

    it('Should load edges');

    it('Should handle db errors');

  });

  describe('Nodes', function() {

    it('Should add node');

    it('Should get node');

    it('Should remove node');

    it('Should get nodes');

  });

  describe('Edges', function() {

    it('Should add edge');

    it('Should get edge');

    it('Should remove edge');

    it('Should get edges');

  });

  describe('query', function() {

    it('Should retur a new query');

  });

});
