const Edge = require('../src/Edge.js');
const Node = require('../src/Node.js');
const Graph = require('../src/Graph.js');
const Direction = require('../src/Direction.js');
const Memdown = require('memdown');

const {expect} = require('chai');
let db;
let graph;

beforeEach(() => {
  graph = new Graph({db: Memdown});
  db = graph._db;
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
          db.get('e:1234', (error, value) => {
            expect(error).to.be.null;
            expect(value).to.deep.equal([
              '1234',
              'label',
              'node1',
              'node2',
              {foo: 'bar'}
            ]);
            done();
          });
        })
        .catch(error => done(error));

    });

  });

});
