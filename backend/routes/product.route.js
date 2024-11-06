import express from 'express';
import {createProduct} from '../controllers/product.controller.js';
import {upload} from '../multer.js';
const router = express.Router();

router.post('/create-product',upload.array("images") ,createProduct);

export default router;
