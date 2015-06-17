import Element from '../lib/Element.js';

let expect = require('chai').expect;

describe('Element', function() {

  describe('Constructor', function() {

    it('Should Initialize', function() {
      let element = new Element('1234', 'label');
      expect(element.id).to.equal('1234');
      expect(element.label).to.equal('label');
      expect(element.properties).to.deep.equal({});
    });

  });

});
