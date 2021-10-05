/** @format */

const express = require("express");
//const popularPageService = require("../services/pages");
const popularPageService = require("../services/popular");

const router = express.Router();

router.get("/", popularPageService.getPopularPages); //returns the 10 most popular pages
router.get("/:id", popularPageService.getOnePopularPage);

module.exports = router;