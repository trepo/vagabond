import Element from '../lib/Element.js';

let expect = require('chai').expect;

describe('Element', function() {

  describe('Constructor', function() {

    it('Should Initialize', function() {
      let element = new Element(null, '1234', 'label');
      expect(element.id).to.equal('1234');
      expect(element.label).to.equal('label');
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
      let element = new Element(null, '1234', 'label');
      element.properties.foo = 'bar';
    });

  });

});
