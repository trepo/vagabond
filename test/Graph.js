const Graph = require('../src/Graph.js');
const GraphQuery = require('../src/GraphQuery.js');
const Memdown = require('memdown');

const {expect} = require('chai');
const crypto = require('crypto');
const levelup = require('levelup');
let name;
let graph;

beforeEach(() => {
  name = crypto.randomBytes(64).toString('hex');
  graph = new Graph({name: name, db: Memdown});
});

describe('Graph', function() {

  describe('Constructor', function() {

    it('Should Initialize', () => {
      expect(graph).to.be.instanceof(Graph);
    });

  });

  describe('init', function() {

    it('Should ignore multiple calls to init', done => {
      Promise.all([
          graph.addNode('1234', 'label'),
          graph.addNode('5678', 'label'),
          graph.addNode('9012', 'label')
        ])
        .then(values => {
          values[0].setProperty('foo', 'bar');
          values[1].setProperty('foo', 'bar');
          values[2].setProperty('foo', 'bar');
        })
        .then(ignored => {
          graph = new Graph({name: name, db: Memdown});
          for (let node of graph.getNodes()) {
            throw new Error('Should have had 0 nodes');
          }
          return graph.init();
        })
        .then(ignored => graph.init()) // Should only load nodes once
        .then(graph => {
          let expectedIDs = ['1234', '5678', '9012'];
          for (let node of graph.getNodes()) {
            expect(expectedIDs).to.include(node.id);
            // Remove id from the expected array
            expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
            expect(node._properties).to.deep.equal({foo: 'bar'});
          }
          expect(expectedIDs).to.deep.equal([]);
          done();
        })
        .catch(error => done(error));
    });

    it('Should load nodes', (done) => {
      Promise.all([
          graph.addNode('1234', 'label'),
          graph.addNode('5678', 'label'),
          graph.addNode('9012', 'label')
        ])
        .then(values => {
          values[0].setProperty('foo', 'bar');
          values[1].setProperty('foo', 'bar');
          values[2].setProperty('foo', 'bar');
        })
        .then(ignored => {
          graph = new Graph({name: name, db: Memdown});
          for (let node of graph.getNodes()) {
            throw new Error('Should have had 0 nodes');
          }
          return graph.init();
        })
        .then(graph => {
          let expectedIDs = ['1234', '5678', '9012'];
          for (let node of graph.getNodes()) {
            expect(expectedIDs).to.include(node.id);
            // Remove id from the expected array
            expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
            expect(node._properties).to.deep.equal({foo: 'bar'});
          }
          expect(expectedIDs).to.deep.equal([]);
          done();
        })
        .catch(error => done(error));
    });

    it('Should load edges', (done) => {
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
        .then(values => {
          return Promise.all([
              graph.addEdge('1234', 'label', values[0], values[1]),
              graph.addEdge('5678', 'label', values[0], values[1]),
              graph.addEdge('9012', 'label', values[0], values[1])
            ]);
        })
        .then(values => {
          values[0].setProperty('foo', 'bar');
          values[1].setProperty('foo', 'bar');
          values[2].setProperty('foo', 'bar');
        })
        .then(ignored => {
          graph = new Graph({name: name, db: Memdown});
          for (let edge of graph.getEdges()) {
            throw new Error('Should have had 0 edges');
          }
          return graph.init();
        })
        .then(graph => {
          let expectedIDs = ['1234', '5678', '9012'];
          for (let edge of graph.getEdges()) {
            expect(expectedIDs).to.include(edge.id);
            // Remove id from the expected array
            expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
            expect(edge._properties).to.deep.equal({foo: 'bar'});
          }
          expect(expectedIDs).to.deep.equal([]);
          done();
        })
        .catch(error => done(error));
    });

  });

  describe('Nodes', function() {

    it('Should add node', done => {
      graph.addNode('1234', 'label')
        .then(node => {
          expect(node.id).to.equal('1234');
          done();
        })
        .catch(error => done(error));
    });

    it('Should fail on duplicate node', done => {
      graph.addNode('1234', 'label')
        .catch(error => done(error))
        .then(ignored => graph.addNode('1234', 'label'))
        .then(node => done(new Error('Should have Errored')))
        .catch(error => done());
    });

    it('Should get node', done => {
      graph.addNode('1234', 'label')
        .then(ignored => graph.getNode('1234'))
        .then(node => {
          expect(node.id).to.equal('1234');
          done();
        })
        .catch(error => done(error));
    });

    it('Should remove node', done => {
      let remainingNode;

      Promise.all([
          graph.addNode('1234', 'label'),
          graph.addNode('5678', 'label')
        ])
        .then(values => {
          remainingNode = values[1];
          graph.addEdge('edge1', 'label', values[0], values[1]);
          graph.addEdge('edge2', 'label', values[1], values[0]);
        })
        .then(ignored => graph.getNode('1234'))
        .then(node => {
          expect(node.id).to.equal('1234');
          return graph.removeNode('1234');
        })
        .catch(error => done(error))
        .then(ignored => graph.getNode('1234'))
        // Get should error
        .then(value => new Error('Should have thrown error'),
          error => {
            expect(remainingNode._out).to.be.empty;
            expect(remainingNode._in).to.be.empty;
            expect(graph._edges).to.be.empty;
            done();
          })
        .catch(error => done(error));
    });

    it('Should get nodes', done => {
      Promise.all([
          graph.addNode('1234', 'label'),
          graph.addNode('5678', 'label'),
          graph.addNode('9012', 'label')
        ])
      .then(values => {
        let expectedIDs = ['1234', '5678', '9012'];
        for (let node of graph.getNodes()) {
          expect(expectedIDs).to.include(node.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

  });

  describe('Edges', function() {

    it('Should add edge', done => {
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
      .then(values => graph.addEdge('1234', 'label', values[0], values[1]))
      .then(ignored => graph.getEdge('1234'))
      .then(edge => {
        expect(edge.id).to.equal('1234');
        done();
      })
      .catch(error => done(error));
    });

    it('Should fail on duplicate edge', done => {
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
      .then(values => graph.addEdge('1234', 'label', values[0], values[1]))
      .catch(error => done(error))
      .then(values => graph.addEdge('1234', 'label', values[0], values[1]))
      .then(ignored => done(new Error('Should have errored')))
      .catch(error => done());
    });

    it('Should get edge', done => {
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
      .then(values => graph.addEdge('1234', 'label', values[0], values[1]))
      .then(edge => {
        expect(edge.id).to.equal('1234');
        done();
      })
      .catch(error => done(error));
    });

    it('Should remove edge', done => {
      let fromNode;
      let toNode;
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
        .then(values => {
          fromNode = values[0];
          toNode = values[1];
          return graph.addEdge('1234', 'label', fromNode, toNode);
        })
        .then(edge => {
          expect(edge.id).to.equal('1234');
          return graph.removeEdge('1234');
        })
        .catch(error => done(error))
        .then(ignored => graph.getEdge('1234'))
        // Get should error
        .then(value => done(new Error('Should have thrown error')),
          error => {
            expect(fromNode._out).to.be.empty;
            expect(toNode._in).to.be.empty;
            done();
          })
        .catch(error => done(error));
    });

    it('Should get edges', done => {
      Promise.all([
          graph.addNode('node1', 'label'),
          graph.addNode('node2', 'label')
        ])
      .then(values => Promise.all([
          graph.addEdge('1234', 'label', values[0], values[1]),
          graph.addEdge('5678', 'label', values[0], values[1]),
          graph.addEdge('9012', 'label', values[0], values[1])
        ]))
      .then(values => {
        let expectedIDs = ['1234', '5678', '9012'];
        for (let edge of graph.getEdges()) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

  });

  describe('query', function() {

    it('Should return a new query', () => {
      let query = graph.query();
      expect(query).to.be.instanceof(GraphQuery);
    });

  });

});
