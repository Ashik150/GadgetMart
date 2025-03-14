import ErrorHandler from "../Utils/ErrorHandler.js";
import { Order } from "../models/order.model.js";
import { Shop } from "../models/shop.model.js";
import { Product } from "../models/product.model.js";

export const createOrder = async (req, res, next) => {
    try {
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
        console.log(cart);

        //   group cart items by shopId
        const shopItemsMap = new Map();

        for (const item of cart) {
            const shopId = item.shopId;
            if (!shopItemsMap.has(shopId)) {
                shopItemsMap.set(shopId, []);
            }
            shopItemsMap.get(shopId).push(item);
        }

        // create an order for each shop
        const orders = [];

        for (const [shopId, items] of shopItemsMap) {
            const order = await Order.create({
                cart: items,
                shippingAddress,
                user,
                totalPrice,
                paymentInfo,
            });
            orders.push(order);
        }

        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getAllOrdersOfUser = async (req, res, next) => {
    try {
        const orders = await Order.find({ "user._id": req.params.userId }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getAllOrdersOfSeller = async (req, res, next) => {
    try {
        const orders = await Order.find({
            "cart.shopId": req.params.shopId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }
        if (req.body.status === "Transferred to delivery partner") {
            order.cart.forEach(async (o) => {
                await updateOrder(o._id, o.qty);
            });
        }

        order.status = req.body.status;

        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
            order.paymentInfo.status = "Succeeded";
            const serviceCharge = order.totalPrice * .10;
            await updateSellerInfo(order.totalPrice - serviceCharge);
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            order,
        });

        async function updateOrder(id, qty) {
            const product = await Product.findById(id);

            product.stock -= qty;
            product.sold_out += qty;

            await product.save({ validateBeforeSave: false });
        }

        async function updateSellerInfo(amount) {
            const seller = await Shop.findById(req.seller.id);

            seller.availableBalance = amount;

            await seller.save();
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const requestOrderRefund = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        order.status = req.body.status;

        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            order,
            message: "Order Refund Request successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const acceptOrderRefund = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 400));
        }

        order.status = req.body.status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order Refund successfull!",
        });

        if (req.body.status === "Refund Success") {
            order.cart.forEach(async (o) => {
                await updateOrder(o._id, o.qty);
            });
        }

        async function updateOrder(id, qty) {
            const product = await Product.findById(id);

            product.stock += qty;
            product.sold_out -= qty;

            await product.save({ validateBeforeSave: false });
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getAllOrdersForAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({
            deliveredAt: -1,
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};


