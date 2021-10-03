/** @format */

const { validationResult, body } = require("express-validator");
const Product = require("../models/Product");

const getProducts = async (req, res) => {
  let { name, instock } = req.query;
  instock = instock ? JSON.parse(instock) : null;
  const productName = name || "";
  const stockQuery = instock ? 1 : 0;

  // if no parameters, return all products
  if (!productName && !instock) {
    const products = await Product.find();
    return res.status(200).json({ data: products });
  }

  const products = await Product.find({
    name: { $regex: productName },
    stock: { $gte: stockQuery },
  });

  // empty product list and in stock specified, blame it on instock
  if (products.length === 0 && instock) {
    return res.status(404).json({
      message: `No products found with name: ${productName} that are in stock`,
    });
  } else if (products.length === 0 && !instock) {
    return res.status(404).json({
      message: `No products found with name: ${productName}`,
    });
  }

  // return data that was found
  return res.status(200).json({ data: products });
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).catch((e) =>
    console.log(`Error when retrieving product with id ${id}: ${e}`)
  );

  if (!product)
    return res.status(404).json({ message: `Product with id ${id} not found` });

  if (product.stock <= 0)
    return res
      .status(404)
      .json({ message: `Product with id ${id} out of stock` });

  return res.status(200).json({ data: product });
};

const createProduct = async (req, res) => {
  const { name, price, length, width, height, stock } = req.body;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  //if errors exist, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Error while creating product",
      errors: errors.array(),
    });
  }

  const product = new Product({
    name: name,
    price: price,
    length: length,
    width: width,
    height: height,
    stock: stock,
  });

  Product.create(product)
    .then((data) => {
      return res
        .status(201)
        .json({ message: "Product successfully created", data: data });
    })
    .catch((err) => {
      return res.status(409).json({
        message: "Error while creating product",
        err: err,
      });
    });
};

const validate = (method) => {
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

module.exports = {
  getOneProduct: getOneProduct,
  getProducts: getProducts,
  createProduct: createProduct,
  validateCreateProduct: validate,
};
