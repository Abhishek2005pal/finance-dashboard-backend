import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return next(new AppError('FORBIDDEN', 'You do not have permission to perform this action'));
    }

    next();
  };
};
