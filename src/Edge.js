'use strict';

import Element from './Element.js';
import Direction from './Direction.js';

/**
 * An edge in the graph.
 */
// Note: extends only works in IE >= 11
class Edge extends Element {

  /**
   * Create a new Edge
   * @param  {Graph} graph The graph instance.
   * @param  {String} id The edge id.
   * @param  {String} label The edge label.
   * @param  {Node} from The node this edge goes from.
   * @param  {Node} to The node this edge goes to.
   * @return {Edge} The new edge.
   */
  constructor(graph, id, label, from, to) {
    super(graph, id, label);
    this._from = from;
    from._out[id] = this;
    this._to = to;
    to._in[id] = this;
  }

  /**
   * Get a node in the specified Direction.
   * @param  {Direction} direction The direction.
   * @return {Promise} Resolves to the Node.
   */
  getNode(direction) {
    switch (direction) {
      case Direction.IN:
        return Promise.resolve(this._to);
      case Direction.OUT:
        return Promise.resolve(this._from);
      default:
        throw new Error('Invalid Direction');
    }
  }

  /***
   * Persist this Edge to the database.
   * @return {Promise} A Promise resolving to this.
   */
  _persist() {
    return new Promise((resolve, reject) => {
      this._graph._db.put('edge:' + this._id, this._serialize(), error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      })
    });
  }

  _serialize() {
    return {
      id: this._id,
      label: this._label,
      from: this._from._id,
      to: this._to._id,
      properties: this._properties
    };
  }

}

export default Edge;
