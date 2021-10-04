/** @format */

const express = require("express");
const popularService = require("../services/popular");

const router = express.Router();

router.get("/", popularService.getPopularPages);
router.get("/seed", popularService.seedPopularPages);

module.exports = router;
