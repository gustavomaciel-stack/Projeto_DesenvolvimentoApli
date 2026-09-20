import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/authService.js";

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
