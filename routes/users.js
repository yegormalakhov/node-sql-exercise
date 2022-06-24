const express = require("express");
const usersRouter = express.Router();
const database = require("../db/client");
const { validationResult } = require("express-validator");
const { userValidator } = require("../validators/userValidator");

usersRouter.get("/time", (req, res) => {
  database
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch(() => res.statusCode(500));
});

usersRouter.get("/", (req, res) => {
  database
    .query("SELECT * FROM users")
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

usersRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const selectOneUser = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  database
    .query(selectOneUser)
    .then((data) => res.send(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

usersRouter.post("/newuser", userValidator, (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const newUser = {
    text: "INSERT INTO users(first_name, last_name, age, active) VALUES($1, $2, $3, $4) RETURNING *",
    values: [first_name, last_name, age, active],
  };
  database
    .query(newUser)
    .then((data) => res.status(201).json(data.rows[0]))
    .catch((e) => res.status(500).send(e.message));
});

usersRouter.put("/:id", userValidator, (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const updateUser = {
    text: `UPDATE users
        SET
            first_name =$1,
            last_name = $2,
            age = $3,
            active = $4
        WHERE
            id = $5
        RETURNING *`,

    values: [first_name, last_name, age, active, id],
  };

  database
    .query(updateUser)
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

usersRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteUser = {
    text: `DELETE FROM users WHERE id=$1`,
    values: [id],
  };
  database
    .query(deleteUser)
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

module.exports = usersRouter;
