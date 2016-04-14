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

module.exports.init = function () {
  let root = fs.readdirSync('./');
  // step 1. if a .fvs file already exists, we should short circuit

  // step 2. do you remember the files/directories we need to make?
  /*
    .fvs/
      objects/
      refs/master
      HEAD
  */
}

module.exports.add = function () {

  // step 0a. make sure a filename is passed in as an argument

  // step 0b. create the index if none exists

  // step 1: create a 'blob' object in .fvs/objects

    // a. Hash the contents of the file
    // b. Use the first two characters of the hash as the directory in .fvs/objects
    // c. Write a file whose name is the rest of the hash, and whose contents is a 'blob' of the file

  // step 2: add the file to the index
  /*
    You should make sure that the filename includes the path relative to the root directory.
    For example: if your root directory has a directory 'data', which contains 'something.txt'
    your index entry for this file should read data/something.txt 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21.
  */

      // a. check if the file already has an index entry, and remove it if it does!
      // b. add the new line to the index
}

module.exports.commit = function () {

  // step 0a. make sure we have a lovely commit message!

  // step 1. create a tree of the project based on the index
  /*
    For now, I've done this for you! It's not easy!
    If you get done early, check out the specs to implement this on your own!
  */
  let index = fs.readFileSync('./.fvs/index', 'utf8');
  let treeRoot = require('./helpers')(index);

  // step 2. create a commit object
  /*
    A commit object should look something like this:

    tree 2ba0f3bff73bd3f3ds212ba0f3bff73bd3f3ds21
    author {your name - go ahead and hard code it ;)}
    {your commit message!}

    It should still be saved in the objects folder the same way tree and blob objects are saved!
  */

  // step 3. point the current branch at the new commit object

}

module.exports.handleDefault = function () {
  // we'll execute this function if we don't enter a recognized command!
  // check out the spec to see how to make this pass!
}
