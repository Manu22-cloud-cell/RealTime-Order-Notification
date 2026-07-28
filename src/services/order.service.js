const Order = require("../models/order.model");

class OrderService {
  async createOrder(orderData) {
    return await Order.create(orderData);
  }

  async getAllOrders() {
    return await Order.findAll({
      order: [["id", "ASC"]],
    });
  }

  async getOrderById(id) {
    return await Order.findByPk(id);
  }

  async updateOrder(id, updateData) {
    const order = await Order.findByPk(id);

    if (!order) {
      return null;
    }

    await order.update({
      ...updateData,
      updated_at: new Date(),
    });

    return order;
  }

  async deleteOrder(id) {
    const order = await Order.findByPk(id);

    if (!order) {
      return null;
    }

    await order.destroy();

    return true;
  }
}

module.exports = new OrderService();