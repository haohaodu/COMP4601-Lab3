/** @format */
const { validationResult, body, param } = require("express-validator");

const Order = require("../models/Order");
const Product = require("../models/Product");

const getOrders = async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({ data: orders });
};

const getOneOrder = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  //if errors exist, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Error while creating product",
      errors: errors.array(),
    });
  }

  const order = await Order.findById(id);
  if (!order)
    return res.status(404).json({ message: `Cannot find order with id ${id}` });
  return res.status(200).json({ data: order });
};

const createOrder = async (req, res) => {
  const { name, products } = req.body;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  //if errors exist, return them
  if (!errors.isEmpty()) {
    return res.status(409).json({
      message: "Error while creating product",
      errors: errors.array(),
    });
  }

  products.map(({ quantity }) => console.log("quantity: ", quantity));
  // // check if we have stock first
  let flag = 0;
  await Promise.all(
    products.map(async ({ _id, quantity }) => {
      const product = await Product.findById(_id).catch((e) =>
        console.log("error: ", e)
      );
      if (!product) flag++;
      else if (product.stock < quantity) {
        flag += 2;
      }
    })
  );

  if (flag > 0)
    return flag % 2 === 0
      ? res
          .status(409)
          .json({ message: `Not enough stock for ordered product` })
      : res
          .status(409)
          .json({ message: `Product id provided in order does not exist` });

  // update all product orders stock
  products.map(async ({ _id, quantity }) => {
    // get specific product in order
    const product = await Product.findById(_id).catch((e) =>
      console.log("error while updating product: ", e)
    );

    // update the stock for that order
    const updatedStock = product.stock - quantity;
    await Product.findByIdAndUpdate(_id, { stock: updatedStock }).catch((e) =>
      console.log("something went wrong while doing order: ", e)
    );
  });

  const order = await Order.create({
    name: name,
    products: products,
  }).catch((e) => console.log("error while creating order", e));

  if (!order)
    return res
      .status(409)
      .json({ message: "Something went wrong creating order" });

  return res
    .status(201)
    .json({ message: "Order successfully created", data: order });
};

const validate = (method) => {
  switch (method) {
    case "createOrder": {
      return [
        body("name")
          .exists()
          .withMessage("Required field")
          .notEmpty()
          .withMessage("Must not be empty"),
        body("products.*._id")
          .exists()
          .withMessage("Required field")
          .isLength({ min: 24, max: 24 })
          .withMessage("Product ID must be 24 characters"),
        body("products.*.quantity")
          .exists()
          .withMessage("Required field")
          .isNumeric()
          .withMessage("Must be number")
          .notEmpty()
          .withMessage("Must not be empty"),
      ];
    }
    case "getOneOrder": {
      return [
        param("id")
          .isLength({ min: 24, max: 24 })
          .withMessage("Order ID must be 24 characters"),
      ];
    }
  }
};

module.exports = {
  getOrders: getOrders,
  getOneOrder: getOneOrder,
  createOrder: createOrder,
  validateOrder: validate,
};
