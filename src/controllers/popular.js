/** @format */

const express = require("express");
const popularService = require("../services/popular");

const router = express.Router();

router.get("/", popularService.getPopularPages);

module.exports = router;
