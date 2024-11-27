import express from 'express';
import {createProduct,getProducts,deleteProduct} from '../controllers/product.controller.js';
const router = express.Router();

router.post('/create-product',createProduct);
router.get('/get-all-products-shop/:id',getProducts);
router.delete('/delete-shop-product/:id',deleteProduct);

export default router;
