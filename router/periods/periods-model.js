const { pool } = require('../../config.js')

module.exports = {
  find,
  findBy,
  findUser,
  findByPeriodId,
  findPeriodByUser,
  createTaks,
  updateTask,
  deleteById,
  deleteByUserId,
};

function find() {
  return pool.query('SELECT * FROM periods');
}

function findBy(parameter, filter) {
  return pool.query(`SELECT * FROM periods WHERE ${parameter} = '${filter}'`);
}
function findPeriodByUser(userId) {
  return pool.query(`SELECT * FROM periods WHERE "user" = '${userId}'`);
}
function findByPeriodId(periodId) {
  return pool.query(`SELECT * FROM periods WHERE period_id = ${periodId}`);
}

function findUser(parameter, filter) {
  return pool.query(`SELECT id FROM users WHERE ${parameter} = '${filter}'`);
}

function createTaks(task) {
  return pool.query(`INSERT INTO periods ("user", start, length, info) VALUES ('${task.user}', '${task.start}', '${task.length}', '${task.info}') RETURNING period_id, start, length, info`)
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

function deleteById(periodID) {
  if (periodID) {
    return pool.query(`DELETE FROM periods WHERE period_id = '${periodID}' RETURNING period_id, "user", start, length, info`);
  }
}
function deleteByUserId(userId) {
  if (userId) {
    return pool.query(`DELETE FROM tasks WHERE "user" = '${userId}' RETURNING task_id, user, name`);
  }
}