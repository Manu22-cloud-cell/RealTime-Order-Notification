const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/orders", orderRoutes);

module.exports = app;