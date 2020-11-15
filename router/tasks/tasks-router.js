const router = require('express').Router();

const model = require('./tasks-model.js');
const middleware = require('./middleware.js');


router.get('/', middleware.tokenCheck, (req, res) => {

  model.find()
    .then(tasks => {
      res.status(200).json(tasks.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of tasks', error} );
    });
});

router.post('/', middleware.tokenCheck, middleware.taskCheck, (req, res) => {
  model.findUser('id', req.body.user)
    .then(task => {
      if (task.rowCount > 0) {
        model.createTaks(req.body)
        .then(task => {
          res.status(200).json({ message: 'New task was created!', taskData: task.rows[0] });
        })
        .catch(error => {
          res.status(500).json({ message: 'Cannot add new task', error });
        });
      } else {
        res.status(401).json({ message: 'User with current id doesnt exist. You cannot add task without correct owner.' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot add new task', error });
    });
});

module.exports = router;