import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
