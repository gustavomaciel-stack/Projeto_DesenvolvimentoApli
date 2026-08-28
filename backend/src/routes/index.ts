import { Router } from 'express';
import healthRoutes from './health.routes.js';
import matchRoutes from './match.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use(healthRoutes);
router.use(userRoutes);
router.use(matchRoutes);

export default router;
