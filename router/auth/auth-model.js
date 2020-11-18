const { pool } = require('../../config.js')

module.exports = {
  createUser,
  find,
  findBy,
  fullFindBy,
  updateUser,
  updatePass,
  deleteById,
  deleteByEmail,
  deleteTasksByUserId,
  deletePeriodsByUserId,
  userThingsCounter,
};


function createUser(user) {
  if (user.info != null && user.info) {
    return pool.query(`INSERT INTO users (name, email, password, info) VALUES ('${user.name}', '${user.email}', '${user.password}', '${user.info}')`)
  } else {
    return pool.query(`INSERT INTO users (name, email, password, info) VALUES ('${user.name}', '${user.email}', '${user.password}', null)`)
  }
}

function find() {
  return pool.query('SELECT * FROM users');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT id, name, email, info FROM users WHERE ${parameter} = '${filter}'`);
}

function userThingsCounter(id) {
  // console.log(`SELECT COUNT (*) FROM periods WHERE "user" = '${id}' UNION SELECT COUNT (*) FROM tasks WHERE "user" = '${id}'`)
  return pool.query(`SELECT COUNT (*) FROM periods WHERE "user" = '${id}' UNION SELECT COUNT (*) FROM tasks WHERE "user" = '${id}'`)
}

function fullFindBy(parameter, filter) {
  return pool.query(`SELECT * FROM users WHERE ${parameter} = '${filter}'`);
}

function deleteById(id) {
  if (id) {
    return pool.query(`DELETE FROM users WHERE id = '${id}' RETURNING id, name, email`);
  }
}
function deleteTasksByUserId(userId) {
  if (userId) {
    return pool.query(`DELETE FROM tasks WHERE "user" = '${userId}'`);
  }
}
function deletePeriodsByUserId(userId) {
  if (userId) {
    return pool.query(`DELETE FROM periods WHERE "user" = '${userId}'`);
  }
}


function updateUser(user, updates) {
  let data = ''

  let notEmpty = 0;
  if (user.name !== updates.name) {
    data = data + `name = '${updates.name}'`;
    notEmpty += 1;
  }
  if (user.email !== updates.email) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `email = '${updates.email}'`
    notEmpty += 1;
  }
  if (user.info !== updates.info) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `info = '${updates.info}'`;
  }

  if (user.id && data != '') {
    return pool.query(`UPDATE users SET ${data} WHERE id = '${user.id}' RETURNING id, name, email, info`);
  } else {
    return pool.query(`SELECT id, name FROM users WHERE id = '${user.id}'`);
  }
}

function updatePass(id, password) {
  return pool.query(`UPDATE users SET password = '${password}' WHERE id = '${id}'`);
}

function deleteByEmail(email) {
  if (email) {
    return pool.query(`DELETE FROM users WHERE email = '${email}' RETURNING id, name, email`);
  }
}