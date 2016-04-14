'use strict';

const expect = require('chai').expect;
const cp = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

describe('FVS', () => {

  // add to package.json: "bin" : { "fvs" : "./fvs.js" }
  // add to the top of your project: #!/usr/bin/env node
  // from your project root: npm install -g ./

  it('is available as global module', () => {
    cp.spawnSync('fvs', ['notacommand'])

  });

  it('accepts "init" as a command', () => {
    cp.spawnSync('fvs', ['init']);

    // wondering what's going on with the tilde?
    // http://stackoverflow.com/questions/12299665/what-does-a-tilde-do-when-it-precedes-an-expression
    let root = fs.readdirSync('./');
    expect(~root.indexOf('.fvs')).to.be.true;

    let dotGitlet = fs.readdirSync('./.fvs');
    expect(~dotGitlet.indexOf('objects')).to.be.true;
    expect(~dotGitlet.indexOf('HEAD')).to.be.true;
    expect(~dotGitlet.indexOf('refs')).to.be.true;

    let refs = fs.readdirSync('./.fvs/refs');
    expect(~refs.indexOf('master')).to.be.true;

  });

  describe ('accepts "add" as a command', () => {

    it('creates a blob object that contains the content of data/number.txt', () => {});
    it('adds an index entry that points at the blob', () => {});
    it('updates the blob and the index entry after making a correction', () => {});
  });

  describe ('accepts "commit" as a command', () => {

    it('creates a tree graph to represent the content of the version of the project being committed', () => {});
    it('creates a commit object with a message, timestamp and parent', () => {});
    it('points the current branch at the new commit object', () => {});
  });

  it('accepts "status" as a command', () => {});
  it('accepts "branch" as a command', () => {});
  it('accepts "rm-branch" as a command', () => {});
  it('accepts "checkout branch" as a command', () => {});

  /*
  * Extra Credit ! ! ! ! ! !
  */
  xit('accepts "merge branch" as a command', () => {});
  xit('accepts "rebase" as a command', () => {});
});

/*
git commands
- init
    - create .gitlet
    - create .gitlet/objects
    - create .gitlet/HEAD
    - create .gitlet/refs
    - create .gitlet/refs/master

- add
    - add blob
    - update index

- commit
    - create new commit object with message
    - timestamp
    - parent
    - copy of the index with blobs

- status
    - look at current commit
    - look for files that are different

- branch (easy)
    - add new file to refs that points to current commit of HEAD

- rm-branch
    - delete file with branch name

- checkout branch
    - go through each file in the commit
    -

extra credit

- merge
    - no changes necessary
    - fast-forward
    - receiver/giver

- rebase*/
