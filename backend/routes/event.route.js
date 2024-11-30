import express from 'express';
import {createEvent,getEvents,deleteEvent} from '../controllers/event.controller.js';
const router = express.Router();

router.post('/create-event',createEvent);
router.get('/get-all-events/:id',getEvents);
router.delete('/delete-shop-event/:id',deleteEvent);

export default router;
