import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { adminOnly } from '../middlewares/admin.js';

const router = Router();

router.post('/users', userController.register);
router.get('/users', userController.list);
router.get('/users/:id', userController.getById);
router.delete('/users/:id', authMiddleware, adminOnly, userController.remove);

export default router;
