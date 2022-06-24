const { check } = require("express-validator");

const orderValidation = [
  check("price").notEmpty().isFloat({ min: 0.01 }),
  check("order_date").notEmpty().isDate(),
  check("user_id").notEmpty().isInt(),
];

module.exports = {
  orderValidation,
};
