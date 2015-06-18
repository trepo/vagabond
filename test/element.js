import Element from '../lib/Element.js';
import Graph from '../lib/Graph.js';

let expect = require('chai').expect;
let levelup = require('levelup');
let db = levelup('/does/not/matter', {
    db: require('memdown'),
    keyEncoding: 'json',
    valueEncoding: 'json'
  });
let graph = new Graph(db);

describe('Element', function() {

  describe('Constructor', function() {

    it('Should Initialize', function() {
      let element = new Element(graph, '1234', 'label');
      expect(element.id).to.equal('1234');
      expect(element.label).to.equal('label');
      // TODO ensure properties is empty
      //expect(element.properties).to.deep.equal({});
    });

  });

  describe('Getters & Setters', function() {

    it('Should Error on setting id', function() {
      let element = new Element(null, '1234', 'label');
      expect(() => element.id = 'foo').to.throw(Error);
    });

    it('Should Error on setting label', function() {
      let element = new Element(null, '1234', 'label');
      expect(() => element.label = 'foo').to.throw(Error);
    });

  });

  describe('Properties', function() {

    it('Should add property', function() {
      //let element = new Element(null, '1234', 'label');
      //delete element.properties;
    });

  });

});
