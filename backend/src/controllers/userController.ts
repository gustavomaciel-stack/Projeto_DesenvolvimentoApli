import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.list();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
};
