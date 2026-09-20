import { Router } from "express";
import { matchController } from "../controllers/matchController.js";
import { participationController } from "../controllers/participationController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/matches", authMiddleware, matchController.create);
router.get("/matches", matchController.list);
router.get("/matches/:id", matchController.getById);
router.put("/matches/:id", authMiddleware, matchController.update);
router.patch("/matches/:id/cancel", authMiddleware, matchController.cancel);
router.post("/matches/:id/join", authMiddleware, participationController.join);
router.post(
  "/matches/:id/leave",
  authMiddleware,
  participationController.leave,
);
router.get("/matches/:id/participants", participationController.list);

export default router;
