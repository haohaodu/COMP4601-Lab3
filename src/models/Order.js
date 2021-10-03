/** @format */

const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  name: { type: String, required: true },
  products: { type: Array, default: [] },
});

module.exports = mongoose.model("Orders", OrderSchema);
