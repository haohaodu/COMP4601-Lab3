/** @format */

const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  length: { type: String, required: true },
  width: { type: String, required: true },
  height: { type: String, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model("Products", ProductSchema);
