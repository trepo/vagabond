'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
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
var Direction = {
  IN: Symbol('IN'),
  OUT: Symbol('OUT'),
  BOTH: Symbol('BOTH')
};

exports['default'] = Direction;
module.exports = exports['default'];