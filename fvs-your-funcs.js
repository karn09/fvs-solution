'use strict';

'use strict';

/**
* You'll be primarily using fs methods to complete your version control system!
* Please use the synchronous versions of each method - while this is usually
* bad news in the real world, I don't want you to get caught up in callbacks.
* Instead, you can focus on learning the intricacies of Git!
*
* Some useful methods...
*   fs.readFileSync
*   fs.writeFileSync
*   fs.readdirSync
*   fs.rmdirSync
*   fs.mkdirSync
*
* https://nodejs.org/api/fs.html
**/
const fs = require('fs');
const getSha1 = require('./util').getSha1;

function createBlobObject (fileName) {
  let fileContents = fs.readFileSync('./' + fileName, 'utf8');
  return createFVSObject(fileContents);
}

function createFVSObject (fileContents) {
  let hash = getSha1(fileContents);
  let dir = '.fvs/objects/' + hash.slice(0, 2);
  let name = hash.slice(2);
  fs.mkdirSync(dir);
  fs.writeFileSync(dir + '/' + name, fileContents, 'utf8');
  return hash;
}

function updateIndex (index) {
  index = index.filter(entry => entry.split(' ')[0] !== fileName);
  index.push(fileName + ' ' + blobRef);
  index = index.join('\n');
  fs.writeFileSync('./.fvs/index', index, 'utf8');
}

module.exports.init = function () {
  let root = fs.readdirSync('./');

  if (~root.indexOf('.fvs')) {
    console.log('.fvs already exists');
    return;
  };

  fs.mkdirSync('.fvs');
  fs.mkdirSync('.fvs/objects');
  fs.mkdirSync('.fvs/refs');
  fs.writeFileSync('./.fvs/HEAD', 'ref: refs/master');
  fs.writeFileSync('./.fvs/refs/master');
}

module.exports.add = function () {
  let root = fs.readdirSync('./.fvs');
  let fileName = process.argv.slice(2)[1];

  // make sure a filename is passed in as an argument
  if (!fileName) return console.log('No filename specified');

  // create the index if none exists
  if (!~root.indexOf('index')) fs.writeFileSync('./.fvs/index', '');

  // step 1: create a 'blob' object in .fvs/objects
  let blobRef = createBlobObject(fileName);

  // step 2: add the file to the index
  let index = fs.readFileSync('./.fvs/index', 'utf8') || [];
  if (typeof index === 'string') index = index.split('\n');
  updateIndex(index);
}

module.exports.commit = function () {
  let commitMessage = process.argv.slice(2)[1];

  // make sure we have a lovely commit message!
  if (!commitMessage) {
    console.log('No commit message');
    return;
  }

  // step 1. create a tree of the project based on the index
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRoot = require('./helpers')(index);

  // step 2. create a commit object
  let fileContents = [['tree', treeRoot], ['author', 'Tom Kelly'], [commitMessage]]
    .map(line => line.join(' '))
    .join('\n');
  let commitObjRef = createFVSObject(fileContents);

  // step 3. point the current branch at the new commit object
  let currentBranch = fs.readFileSync('./.fvs/HEAD', 'utf8');
  let path = currentBranch.split(': ')[1]
  fs.writeFileSync('./.fvs/' + path, commitObjRef, 'utf8');
}

module.exports.handleDefault = function () {
  console.log('Not a recognized command!');
  fs.mkdirSync('logs');
  fs.writeFileSync('./logs/error.txt', 'Error');
}

module.exports.createFVSObject = createFVSObject;
module.exports.createBlobObject = createBlobObject;
module.exports.updateIndex = updateIndex;
