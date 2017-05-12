const Direction = require('../src/Direction.js');

const {expect} = require('chai');

describe('Direction', () => {

  it('Should contain the appropriate symbols (only in, out, both)', () => {
    expect(Direction).to.have.all.keys(['IN', 'OUT', 'BOTH']);
  });

});
