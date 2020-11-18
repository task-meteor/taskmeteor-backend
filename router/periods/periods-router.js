const router = require("express").Router();

const model = require("./periods-model.js");
const middleware = require("./middleware.js");


router.get("/", middleware.tokenCheck, (req, res) => {
  const limit = req.query.limit;

  model.find(limit)
    .then(periods => {
      res.status(200).json(periods.rows);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot get the list of periods", error });
    });
});

router.get("/id/:id", middleware.tokenCheck, (req, res) => {
  const periodId = req.params.id

  model.findByPeriodId(periodId)
    .then(period => {
      res.status(200).json(period.rows);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot get the period", error });
    });
});

router.get("/byuser", middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId;
  const limit = req.query.limit;
  const from = req.query.from;

  model.findPeriodByUser(userId, limit, from)
    .then(periods => {
      res.status(200).json(periods.rows);
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot get the list of periods", error} );
    });
});

router.post("/", middleware.tokenCheck, middleware.periodCheck, (req, res) => {
  model.findUser("id", req.body.user)
    .then(period => {
      if (period.rowCount > 0) {
        model.createPeriod(req.body)
        .then(period => {
          res.status(200).json({ message: "New period was created!", periodData: period.rows[0] });
        })
        .catch(error => {
          res.status(500).json({ message: "Cannot add new period", error });
        });
      } else {
        res.status(401).json({ message: "User with current id doesnt exist. You cannot add period without correct owner." });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot add new period", error });
    });
});

router.put("/:id", middleware.tokenCheck, middleware.periodCheck, (req, res) => {
  const periodID = req.params.id;
  const periodUpd = req.body;

  model.findByPeriodId(periodID)
    .then(period => {
      if (period.rows.length > 0) {
        const oldPeriod = period.rows[0]

        model.updatePeriod(oldPeriod, periodUpd)

          .then(period => {
            res.status(200).json({ message: "Period was updated!", period: period.rows[0]});
          })
          .catch(error => {
            res.status(500).json({ message: "Cannot update the period!"} );
          });

      } else {
        res.status(404).json({ message: "Cannot find period for updates!"} );
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot update the period!"} );
    });
});

router.delete("/id/:id", middleware.tokenCheck, (req, res) => {
  const periodID = req.params.id;

  model.deleteById(periodID)
    .then(period => {
      res.status(200).json({ message: "Period was deleted successfully!", deletedPeriod: period.rows[0]});
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot delete period!", error} );
    });
});

router.delete("/byuser", middleware.tokenCheck, (req, res) => {
  const userId = req.body.userId;

  model.deleteByUserId(userId)
    .then(period => {
      res.status(200).json({ message: "All period of user was deleted successfully!", deletedPeriods: period.rows});
    })
    .catch(error => {
      res.status(500).json({ message: "Cannot delete period!", error} );
    });
});


module.exports = router;