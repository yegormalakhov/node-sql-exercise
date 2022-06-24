const { check } = require("express-validator");

const userValidator = [
  check(
    "first_name",
    "first name should be not null and and at least two letters"
  )
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage(),
  check("last_name").notEmpty().isLength({ min: 2 }),
  check("age").notEmpty().isInt({ min: 18, max: 109 }),
  check("active").notEmpty().isBoolean(),
];

module.exports = {
  userValidator,
};
