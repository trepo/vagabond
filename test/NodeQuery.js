import Graph from '../src/Graph.js';
import Node from '../src/Node.js';
import Direction from '../src/Direction.js';
import NodeQuery from '../src/NodeQuery.js';

let expect = require('chai').expect;
let crypto = require('crypto');
let levelup = require('levelup');
let db;
let graph;
let node;

beforeEach(() => {
  db = levelup(crypto.randomBytes(64).toString('hex'), {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
  graph = new Graph(db);
  node = new Node(graph, 'n0', 'label');
});

describe('Query', () => {

  describe('Constructor', () => {

    it('Should Initialize', () => {
      let query = new NodeQuery(db);
      expect(query).to.be.instanceof(NodeQuery);
    });

  });

  describe('has', () => {

    it('Should accept 1 parameter', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label', node, values[2]),
          graph.addEdge('e4', 'label', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', true),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.OUT).has('foo');
        let expectedIDs = ['e1', 'e2'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept 2 parameters', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label', node, values[2]),
          graph.addEdge('e4', 'label', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH).has('foo', true);
        let expectedIDs = ['e1', 'e4'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

  });

  describe('hasNot', () => {

    it('Should accept 1 parameter', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label', node, values[2]),
          graph.addEdge('e4', 'label', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', true),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.OUT).hasNot('foo');
        let expectedIDs = ['e3'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept 2 parameters', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label', node, values[2]),
          graph.addEdge('e4', 'label', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH).hasNot('foo', true);
        let expectedIDs = ['e2', 'e3'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

  });

  describe('labels', () => {

    it('Should accept 0 parameters', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label', node, values[2]),
          graph.addEdge('e4', 'label', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH).labels();
        let expectedIDs = [];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept n parameters', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label1', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label3', node, values[2]),
          graph.addEdge('e4', 'label1', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH).labels('label1', 'label3');
        let expectedIDs = ['e1', 'e3', 'e4'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

  });

  describe('filter', () => {

    it('Should accept a function', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label1', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label3', node, values[2]),
          graph.addEdge('e4', 'label1', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH)
          .filter((properties, id, label) => {
            if (properties.foo) {
              return true;
            }
            return false;
          });
        let expectedIDs = ['e1', 'e4'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should pass properties, id, and label', (done) => {

      graph.addNode('n1', 'label')
      .then(newNode => {
        return Promise.all([
          graph.addEdge('e1', 'label', node, newNode)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH)
          .filter((properties, id, label) => {
            expect(properties).to.deep.equal({foo: true});
            expect(id).to.equal('e1');
            expect(label).to.equal('label');
            return true;
          });
        let expectedIDs = ['e1'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should error on not a function', (done) => {
      try {
        let query = new NodeQuery(node, Direction.BOTH)
          .filter('not a function, but a string :)');

        done(new Error('Should have thrown an error'));
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        done();
      }
    });

  });

  describe('edges', () => {

    it('Should filter correctly', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label1', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label3', node, values[2]),
          graph.addEdge('e4', 'label1', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[0].setProperty('bar', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH)
          .has('foo', true)
          .hasNot('bar');
        let expectedIDs = ['e4'];
        for (let edge of query.edges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

  });

  describe('nodes', () => {

    it('Should filter correctly', (done) => {

      Promise.all([
        graph.addNode('n1', 'label'),
        graph.addNode('n2', 'label'),
        graph.addNode('n3', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('e1', 'label1', node, values[0]),
          graph.addEdge('e2', 'label', node, values[1]),
          graph.addEdge('e3', 'label3', node, values[2]),
          graph.addEdge('e4', 'label1', values[0], node)
        ])
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false),
          values[3].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new NodeQuery(node, Direction.BOTH)
          .has('foo');
        let expectedIDs = ['n1', 'n2', 'n1'];
        for (let node of query.nodes()) {
          expect(expectedIDs).to.include(node.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

  });

});
