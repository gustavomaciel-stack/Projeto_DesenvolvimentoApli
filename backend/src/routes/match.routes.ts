import { Router } from 'express';
import { matchController } from '../controllers/matchController.js';
import { participationController } from '../controllers/participationController.js';

const router = Router();

router.post('/matches', matchController.create);
router.get('/matches', matchController.list);
router.get('/matches/:id', matchController.getById);
router.put('/matches/:id', matchController.update);
router.patch('/matches/:id/cancel', matchController.cancel);
router.post('/matches/:id/join', participationController.join);
router.post('/matches/:id/leave', participationController.leave);
router.get('/matches/:id/participants', participationController.list);

export default router;
