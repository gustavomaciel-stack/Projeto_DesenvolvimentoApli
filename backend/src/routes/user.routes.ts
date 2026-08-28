import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

router.post('/users', userController.register);
router.get('/users', userController.list);
router.get('/users/:id', userController.getById);

export default router;
