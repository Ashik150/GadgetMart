import { Shop } from "../models/shop.model.js";
import { ErrorHandler } from '../Utils/errorHandler.js';
import jwt from "jsonwebtoken";

export const isSeller = async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id);

    next();
};