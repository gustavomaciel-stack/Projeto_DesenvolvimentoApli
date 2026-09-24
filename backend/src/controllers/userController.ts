import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
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

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('Não autenticado.', 401);
      }

      const result = await userService.remove(req.params.id, req.user.role);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
