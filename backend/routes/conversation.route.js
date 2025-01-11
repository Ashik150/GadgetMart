import express from 'express';
import { isSeller } from '../middleware/auth.middleware.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { createConversation,getConversationSeller,getConversationUser } from '../controllers/conversation.controller.js';
const router = express.Router();

router.post('/create-new-conversation',createConversation);
router.get('/get-all-conversation-seller/:id',isSeller,getConversationSeller);
router.get('/get-all-conversation-user/:id',verifyToken,getConversationUser);

export default router;