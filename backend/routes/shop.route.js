import express from 'express';
import {createShop,activateShop,loginShop,getSeller } from '../controllers/shop.controller.js';
import { isSeller } from '../middleware/auth.middleware.js';
const router = express.Router();


router.post('/create-shop', createShop);
router.post('/activation', activateShop);
router.post('/login-shop',loginShop);
router.get('/getSeller',isSeller,getSeller);


export default router;

