"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "shipped",
          "delivered"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Index on status for faster filtering
    await queryInterface.addIndex("orders", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");
  },
};