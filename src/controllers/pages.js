/** @format */

const express = require("express");
const pageService = require("../services/pages");

const router = express.Router();

router.get("/", pageService.getPages);
router.get("/seed", pageService.seedPages);
router.get("/:id", pageService.getOnePage);
/*router.get("/popular", pageService.getPopularPages); //returns the 10 most popular pages
router.get("/:id", pageService.getOnePage);
router.get("/popular", pageService.getPopularPages); //returns the 10 most popular pages
router.get("/popular/:id", pageService.getOnePopularPage); */
router.post("/", pageService.testPostPage);

module.exports = router;
