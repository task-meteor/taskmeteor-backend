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
router.get('/id/:id', middleware.tokenCheck, (req, res) => {
  const taskId = req.params.id

  model.findByTaskId(taskId)
    .then(tasks => {
      res.status(200).json(tasks.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of tasks', error} );
    });
});

router.get('/byuser', middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId

  model.findTaskByUser(userId)
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

router.put('/:id', middleware.tokenCheck, middleware.taskCheck, (req, res) => {
  const taskId = req.params.id
  const taskUpd = req.body

  model.findByTaskId(taskId)
    .then(task => {
      if (task.rows.length > 0) {
        const oldTask = task.rows[0]

        model.updateTask(oldTask, taskUpd)

          .then(task => {
            res.status(200).json({ message: 'Task was updated!', task: task.rows[0]});
          })
          .catch(error => {
            res.status(500).json({ message: 'Cannot update the task!'} );
          });

      } else {
        res.status(404).json({ message: 'Cannot find task for updates!'} );
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot update the task!'} );
    });
});

router.delete('/id/:id', middleware.tokenCheck, (req, res) => {
  const taskId = req.params.id

  model.deleteById(taskId)
    .then(task => {
      res.status(200).json({ message: 'Task was deleted successfully!', deletedTask: task.rows[0]});
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot delete task!', error} );
    });
});

router.delete('/byuser', middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId

  model.deleteByUserId(userId)
    .then(task => {
      res.status(200).json({ message: 'All task of user was deleted successfully!', deletedTasks: task.rows});
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot delete task!', error} );
    });
});

module.exports = router;