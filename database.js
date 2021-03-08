const db = require('./db/index.js');

const users = function() {
  return db.query('SELECT * FROM users;')
};

exports.users = users;
