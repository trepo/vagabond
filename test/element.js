import Element from '../src/Element.js';
import Graph from '../src/Graph.js';

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

describe('Element', () => {

  describe('Constructor', () => {

    it('Should Initialize', () => {
      let element = new Element(graph, '1234', 'label');
      expect(element.id).to.equal('1234');
      expect(element.label).to.equal('label');

      element.getProperties().then(properties => {
        expect(properties).to.deep.equal({});
        done();
      }).catch(error => done(error));

    });

  });

  describe('Getters & Setters', () => {

    it('Should get id', () => {
      let element = new Element(graph, '1234', 'label');
      expect(element.id).to.equal('1234');
    });

    it('Should Error on setting id', () => {
      let element = new Element(graph, '1234', 'label');
      expect(() => element.id = 'foo').to.throw(Error);
    });

    it('Should get label', () => {
      let element = new Element(graph, '1234', 'label');
      expect(element.label).to.equal('label');
    });

    it('Should Error on setting label', () => {
      let element = new Element(graph, '1234', 'label');
      expect(() => element.label = 'foo').to.throw(Error);
    });

  });

  describe('Properties', () => {

    it('Should get property keys', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getPropertyKeys())
        .then(keys => {
          expect(keys).to.deep.equal(['key1', 'key2', 'key3']);
          done();
        })
        .catch(error => done(error));
    });

    it('Should get property', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getProperty('key3'))
        .then(property => {
          expect(property).to.equal('A String!');
          done();
        })
        .catch(error => done(error));
    });

    it('Should set property', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.getProperty('key3')
        .then(property => {
          expect(property).to.equal(undefined);
          return element.setProperties({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
        })
        .then(element => element.getProperty('key3'))
        .then(property => {
          expect(property).to.equal('A String!');
          done();
        })
        .catch(error => done(error));
    });

    it('Should set properties', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.getProperties()
        .then(properties => {
          expect(properties).to.deep.equal({});
          return element.setProperties({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
          done();
        })
        .catch(error => done(error));
    });

    it('Should overwrite properties', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
          return element.setProperties({
            key1: false,
            key4: 'A new String!'
          });
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: false,
            key4: 'A new String!'
          });
          done();
        })
        .catch(error => done(error));
    });

    it('Should remove property', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
          return element.removeProperty('key3');
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false
          });
          done();
        })
        .catch(error => done(error));
    });

    it('Should remove all properties', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
          return element.removeProperties();
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({});
          done();
        })
        .catch(error => done(error));
    });

    it('Should remove select properties', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist
      element._persist = () => Promise.resolve(element);

      element.setProperties({
          key1: true,
          key2: false,
          key3: 'A String!'
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key1: true,
            key2: false,
            key3: 'A String!'
          });
          return element.removeProperties(['key1', 'key3']);
        })
        .then(element => element.getProperties())
        .then(properties => {
          expect(properties).to.deep.equal({
            key2: false
          });
          done();
        })
        .catch(error => done(error));
    });

    it('Should persist on property changes', (done) => {
      let element = new Element(graph, '1234', 'label');
      // Fake persist and record calls
      let count = 0;
      element._persist = () => {
        count++;
        return Promise.resolve(element);
      }

      element.setProperty('foo', 'bar')
        .then(element => {
          expect(count).to.equal(1);
          return Promise.resolve(element);
        })
        .then(element =>  element.setProperties({key1: true, key2: false}))
        .then(element => {
          expect(count).to.equal(2);
          return Promise.resolve(element);
        })
        .then(element => element.removeProperty('key1'))
        .then(element => {
          expect(count).to.equal(3);
          return Promise.resolve(element);
        })
        .then(element => element.removeProperties(['key2']))
        .then(element => {
          expect(count).to.equal(4);
          done();
        })
        .catch(error => done(error));
    });

  });

});
