const { pool } = require('../../config.js')

module.exports = {
  find,
  findBy,
  findUser,
  findByPeriodId,
  findPeriodByUser,
  createPeriod,
  updatePeriod,
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

function createPeriod(task) {
  return pool.query(`INSERT INTO periods ("user", start, length, info) VALUES ('${task.user}', '${task.start}', '${task.length}', '${task.info}') RETURNING period_id, start, length, info`)
}

function updatePeriod(oldPeriod, taskUpd) {
  let data = ''

  let notEmpty = 0;
  if (oldPeriod.start != taskUpd.start) {
    data = data + `start = '${taskUpd.start}'`;
    notEmpty += 1;
  }
  if (oldPeriod.length != taskUpd.length) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `length = ${taskUpd.length}`
    notEmpty += 1;
  }
  if (oldPeriod.info != taskUpd.info) {
    if (notEmpty > 0) {
      data = data + `, `;
    }
    data = data + `info = '${taskUpd.info}'`;
  }

  // console.log(new Date(oldPeriod.date).toUTCString());
  // console.log(new Date(oldPeriod.date).toISOString());

  if (oldPeriod.period_id && data != '') {
    return pool.query(`UPDATE periods SET ${data} WHERE period_id = '${oldPeriod.period_id}' RETURNING period_id, "user", start, length, info`);
  } else {
    return pool.query(`SELECT period_id, info FROM periods WHERE period_id = '${oldPeriod.period_id}'`);
  }
}

function deleteById(periodID) {
  if (periodID) {
    return pool.query(`DELETE FROM periods WHERE period_id = '${periodID}' RETURNING period_id, "user", start, length, info`);
  }
}

function deleteByUserId(userId) {
  if (userId) {
    return pool.query(`DELETE FROM periods WHERE "user" = '${userId}' RETURNING period_id, "user", length, info`);
  }
}