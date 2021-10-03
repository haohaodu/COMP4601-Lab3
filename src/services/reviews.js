/** @format */
const Product = require("../models/Product");
const Review = require("../models/Review");

const createReview = async (req, res) => {
  const { rating, product_id } = req.body;

  const product = await Product.findById(product_id);
  if (!product)
    return res
      .status(404)
      .json({ message: `Product with id ${product_id} does not exist` });

  const review = await Review.create({
    rating: rating * 2,
    product_id: product_id,
  });

  if (!review)
    return res
      .status(409)
      .json({ message: "Something went wrong creating review" });

  return res
    .status(201)
    .json({ message: "Review successfully created", data: review });
};

const getProductReviews = async (req, res) => {
  const { id } = req.params;
  console.log("id: ", id);
  const reviews = await Review.find({ product_id: id });

  console.log("reviews: ", reviews);

  if (!reviews)
    return res
      .status(404)
      .json({ message: `Reviews for product with id ${id} not found.` });
  return res.status(200).json({ data: reviews });
};

const validate = () => {
  /**
   *
   * Reviews{
   *    reviews: []
   * }
   */
};

module.exports = {
  createReview: createReview,
  getProductReviews: getProductReviews,
};
