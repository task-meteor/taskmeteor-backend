const { pool } = require('../../config.js')

module.exports = {
  find,
  findBy,
};

function find() {
  return pool.query('SELECT * FROM tasks');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT id, name, email, info FROM tasks WHERE ${parameter} = '${filter}'`);
}