const { pool } = require('../../config.js')

module.exports = {
  find,
  findBy,
  findUser,
  createTaks,
  deleteById,
};

function find() {
  return pool.query('SELECT * FROM tasks');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT * FROM tasks WHERE ${parameter} = '${filter}'`);
}

function findUser(parameter, filter) {
  return pool.query(`SELECT id FROM users WHERE ${parameter} = '${filter}'`);
}

function createTaks(task) {
  return pool.query(`INSERT INTO tasks ("user", name, status, date) VALUES ('${task.user}', '${task.name}', '${task.status}', '${task.date}') RETURNING task_id, name, status`)
}

function deleteById(taskId) {
  if (taskId) {
    return pool.query(`DELETE FROM tasks WHERE task_id = '${taskId}' RETURNING task_id, user, name, status`);
  }
}