const router = require('express').Router();

const model = require('./periods-model.js');
const middleware = require('./middleware.js');


router.get('/', middleware.tokenCheck, (req, res) => {

  model.find()
    .then(periods => {
      res.status(200).json(periods.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of periods', error });
    });
});

router.get('/:id', middleware.tokenCheck, (req, res) => {
  const periodId = req.params.id

  model.findByPeriodId(periodId)
    .then(period => {
      res.status(200).json(period.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the period', error });
    });
});

router.get('/byuser', middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId

  model.findPeriodByUser(userId)
    .then(periods => {
      res.status(200).json(periods.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of periods', error} );
    });
});

router.post('/', middleware.tokenCheck, middleware.periodCheck, (req, res) => {
  model.findUser('id', req.body.user)
    .then(period => {
      if (period.rowCount > 0) {
        model.createTaks(req.body)
        .then(period => {
          res.status(200).json({ message: 'New period was created!', periodData: period.rows[0] });
        })
        .catch(error => {
          res.status(500).json({ message: 'Cannot add new period', error });
        });
      } else {
        res.status(401).json({ message: 'User with current id doesnt exist. You cannot add period without correct owner.' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot add new period', error });
    });
});

// router.put('/:id', middleware.tokenCheck, middleware.taskCheck, (req, res) => {
//   const taskId = req.params.id
//   const taskUpd = req.body

//   model.findByTaskId(taskId)
//     .then(task => {
//       if (task.rows.length > 0) {
//         const oldTask = task.rows[0]

//         model.updateTask(oldTask, taskUpd)

//           .then(task => {
//             res.status(200).json(task);
//           })
//           .catch(error => {
//             res.status(500).json({ message: 'Cannot update the task!'} );
//           });

//       } else {
//         res.status(404).json({ message: 'Cannot find task for updates!'} );
//       }
//     })
//     .catch(error => {
//       res.status(500).json({ message: 'Cannot update the task!'} );
//     });
// });

router.delete('/:id', middleware.tokenCheck, (req, res) => {
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