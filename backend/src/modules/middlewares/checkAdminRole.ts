import { Request, Response, NextFunction } from 'express';

export const checkAdminRole = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    return;
  }

  next();
};