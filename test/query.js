import Graph from '../src/Graph.js';
import Query from '../src/Query.js';

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
  graph = new Graph(db);
});

describe('Query', () => {

  describe('Constructor', () => {

    it('Should Initialize', () => {
      let query = new Query(db);
      expect(query).to.be.instanceof(Query);
    });

  });

  describe('has', () => {

    it('Should accept 1 parameter', (done) => {

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
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept 2 parameters', (done) => {

      Promise.all([
        graph.addNode('1234', 'label'),
        graph.addNode('5678', 'label'),
        graph.addNode('9012', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false)
        ])
      }).then(values => {
        let query = new Query(graph).has('foo', true);
        let expectedIDs = ['1234'];
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

  describe('hasNot', () => {

    it('Should accept 1 parameter', (done) => {

      Promise.all([
        graph.addNode('1234', 'label'),
        graph.addNode('5678', 'label'),
        graph.addNode('9012', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true)
        ])
      }).then(values => {
        let query = new Query(graph).hasNot('foo');
        let expectedIDs = ['5678', '9012'];
        for (let node of query.nodes()) {
          expect(expectedIDs).to.include(node.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should accept 2 parameters', (done) => {

      Promise.all([
        graph.addNode('1234', 'label'),
        graph.addNode('5678', 'label'),
        graph.addNode('9012', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false)
        ])
      }).then(values => {
        let query = new Query(graph).hasNot('foo', true);
        let expectedIDs = ['5678', '9012'];
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

  describe('filter', () => {

    it('Should accept a function', (done) => {

      Promise.all([
        graph.addNode('1234', 'label'),
        graph.addNode('5678', 'label'),
        graph.addNode('9012', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', false)
        ])
      }).then(values => {
        let query = new Query(graph).filter((properties, id, label) => {
          if (properties.foo) {
            return true;
          }
          return false;
        });
        let expectedIDs = ['1234'];
        for (let node of query.nodes()) {
          expect(expectedIDs).to.include(node.id);
          // Remove id from the expected array
          expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
        }
        expect(expectedIDs).to.deep.equal([]);
        done();
      }).catch(error => done(error));

    });

    it('Should pass properties, id, and label', (done) => {
      graph
        .addNode('1234', 'label')
        .then((node) => node.setProperty('foo', true))
        .then((node) => {
          let query = new Query(graph).filter((properties, id, label) => {
            expect(properties).to.deep.equal({foo: true});
            expect(id).to.equal('1234');
            expect(label).to.equal('label');
            return true;
          });
          let expectedIDs = ['1234'];
          for (let node of query.nodes()) {
            expect(expectedIDs).to.include(node.id);
            // Remove id from the expected array
            expectedIDs.splice(expectedIDs.indexOf(node.id), 1);
          }
          expect(expectedIDs).to.deep.equal([]);
          done();
        })
        .catch(error => done(error));
    });

    it('Should error on not a function', (done) => {
      graph
        .addNode('1234', 'label')
        .then((node) => {
          try {
            new Query(graph).filter('not a function');
            return done(new Error('Should have thrown an error'));
          } catch (error) {
            expect(error).to.be.instanceof(Error);
          }

          done();
        })
        .catch(error => done(error));
    });

  });

  describe('edges', () => {

    it('Should filter correctly', (done) => {

      Promise.all([
        graph.addNode('node-1', 'label'),
        graph.addNode('node-2', 'label')
      ]).then(values => {
        return Promise.all([
          graph.addEdge('1', 'label', values[0], values[1]),
          graph.addEdge('2', 'label', values[0], values[1]),
          graph.addEdge('3', 'label', values[0], values[1]),
          graph.addEdge('4', 'label', values[0], values[1]),
          graph.addEdge('5', 'label', values[0], values[1])
        ]);
      }).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', true),
          values[2].setProperty('foo', true),
          values[3].setProperty('foo', false)
        ]);
      }).then(values => {
        let query = new Query(graph);

        query
          .has('foo', true)
          .filter((properties, id, label) => {
            if (id == '1' || id == '2') {
              return true;
            }
            return false;
          });
        let expectedIDs = ['1', '2'];
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
        graph.addNode('1', 'label'),
        graph.addNode('2', 'label'),
        graph.addNode('3', 'label'),
        graph.addNode('4', 'label'),
        graph.addNode('5', 'label')
      ]).then(values => {
        return Promise.all([
          values[0].setProperty('foo', true),
          values[1].setProperty('foo', true),
          values[2].setProperty('foo', true),
          values[3].setProperty('foo', false)
        ]);
      }).then(values => {
        let query = new Query(graph);

        query
          .has('foo', true)
          .filter((properties, id, label) => {
            if (id == '1' || id == '2') {
              return true;
            }
            return false;
          });
        let expectedIDs = ['1', '2'];
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
