import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/mine', requireAuth, getMyOrders);
router.get('/:id', requireAuth, getOrderById);

export default router;
