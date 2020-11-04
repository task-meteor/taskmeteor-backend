const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const model = require('./auth-model.js');
const secrets = require('./secrets.js');
const validateAccountData = require('./validateAccountData.js');
const authMiddleware = require('./authenticate-middleware.js');

function generateToken(user) {
  const payload = {
    username: user.name,
    subject: user.id
  };
  
  const options = {
    expiresIn: '2h',
  }

  return jwt.sign(payload, secrets.jwtSecret, options);
}

router.post('/register', validateAccountData, (req, res) => {
    const userData = req.body;
    const hash = bcrypt.hashSync(userData.password, 10);
    userData.password = hash;

    model.createUser(userData)
    .then(note => {
      res.status(201).json({ message: 'User added!' });
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to add new user', err });
    });
});

router.post('/login', validateAccountData, (req, res) => {
  let { email, password } = req.body;

  model.findBy('email', email)
    .then(user => {
      // console.log(user)
      if (user && bcrypt.compareSync(password, user.rows[0].password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.rows[0].name}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Access denied' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/users', authMiddleware, (req, res) => {

  model.find()
    .then(users => {
      res.status(200).json(users.rows);
    })
    .catch(error => {
      res.status(500).json({ message: 'Cannot get the list of users', error} );
    });
});

module.exports = router;