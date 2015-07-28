'use strict';

/**
 * The direction of an edge.
 *
 * Node --OUT--> Edge --IN--> Node
 *
 * Possible Values:
 * * IN
 * * OUT
 * * BOTH
 * @type {Object}
 */
let Direction = {
  IN: Symbol('IN'),
  OUT: Symbol('OUT'),
  BOTH: Symbol('BOTH')
}

export default Direction;
