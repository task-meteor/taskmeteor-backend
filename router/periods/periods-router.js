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
  const periodID = req.params.id
  console.log(periodID)

  model.deleteById(periodID)
    .then(period => {
      res.status(200).json({ message: 'Period was deleted successfully!', deletedPeriod: period.rows[0]});
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot delete period!', error} );
    });
});

router.delete('/byuser', middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId

  console.log(userId)
  console.log(`DELETE FROM periods WHERE "user" = '${userId}' RETURNING period_id, user, info`)
  
  model.deleteByUserId(userId)
    .then(periods => {
      res.status(200).json({ message: 'All periods of user was deleted successfully!', deletedPeriods: periods.rows});
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot delete periods!', error} );
    });
});

module.exports = router;