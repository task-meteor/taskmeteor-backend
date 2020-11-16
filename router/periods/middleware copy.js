const jwt = require('jsonwebtoken');
const secrets = require('../auth/secrets.js');

tokenCheck = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Invalid Credentials' });
      } else {
        req.user = { 
          name: decodedToken.name
        }
        next();
      }
    })
  } else {
    res.status(400).json({ message: 'No token provided' });
  }
};

taskCheck = (req, res, next) => {
  let { user, name, status, date } = req.body;
  let errors = [];

  const check = () => {
    if (!user || !name || status.length === 0 || !date) {
      errors.push("You have missing parameter!");
    } else {
      if (name.length > 128) {
        errors.push("Task name should be not longer than 128 symbols"); 
      }
      if (name.search(/[a-z]/i) < 0) {
        errors.push("Your task name must contain at least one letter");
      }
      if (typeof status != "boolean") {
        errors.push("Status should have a boolean format"); 
      }
      else {
        return true
      }
    }

  }

  if (check() === true) {
    next()
  } else {
    res.status(401).json({ 
        message: 'Task data verification problems',  
        errors: errors,  
      });
  }
};

exports.tokenCheck = tokenCheck
exports.taskCheck = taskCheck