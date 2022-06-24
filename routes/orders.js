const express = require("express");
const ordersRouter = express.Router();
const database = require("../db/client");
const { validationResult } = require("express-validator");
const { orderValidation } = require("../validators/orderValidation");

ordersRouter.get("/time", (req, res) => {
  database
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch(() => res.statusCode(500));
});

ordersRouter.get("/", (req, res) => {
  database
    .query("SELECT * FROM orders")
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

ordersRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const selectOneOrder = {
    text: "SELECT * FROM orders WHERE id = $1",
    value: [id],
  };
  database
    .query(selectOneOrder)
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});
const now = new Date();
ordersRouter.post("/neworder", (req, res) => {
  const { price, user_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(422).json({ errors: errors.array() });
  }
  //   console.log(now);
  const newOrder = {
    text: `INSERT INTO orders(price, order_date, user_id) VALUES($1, $2, $3) RETURNING *`,
    values: [price, now, user_id],
  };
  database
    .query(newOrder)
    .then((data) => res.status(201).send(data.rows))
    .catch(() => res.statusCode(500));
});

ordersRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { price, order_date, user_id } = req.body;
  //   const now = new Date();
  const updateOrder = {
    text: `UPDATE orders
                SET
                    price = $1,
                    order_date = $2,
                    user_id = $3
                WHERE id = $4`,
    values: [price, order_date, user_id],
  };

  database
    .query(updateOrder)
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

ordersRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteOrder = {
    text: `DELETE FROM orders WHERE id=$1`,
    values: [id],
  };
  database
    .query(deleteOrder)
    .then((data) => res.send(data.rows))
    .catch(() => res.statusCode(500));
});

module.exports = ordersRouter;
