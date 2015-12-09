import Edge from '../src/Edge.js';
import Node from '../src/Node.js';
import Graph from '../src/Graph.js';
import Direction from '../src/Direction.js';

let expect = require('chai').expect;
let crypto = require('crypto');
let levelup = require('levelup');
let db;
let graph;

beforeEach(() => {
  db = levelup(crypto.randomBytes(64).toString('hex'), {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
  graph = new Graph({db: db});
});

describe('Edge', () => {

  describe('Constructor', () => {

    it('Should Initialize', () => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);
      expect(edge.id).to.equal('1234');
      expect(edge.label).to.equal('label');
    });

  });

  describe('Getters & Setters', () => {

    it('Should get from', () => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);
      expect(edge.from).to.equal('node1');
    });

    it('Should Error on setting from', () => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);
      expect(() => edge.from = 'foo').to.throw(Error);
    });

    it('Should get to', () => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);
      expect(edge.to).to.equal('node2');
    });

    it('Should Error on setting to', () => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);
      expect(() => edge.to = 'foo').to.throw(Error);
    });

  });

  describe('getNode', () => {

    it('Should get in node', done => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);

      edge.getNode(Direction.IN)
        .then(node => {
          expect(node.id).to.equal('node2');
          done();
        })
        .catch(error => done(error));

    });

    it('Should get out node', done => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);

      edge.getNode(Direction.OUT)
        .then(node => {
          expect(node.id).to.equal('node1');
          done();
        })
        .catch(error => done(error));

    });

    it('Should Error on invalid direction', done => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);

      try {
        edge.getNode('BOGUS');
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        return done();
      }

      done(new Error('Should have thrown error'));

    });

  });

  describe('Persistence', () => {

    it('Should Persist on a property change', done => {
      let node1 = new Node(graph, 'node1', 'label');
      let node2 = new Node(graph, 'node2', 'label');
      let edge = new Edge(graph, '1234', 'label', node1, node2);

      Promise.all([
          node1._persist(),
          node2._persist(),
          edge._persist()
        ])
        .then(ignored => edge.setProperty('foo', 'bar'))
        .then(edge => {
          db.get('edge:1234', (error, value) => {
            expect(error).to.be.null;
            expect(value).to.deep.equal({
              id: '1234',
              label: 'label',
              from: 'node1',
              to: 'node2',
              properties: {foo: 'bar'}
            });
            done();
          });
        })
        .catch(error => done(error));

    });

  });

});
