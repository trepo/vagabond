const Node = require('../src/Node.js');
const Graph = require('../src/Graph.js');
const Direction = require('../src/Direction.js');
const Memdown = require('memdown');
const NodeQuery = require('../src/NodeQuery.js');

const {expect} = require('chai');
let db;
let graph;

beforeEach(() => {
  graph = new Graph({db: Memdown});
  db = graph._db;
});

describe('Node', () => {

  describe('Constructor', () => {

    it('Should Initialize', () => {
      let node = new Node(graph, '1234', 'label');
      expect(node.id).to.equal('1234');
      expect(node.label).to.equal('label');
    });

  });

  describe('addEdge', () => {

    it('Should work', done => {
      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => values[0].addEdge('edge1', 'label', values[1]))
      .then(edge => {
        expect(edge.id).to.equal('edge1');
        return Promise.all([
            edge.getNode(Direction.OUT),
            edge.getNode(Direction.IN)
          ]);
      })
      .then(values => {
        expect(values[0].id).to.equal('1234');
        expect(values[1].id).to.equal('5678');
        done();
      })
      .catch(error => done(error));
    });

    it('Should Error on circular references', done => {
      let node = new Node(graph, '1234', 'label');

      try {
        node.addEdge('edge1', 'label', node);
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        return done();
      }

      done(new Error('Should have thrown error'));
    });

  });

  describe('getEdges', () => {

    it('Should return in edges', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => {
        node = values[1];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[1]),
            values[0].addEdge('edge3', 'label3', values[1])
          ]);
      })
      .then(values => {
        let expectedIDs = ['edge1', 'edge2', 'edge3'];
        for (let edge of node.getEdges(Direction.IN)) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should filter in edges', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => {
        node = values[1];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[1]),
            values[0].addEdge('edge3', 'label3', values[1])
          ]);
      })
      .then(values => {
        let expectedIDs = ['edge1', 'edge2'];
        for (let edge of node.getEdges(Direction.IN, 'label1', 'label2')) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should return out edges', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[1]),
            values[0].addEdge('edge3', 'label3', values[1])
          ]);
      })
      .then(values => {
        let expectedIDs = ['edge1', 'edge2', 'edge3'];
        for (let edge of node.getEdges(Direction.OUT)) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should filter out edges', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[1]),
            values[0].addEdge('edge3', 'label3', values[1])
          ]);
      })
      .then(values => {
        let expectedIDs = ['edge1', 'edge2'];
        for (let edge of node.getEdges(Direction.OUT, 'label1', 'label2')) {
          expect(expectedIDs).to.include(edge.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(edge.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should return in and out edges', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[1]),
            values[1].addEdge('edge3', 'label3', values[0])
          ]);
      })
      .then(values => {
        let expectedIDs = ['edge1', 'edge2', 'edge3'];
        for (let edge of node.getEdges(Direction.BOTH)) {
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

  describe('getNodes', () => {

    it('Should return in nodes', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist(),
        new Node(graph, '9012', 'label')._persist(),
        new Node(graph, '3456', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[1].addEdge('edge1', 'label1', values[0]),
            values[2].addEdge('edge2', 'label2', values[0]),
            values[3].addEdge('edge3', 'label3', values[0])
          ]);
      })
      .then(values => {
        let expectedIDs = ['5678', '9012', '3456'];
        for (let inNode of node.getNodes(Direction.IN)) {
          expect(expectedIDs).to.include(inNode.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(inNode.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should filter in nodes', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist(),
        new Node(graph, '9012', 'label')._persist(),
        new Node(graph, '3456', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[1].addEdge('edge1', 'label1', values[0]),
            values[2].addEdge('edge2', 'label2', values[0]),
            values[3].addEdge('edge3', 'label3', values[0])
          ]);
      })
      .then(values => {
        let expectedIDs = ['5678', '9012'];
        for (let inNode of node.getNodes(Direction.IN, 'label1', 'label2')) {
          expect(expectedIDs).to.include(inNode.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(inNode.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should return out nodes', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist(),
        new Node(graph, '9012', 'label')._persist(),
        new Node(graph, '3456', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[2]),
            values[0].addEdge('edge3', 'label3', values[3])
          ]);
      })
      .then(values => {
        let expectedIDs = ['5678', '9012', '3456'];
        for (let outNode of node.getNodes(Direction.OUT)) {
          expect(expectedIDs).to.include(outNode.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(outNode.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should filter out nodes', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist(),
        new Node(graph, '9012', 'label')._persist(),
        new Node(graph, '3456', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[2]),
            values[0].addEdge('edge3', 'label3', values[3])
          ]);
      })
      .then(values => {
        let expectedIDs = ['5678', '9012'];
        for (let outNode of node.getNodes(Direction.OUT, 'label1', 'label2')) {
          expect(expectedIDs).to.include(outNode.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(outNode.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

    it('Should return in and out nodes', done => {
      let node;

      Promise.all([
        new Node(graph, '1234', 'label')._persist(),
        new Node(graph, '5678', 'label')._persist(),
        new Node(graph, '9012', 'label')._persist(),
        new Node(graph, '3456', 'label')._persist()
        ])
      .then(values => {
        node = values[0];
        return Promise.all([
            values[0].addEdge('edge1', 'label1', values[1]),
            values[0].addEdge('edge2', 'label2', values[2]),
            values[3].addEdge('edge3', 'label3', values[0])
          ]);
      })
      .then(values => {
        let expectedIDs = ['5678', '9012', '3456'];
        for (let bothNode of node.getNodes(Direction.BOTH)) {
          expect(expectedIDs).to.include(bothNode.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(bothNode.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      })
      .catch(error => done(error));
    });

  });

  describe('query', function() {

    it('Should return a new query', () => {
      let node = new Node(graph, '1234', 'label');
      expect(node.query()).to.be.instanceof(NodeQuery);
    });

  });

  describe('Persistence', () => {

    it('Should Persist on a property change', done => {
      let node = new Node(graph, '1234', 'label');

      node
        .setProperty('key', 'value')
        .then(value => {

          expect(value).to.be.an.instanceof(Node);
          expect(value).to.deep.equal(node);

          db.get('n:1234', (error, value) => {
            expect(error).to.be.null;
            expect(JSON.parse(value)).to.deep.equal([
              '1234',
              'label',
              {key: 'value'}
            ]);
            done();
          });
        }, error => done(error));
    });

  });

});
