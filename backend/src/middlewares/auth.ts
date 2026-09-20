import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const unauthorized = (res: Response) => {
  return res.status(401).json({ message: "Não autenticado." });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.get("Authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  const jwtSecret = process.env.JWT_SECRET;

  if (!match || !jwtSecret) {
    return unauthorized(res);
  }

  try {
    const payload = jwt.verify(match[1], jwtSecret);

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      !payload.userId
    ) {
      return unauthorized(res);
    }

    req.user = { userId: payload.userId };
    return next();
  } catch {
    return unauthorized(res);
  }
};
