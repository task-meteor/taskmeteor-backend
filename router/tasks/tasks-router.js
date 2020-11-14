const router = require('express').Router();

const model = require('./tasks-model.js');
const tokenCheck = require('./tokenCheck.js');



router.get('/', tokenCheck, (req, res) => {

  model.find()
    .then(users => {
      res.status(200).json(users.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of tasks', error} );
    });
});

module.exports = router;