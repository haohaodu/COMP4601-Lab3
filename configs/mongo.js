/** @format */
const mongoose = require("mongoose");
require("dotenv/config");

console.log("trying to connect to db...", process.env.DB_CONNECTION)
const mg = mongoose.connect(process.env.DB_CONNECTION);

module.exports = mg;
