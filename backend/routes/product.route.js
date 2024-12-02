import express from 'express';
import {createProduct,getProducts,deleteProduct,getAllProduct} from '../controllers/product.controller.js';
const router = express.Router();

router.post('/create-product',createProduct);
router.get('/get-all-products-shop/:id',getProducts);
router.delete('/delete-shop-product/:id',deleteProduct);
router.get('/get-all-products',getAllProduct);

export default router;
