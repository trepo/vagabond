import Element from '../lib/Element.js';
import Graph from '../lib/Graph.js';

let expect = require('chai').expect;
let levelup = require('levelup');
// TODO make a new db for each test?
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

    it('Should get id');

    it('Should Error on setting id', function() {
      let element = new Element(null, '1234', 'label');
      expect(() => element.id = 'foo').to.throw(Error);
    });

    it('Should get label');

    it('Should Error on setting label', function() {
      let element = new Element(null, '1234', 'label');
      expect(() => element.label = 'foo').to.throw(Error);
    });

  });

  describe('Properties', function() {

    it('Should get property keys');

    it('Should get property');

    it('Should set property');

    it('Should overwrite properties');

    it('Should remove property');

    it('Should remove properties');

    it('Should persist on property changes');

  });

});
