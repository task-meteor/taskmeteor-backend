const { pool } = require('../../config.js')

module.exports = {
  createUser,
  find,
  findBy,
  deleteById,
  deleteByEmail
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

function deleteById(id) {
  if (id) {
    return pool.query(`DELETE FROM users WHERE id = '${id}' RETURNING id, name, email`);
  }
}

function deleteByEmail(email) {
  if (email) {
    return pool.query(`DELETE FROM users WHERE email = '${email}' RETURNING id, name, email`);
  }
}