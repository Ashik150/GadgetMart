import cloudinary from 'cloudinary';
import { Product } from '../models/product.model.js';
import { Shop } from '../models/shop.model.js';
import ErrorHandler from '../Utils/ErrorHandler.js';

export const createProduct = async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler('Shop not found', 400));
        } else {
            let images = [];

            if (typeof req.body.images === "string") {
                images.push(req.body.images);
            } else {
                images = req.body.images;
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "products",
                });

                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }

            const productData = req.body;
            productData.images = imagesLinks;
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
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not found', 400));
        }

        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.uploader.destroy(
                product.images[i].public_id
            );
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};

