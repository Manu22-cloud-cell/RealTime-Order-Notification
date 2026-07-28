const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getAllOrders);

router.get("/:id", getOrderById);

router.patch("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;