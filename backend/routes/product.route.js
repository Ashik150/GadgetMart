import express from 'express';
import {createProduct,getProducts} from '../controllers/product.controller.js';
const router = express.Router();

router.post('/create-product',createProduct);
router.get('/get-all-products-shop/:id',getProducts);

export default router;
