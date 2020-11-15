const { pool } = require('../../config.js')

module.exports = {
  find,
  findBy,
  findUser,
  findByTaskId,
  createTaks,
  updateTask,
  deleteById,
  deleteByUserId,
};

function find() {
  return pool.query('SELECT * FROM tasks');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT * FROM tasks WHERE ${parameter} = '${filter}'`);
}
function findByTaskId(taskId) {
  return pool.query(`SELECT * FROM tasks WHERE task_id = ${taskId}`);
}

function findUser(parameter, filter) {
  return pool.query(`SELECT id FROM users WHERE ${parameter} = '${filter}'`);
}

function createTaks(task) {
  return pool.query(`INSERT INTO tasks ("user", name, status, date) VALUES ('${task.user}', '${task.name}', '${task.status}', '${task.date}') RETURNING task_id, name, status`)
}

function updateTask(oldTask, taskUpd) {
  let data = ''

  let notEmpty = 0;
  if (oldTask.name != taskUpd.name) {
    data = data + `name = '${taskUpd.name}'`;
    notEmpty += 1;
  }
  if (oldTask.status != taskUpd.status) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `status = ${taskUpd.status}`
    notEmpty += 1;
  }
  if (oldTask.date != taskUpd.date) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `date = '${taskUpd.date}'`;
  }

  // console.log(new Date(oldTask.date).toUTCString());
  // console.log(new Date(oldTask.date).toISOString());

  if (oldTask.task_id && data != '') {
    return pool.query(`UPDATE tasks SET ${data} WHERE task_id = '${oldTask.task_id}' RETURNING task_id, user, name, status, date`);
  } else {
    return pool.query(`SELECT task_id, name FROM tasks WHERE task_id = '${oldTask.task_id}'`);
  }
}

function deleteById(taskId) {
  if (taskId) {
    return pool.query(`DELETE FROM tasks WHERE task_id = '${taskId}' RETURNING task_id, user, name, status`);
  }
}
function deleteByUserId(userId) {
  if (userId) {
    return pool.query(`DELETE FROM tasks WHERE "user" = '${userId}' RETURNING task_id, user, name`);
  }
}