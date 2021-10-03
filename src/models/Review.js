/** @format */

const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
  rating: { type: Number, required: true },
  product_id: { type: String, required: true },
});

module.exports = mongoose.model("Reviews", ReviewSchema);
