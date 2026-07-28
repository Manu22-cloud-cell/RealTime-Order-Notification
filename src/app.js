const express = require("express");

const orderRoutes = require("./routes/order.routes");

const notFoundHandler = require("./middleware/not-found.middleware");

const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/orders", orderRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

module.exports = app;