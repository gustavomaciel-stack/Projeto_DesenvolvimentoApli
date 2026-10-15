import { Router } from "express";
import { authController } from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { userRepository } from "../repositories/userRepository.js";

const router = Router();
router.get("/auth/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user!.userId);
    if (!user) { res.status(401).json({ message: "Usuário não encontrado." }); return; }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) { next(error); }
});

router.post("/auth/login", authController.login);

export default router;
