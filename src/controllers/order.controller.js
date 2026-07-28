const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const { customer_name, product_name, status } = req.body;

    if (!customer_name || !product_name) {
      return res.status(400).json({
        success: false,
        message: "customer_name and product_name are required",
      });
    }

    const order = await orderService.createOrder({
      customer_name,
      product_name,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, product_name, status } = req.body;

    const updateData = {};

    if (customer_name !== undefined) {
      updateData.customer_name = customer_name;
    }

    if (product_name !== undefined) {
      updateData.product_name = product_name;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "pending",
        "shipped",
        "delivered",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Allowed values: pending, shipped, delivered",
        });
      }

      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const order = await orderService.updateOrder(id, updateData);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await orderService.deleteOrder(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};