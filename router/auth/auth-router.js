const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const model = require("./auth-model.js");
const secrets = require("./secrets.js");
const validateAccountData = require("./validateAccountData.js");
const authMiddleware = require("./authenticate-middleware.js");


function generateToken(user) {
  const payload = {
    username: user.name,
    subject: user.id
  };
  
  const options = {
    expiresIn: "24h",
  }

  return jwt.sign(payload, secrets.jwtSecret, options);
}

router.post("/register", validateAccountData, authMiddleware.passCheck, (req, res) => {
    const userData = req.body;
    const hash = bcrypt.hashSync(userData.password, 10);
    userData.password = hash;

    model.createUser(userData)
    .then(note => {
      res.status(201).json({ message: "User added!" });
    })
    .catch (err => {
      if (err.code === "23505") {
        res.status(500).json({ 
          message: "User already exists!", 
          detail: err.detail
        });
      } else {
        res.status(500).json({ message: "Failed to add new user", err });
      }

    });
});

router.post("/login", validateAccountData, (req, res) => {
  let { email, password } = req.body;

  model.fullFindBy("email", email)
    .then(user => {
      if (user.rowCount > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome to the Meteor BE, ${user.rows[0].name}!`,
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
          token,
        });
      } else {
        res.status(401).json({ message: "Access denied" });
      }
    })
    .catch(error => {
      console.log("here")
      res.status(500).json(error);
    });
});

router.get("/info", authMiddleware.tokenCheck, (req, res) => {
  let { id } = req.body;

  model.findBy("id", id)
    .then(info => {
      let userData = info.rows[0];

      model.userThingsCounter(id)
        .then(info => {
          // console.log(userData, info)
          if (info.rowCount === 1) {
            res.status(200).json({userData: userData, periodsTasks: 0});
          } else {
            res.status(200).json({userData: userData, periods: info.rows[0].count, tasks: info.rows[1].count});
          }
        })
        .catch(error => {
          res.status(500).json({ message: "Cannot get user info", error });
        });

    })
    .catch(error => {
      res.status(500).json({ message: "Cannot get user info", error });
    });
});

router.delete("/remove", authMiddleware.tokenCheck, authMiddleware.removeCheck, (req, res) => {
  let { id } = req.body;

  model.deleteTasksByUserId(id)
  .then(deleted => {

    model.deletePeriodsByUserId(id)
    .then(deleted => {

      model.deleteById(id)
      .then(deleted => {
        res.status(200).json({ 
          message: "User was deleted!",
          deletedUser: deleted.rows 
        });
      })
      .catch(error => {
        res.status(500).json({ message: "Cannot remove the user {users}", error} );
      });
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot remove the user {periods}", error} );
    });
  })
  .catch(error => {
    res.status(500).json({ message: "Cannot remove the user {tasks}", error} );
  });
});

router.put("/update", authMiddleware.tokenCheck, (req, res) => {
  const updates = req.body;
  // console.log(updates)

  if (updates.id) {
    model.findBy("id", updates.id)
      .then(user => {
        if (user.rows.length > 0) {
          // res.status(200).json(user.rows);
          model.updateUser(user.rows[0], updates)
            .then(upd => {
              if (upd.command === "SELECT") {
                res.status(400).json({ 
                  message: "User have no new data for update", 
                  user: upd.rows[0]
                });
              } else {
                res.status(200).json({ 
                  message: "User data updated!",
                  data: upd.rows[0]
                });
              }
            })
            .catch(error => {
              console.log("pew")
              res.status(500).json({ message: "Cannot update user info", error} );
            });
        } else {
          res.status(401).json({ message: "User with given id doesnt exist" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Cannot update user info", error});
      });
  } else {
      res.status(400).json({ message: "Provide user id for operations with data", error} );
  }
});

router.put("/updatepass", authMiddleware.tokenCheck, authMiddleware.passCheck, (req, res) => {
  const {id, oldpass, password} = req.body;
  
  if (oldpass != password) {
    model.fullFindBy("id", id)
    .then(user => {
      if (user.rowCount > 0 && bcrypt.compareSync(oldpass, user.rows[0].password)) {
        let userData = user.rows[0]
        delete userData.id;
        userData.password = password;

        const hash = bcrypt.hashSync(userData.password, 10);
        userData.password = hash;

        model.updatePass(id, userData.password)
          .then(user => {
            res.status(200).json({ message: "Password was changed successfully!"});
          })
          .catch(error => {
            res.status(500).json({ message: "Cannot update user password", error});
          });
        } 
        else {
          res.status(401).json({ message: "Access denied" });
        }

    })
    .catch(error => {
      res.status(500).json({ message: "Cannot update user password", error});
    });
  } else {
    res.status(400).json({ message: "Create a different password!"} );
  }
  
  

  
});

router.get("/users", authMiddleware.tokenCheck, (req, res) => {

  model.find()
    .then(users => {
      res.status(200).json(users.rows);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot get the list of users", error} );
    });
});

module.exports = router;