import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { matchService } from "../services/matchService.js";

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user?.userId) {
    throw new AppError("Não autenticado.", 401);
  }

  return req.user.userId;
};

export const matchController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = getAuthenticatedUserId(req);
      res
        .status(201)
        .json(await matchService.create({ ...req.body, organizerId }));
    } catch (err) {
      next(err);
    }
  },
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await matchService.list());
    } catch (err) {
      next(err);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await matchService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = getAuthenticatedUserId(req);
      res
        .status(200)
        .json(
          await matchService.update(req.params.id, {
            ...req.body,
            organizerId,
          }),
        );
    } catch (err) {
      next(err);
    }
  },
  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(
          await matchService.cancel(req.params.id, getAuthenticatedUserId(req)),
        );
    } catch (err) {
      next(err);
    }
  },
};
