/** @format */

const mongoose = require("mongoose");

const PageSchema = mongoose.Schema({
  url: { type: String, required: true },
  incoming_links: { type: Array, default: [] },
  outgoing_links: { type: Array, default: [] },
});

module.exports = mongoose.model("Pages", PageSchema);
