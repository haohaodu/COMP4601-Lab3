/** @format */

const express = require("express");
const reviewService = require("../services/reviews");

const router = express.Router();

router.post("/", reviewService.createReview);
router.get("/products/:id", reviewService.getProductReviews);

module.exports = router;
