/** @format */

const express = require("express");
const orderService = require("../services/orders");

const router = express.Router();

router.get("/", orderService.getOrders);
router.get("/:id", orderService.getOneOrder);
router.post("/", orderService.createOrder);

module.exports = router;
