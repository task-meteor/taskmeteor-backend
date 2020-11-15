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
  let { user, name, status, date } = req.body;

  model.findUser('id', user)
    .then(task => {
      if (task.rowCount > 0) {




        // res.status(200).json({
        //   message: `Welcome to the Meteor BE, ${user.rows[0].name}!`,
        //   id: user.rows[0].id,
        //   name: user.rows[0].name,
        //   email: user.rows[0].email,
        //   token,
        // });
      } else {
        res.status(401).json({ message: 'User with current id doesnt exist. You cannot add task without owner.' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot add new task', error });
    });
});

module.exports = router;