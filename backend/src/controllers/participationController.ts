import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { participationService } from "../services/participationService.js";

const getAuthenticatedUserId = (req: Request) => {
  if (!req.user?.userId) {
    throw new AppError("Não autenticado.", 401);
  }

  return req.user.userId;
};

export const participationController = {
  join: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(201)
        .json(
          await participationService.join(
            req.params.id,
            getAuthenticatedUserId(req),
          ),
        );
    } catch (err) {
      next(err);
    }
  },
  leave: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(
          await participationService.leave(
            req.params.id,
            getAuthenticatedUserId(req),
          ),
        );
    } catch (err) {
      next(err);
    }
  },
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await participationService.listByMatch(req.params.id));
    } catch (err) {
      next(err);
    }
  },
};
