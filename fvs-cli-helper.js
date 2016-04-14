'use strict';

const fvs = require('./fvs-your-funcs');

module.exports = function () {
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
    default:
      fvs.handleDefault();
  }
}
