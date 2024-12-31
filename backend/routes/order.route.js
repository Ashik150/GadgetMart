import express from 'express';
import {createOrder,getAllOrdersOfUser,getAllOrdersOfSeller,updateOrderStatus,requestOrderRefund,acceptOrderRefund} from '../controllers/order.controller.js';
const router = express.Router();
import { isSeller} from '../middleware/auth.middleware.js';

router.post("/create-order", createOrder);
router.get("/get-all-orders/:userId", getAllOrdersOfUser);
router.get("/get-seller-all-orders/:shopId", getAllOrdersOfSeller);
router.put("/update-order-status/:id", isSeller, updateOrderStatus);
router.put("/order-refund/:id", requestOrderRefund);
router.put("/order-refund-success/:id", isSeller, acceptOrderRefund);

export default router;