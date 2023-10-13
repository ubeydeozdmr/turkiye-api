const DB = require('../v1/data/data.json');
const DB_DEV = require('../v1/data/data-dev.json');

function getDB(dev) {
  if (dev === 'true') {
    return DB_DEV;
  } else {
    return DB;
  }
}

module.exports = getDB;
