/** @format */

const { body, validationResult } = require("express-validator");

const reviewValidationRules = () => {
  return [
    body("rating")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
  ];
};

const productValidationRules = () => {
  return [
    body("name")
      .exists()
      .withMessage("Required field")
      .notEmpty()
      .withMessage("Must not be empty"),
    body("price")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
    body("length")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
    body("width")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
    body("height")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
    body("stock")
      .exists()
      .withMessage("Required field")
      .isNumeric()
      .withMessage("Must be number")
      .notEmpty()
      .withMessage("Must not be empty"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (errors.isEmpty()) return next();

  //if errors exist, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
};

module.exports = {
  reviewValidationRules: reviewValidationRules,
  productValidationRules: productValidationRules,
  validate: validate,
};
