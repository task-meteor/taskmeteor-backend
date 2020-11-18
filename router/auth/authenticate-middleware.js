const jwt = require("jsonwebtoken");
const secrets = require("./secrets.js");

const tokenCheck = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.user = { 
          name: decodedToken.name
        }
        next();
      }
    });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
};

const passCheck = (req, res, next) => {
  const { body } = req;
  let errors = [];

  const check = () => {
    if(body.password.length < 7){
      errors.push("Your password must be at least 7 characters");
    }
    if (body.password.search(/[a-z]/i) < 0) {
      errors.push("Your password must contain at least one letter");
    }
    if (body.password.search(/[0-9]/) < 0) {
      errors.push("Your password must contain at least one digit"); 
    }
    if (body.password.search(/[!@#$%^&*]/) < 0) {
      errors.push("Your password must contain at least one special character"); 
    }
    else {
      return true
    }
  }

    if (check() === true) {
      next();
    }
    else {
      res.status(401).json({ 
        message: "Password verification problems",  
        errors: errors,  
      });
    }
  };

const removeCheck = (req, res, next) => {
    const {body} = req;

      if(!body.email && !body.id){
          res.status(400).json({message: "Please provide id or email for operations with user data!"})
      }
      else {
          next()
      }
  };


exports.tokenCheck = tokenCheck
exports.passCheck = passCheck
exports.removeCheck = removeCheck