const { pool } = require('../../config.js')

module.exports = {
  createUser,
  find,
  findBy
};


function createUser(user) {
  if (user.info != null && user.info != undefined) {
    return pool.query(`INSERT INTO users (name, email, password, info) VALUES ('${user.name}', '${user.email}', '${user.password}', '${user.info}')`)
  } else {
    return pool.query(`INSERT INTO users (name, email, password, info) VALUES ('${user.name}', '${user.email}', '${user.password}', null)`)
  }
}

function find() {
  return pool.query('SELECT * FROM users');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT * FROM users WHERE ${parameter} = '${filter}'`);
}