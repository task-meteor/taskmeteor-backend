const { pool } = require('../../config.js')

module.exports = {
  createUser,
  find,
  findBy,
  updateUser,
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

function updateUser(user, updates) {
  let data = ''

  let notEmpty = 0;
  if (user.name != updates.name) {
    data = data + `name = '${updates.name}'`;
    notEmpty += 1;
  }
  if (user.email != updates.email) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `email = '${updates.email}'`
    notEmpty += 1;
  }
  if (user.info != updates.info) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `info = '${updates.info}'`;
  }

  // console.log(`UPDATE users SET ${data} WHERE id = '${user.id}' RETURNING id, name, email`)

  if (user.id && data != '') {
    return pool.query(`UPDATE users SET ${data} WHERE id = '${user.id}' RETURNING id, name, email, info`);
  } else {
    return 'Nothing to do'
  }
}

function deleteByEmail(email) {
  if (email) {
    return pool.query(`DELETE FROM users WHERE email = '${email}' RETURNING id, name, email`);
  }
}