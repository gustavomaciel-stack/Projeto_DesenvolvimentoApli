import type { NextFunction, Request, Response } from 'express';
import { matchService } from '../services/matchService.js';

export const matchController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await matchService.create(req.body)); } catch (err) { next(err); }
  },
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await matchService.list()); } catch (err) { next(err); }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await matchService.getById(req.params.id)); } catch (err) { next(err); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await matchService.update(req.params.id, req.body)); } catch (err) { next(err); }
  },
  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(200).json(await matchService.cancel(req.params.id, req.body.organizerId)); } catch (err) { next(err); }
  },
};
