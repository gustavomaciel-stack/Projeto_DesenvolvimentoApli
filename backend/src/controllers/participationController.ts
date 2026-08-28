import type { NextFunction, Request, Response } from 'express';
import { participationService } from '../services/participationService.js';

export const participationController = {
  join: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await participationService.join(req.params.id, req.body.userId)); } catch (err) { next(err); }
  },
  leave: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await participationService.leave(req.params.id, req.body.userId)); } catch (err) { next(err); }
  },
  list: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await participationService.listByMatch(req.params.id)); } catch (err) { next(err); }
  },
};
