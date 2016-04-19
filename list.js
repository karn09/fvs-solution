'use strict';

const crypto = require('crypto');

const util = {
  getSha1 (data) {
    return crypto
      .createHash('sha1')
      .update(data)
      .digest('hex');
  }
}

class ListNode {

  constructor (value, next) {
    this.value = value;
    this.next = next || null;
    this.id = util.getSha1(value);
  }

  toString (useShort) {
    let cur = this,
        arr = [];
    while (cur) {
      arr.push(cur.id);
      cur = cur.next;
    }
    if (useShort) return '[' + arr.map(i => i.slice(0, 6)).join(' ') + ']';
    else return '[' + arr.join(' ') + ']';
  }

  toStringShort () {
    return this.toString(true);
  }

  length () {
    if (!this.next) return 1;
    else return 1 + this.next.length();
  }

  shiftNode (value) {
    return new ListNode(value, this);
  }

  // everything after the node we remove can be re-used
  // everything before it needs to be copied
  remove (id) {
    if (this.id === id) return this.next ? this.next : null;
    else if (this.next) return new ListNode(this.value, this.next.remove(id));
    else return null; // not found
  }

  append (ln) {
    if (!this.next) return ln.shiftNode(this.value);
    else return new ListNode(this.value, this.next.append(ln));
  }

  find (id) {
    if (this.id === id) return this;
    else if (this.next) return this.next.find(id);
    else return null; // not found
  }

  splitAt (id) {
    if (this.id === id) return null;
    else if (this.next) return new ListNode(this.value, this.next.splitAt(id));
    else return null; // not found
  }

  insertAt (id, ln) {
    if (this.id === id) return ln.append(this);
    else return new ListNode(this.value, this.next.insertAt(id, ln));
  }

  commonAncestor (ln) {
    let ancestor = ln.find(this.id);
    return ancestor ? ancestor : this.next.commonAncestor(ln);
  }

}

module.exports = { util: util, ListNode: ListNode };
