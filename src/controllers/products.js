/** @format */

const express = require("express");
const productService = require("../services/products");

const router = express.Router();

router.get("/", productService.getProducts);
router.get("/:id", productService.getOneProduct);
router.post("/", productService.createProduct);

module.exports = router;
