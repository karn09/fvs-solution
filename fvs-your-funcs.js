'use strict';

'use strict';

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
  try {
    fs.statSync(dir);
  } catch (err) {
    fs.mkdirSync(dir);
    fs.writeFileSync(dir + '/' + name, fileContents, 'utf8');
  }
  return hash;
}

function updateIndex (index, fileName, blobRef) {
  index = index.filter(entry => entry.split(' ')[0] !== fileName);
  index.push(fileName + ' ' + blobRef);
  index = index.join('\n');
  fs.writeFileSync('./.fvs/index', index, 'utf8');

  return index;
}

function objectReader (hash) {
  let dir = '.fvs/objects/' + hash.slice(0, 2);
  let name = hash.slice(2);
  return fs.readFileSync(`.fvs/objects/${dir}/${name}`, 'utf8');
}

function writeToWorkingCopy (commitHash) {
  let commitFile = objectReader(commitHash);
  let treeHash = commitFile.split('\n').map(line => line.split(' '))[1];

  // todo
  return '';
}

module.exports.init = function () {
  let root = fs.readdirSync('./');

  if (root.indexOf('.fvs') !== -1) throw '.fvs already exists';

  fs.mkdirSync('.fvs');
  fs.mkdirSync('.fvs/objects');
  fs.mkdirSync('.fvs/refs');
  fs.writeFileSync('./.fvs/HEAD', 'ref: refs/master');
  fs.writeFileSync('./.fvs/refs/master');
};

module.exports.add = function () {
  let root = fs.readdirSync('./.fvs');
  let fileName = process.argv.slice(2)[1];

  // make sure a filename is passed in as an argument
  if (!fileName) throw 'No filename specified';

  // step 1: create a 'blob' object in .fvs/objects
  let blobRef = createBlobObject(fileName);

  // step 2: add the file to the index
  if (root.indexOf('index') === -1) fs.writeFileSync('./.fvs/index', '');
  let index = fs.readFileSync('./.fvs/index', 'utf8') || [];
  if (typeof index === 'string') index = index.split('\n');
  updateIndex(index, fileName, blobRef);

  return blobRef;
};

module.exports.commit = function () {
  let commitMessage = process.argv.slice(2)[1];

  // make sure we have a lovely commit message!
  if (!commitMessage) throw 'No commit message';

  // step 1. create a tree of the project based on the index
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRoot = require('./helpers')(index);

  // step 2. create a commit object

  // step 2a. get current branch from HEAD, and get the parent tree from refs
  let currentBranch = fs.readFileSync('./.fvs/HEAD', 'utf8');
  let path = currentBranch.split(': ')[1];
  let parent = fs.readFileSync('./.fvs/' + path, 'utf8');

  let fileContents;
  if (parent !== 'undefined') fileContents = [['tree', treeRoot], ['author', 'Tom Kelly'], [commitMessage], ['parent', parent]];
  else fileContents = [['tree', treeRoot], ['author', 'Tom Kelly'], [commitMessage]];
  fileContents = fileContents
    .map(line => line.join(' '))
    .join('\n');
  let commitHash = createFVSObject(fileContents);

  // step 3. point the current branch at the new commit object
  fs.writeFileSync('./.fvs/' + path, commitHash, 'utf8');

  return commitHash;
};

module.exports.branch = function () {
  let branchName = process.argv.slice(2)[1];
  // step 1. get the hash from HEAD
  let currentBranch = fs.readFileSync('./.fvs/HEAD', 'utf8'),
      path = currentBranch.split(': ')[1],
      currentCommitHash = fs.readFileSync('./.fvs/' + path, 'utf8');

  // step 2. create the branch file at refs/
  // NOTE: in real Git, this would be at refs/heads/ (but we can simplify it here)
  fs.writeFileSync('./.fvs/refs/' + branchName, currentCommitHash, 'utf8');

  return currentCommitHash;
};

module.exports.checkout = function () {
  let branchName = process.argv.slice(2)[1];

  // step 1. get the commit hash that the branch points to
  let commitHash = fs.readFileSync('./.fvs/refs/' + branchName, 'utf8');

  // step 2. write the contents of the file tree to the working copy
  let index = writeToWorkingCopy(commitHash);

  // step 3. write the file entries to the index
  fs.writeFileSync('./.fvs/index', index, 'utf8');

  // step 4. point HEAD at the new branch
  fs.writeFileSync('./.fvs/HEAD', 'ref: refs/' + branchName);
}

module.exports.handleDefault = function () {
  throw 'Not a recognized command!';
};

module.exports.createFVSObject = createFVSObject;
module.exports.createBlobObject = createBlobObject;
module.exports.updateIndex = updateIndex;
