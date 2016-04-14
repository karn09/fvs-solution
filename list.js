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
        str = '[';
    while (cur) {
      useShort ? str += cur.id.slice(0, 6) : str += cur.id;
      if (cur.next) str += ' ';
      cur = cur.next;
    }
    str += ']';
    return str;
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

  remove (id) {
    if (this.id === id) return this.next ? this.next : null;
    else if (this.next) return new ListNode(this.value, this.next.remove(id));
    else return new ListNode(this.value);
  }

  append (ln) {
    if (!this.next) return new ListNode(this.value, ln);
    else if (this.next) return new ListNode(this.value, this.next.append(ln));
    else return new ListNode(this.value);
  }

  find (id) {
    if (this.id === id) return this;
    else if (this.next) return this.next.find(id);
    else return null;
  }

  splitAt(id) {
    if (this.id === id) return null;
    else if (this.next) return new ListNode(this.value, this.next.splitAt(id));
    else return null;
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
