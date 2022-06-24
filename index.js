require("dotenv").config();
const express = require("express");
// const { Pool, Client } = require("pg");
const database = require("./db/client");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
// const pool = new Pool();

// database.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
// });

app.get("/", (req, res) => {
  res.send("Welcome to the internet");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
