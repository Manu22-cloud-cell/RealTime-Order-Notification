const orderService = require("../services/order.service");

const createOrder = async (req, res, next) => {
    try {
        const {
            customer_name,
            product_name,
            status,
        } = req.body;

        if (!customer_name || !product_name) {
            return res.status(400).json({
                success: false,
                message:
                    "customer_name and product_name are required",
            });
        }

        if (
            status !== undefined &&
            ![
                "pending",
                "shipped",
                "delivered",
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid status. Allowed values: pending, shipped, delivered",
            });
        }

        const order =
            await orderService.createOrder({
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
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders =
            await orderService.getAllOrders();


        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });


    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;


        const order =
            await orderService.getOrderById(id);


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
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;


        const {
            customer_name,
            product_name,
            status,
        } = req.body;


        const updateData = {};


        if (customer_name !== undefined) {
            updateData.customer_name =
                customer_name;
        }


        if (product_name !== undefined) {
            updateData.product_name =
                product_name;
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


        if (
            Object.keys(updateData).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one field is required to update",
            });
        }


        const order =
            await orderService.updateOrder(
                id,
                updateData
            );


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
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;


        const deleted =
            await orderService.deleteOrder(id);


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
        next(error);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};