import {Product} from '../models/product.model';
import { Shop } from '../models/shop.model';
import ErrorHandler from '../Utils/errorHandler';

export const createProduct = async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler('Shop not found', 400));
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.fileName}`);
            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;

            const product = await Product.create(productData);
            res.status(201).json({
                success: true,
                product,
            });
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}
