'use strict';

const fvs = require('./fvs-your-funcs');

module.exports = function () {
  try {
    switch (process.argv.slice(2)[0]) {
      case 'init':
        fvs.init();
        break;
      case 'add':
        fvs.add();
        break;
      case 'commit':
        fvs.commit();
        break;
      case 'branch':
        fvs.branch();
        break;
      case 'checkout':
        fvs.checkout();
        break;
      default:
        fvs.handleDefault();
    }
  } catch (err) {
    console.log(err);
  }
}
