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

periodCheck = (req, res, next) => {
  let { user, start, length } = req.body;
  let errors = [];

  const check = () => {
    if (!user || !start || !length) {
      errors.push("You have missing parameter!");
    } else {
      if (typeof length != "number") {
        errors.push("Length should have a number format"); 
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
        message: 'Period data verification problems',  
        errors: errors,  
      });
  }
};

exports.tokenCheck = tokenCheck
exports.periodCheck = periodCheck