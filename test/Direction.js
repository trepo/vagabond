import Direction from '../src/Direction.js';

let expect = require('chai').expect;

describe('Direction', () => {

  it('Should contain the appropriate symbols (only in, out, both)', () => {
    expect(Direction).to.have.all.keys(['IN', 'OUT', 'BOTH']);
  });

});
