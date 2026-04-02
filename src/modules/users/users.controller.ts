import { Role, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById,
} from './users.service';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { users, total } = await getAllUsers(Number(page), Number(limit));
    res.status(200).json({ success: true, data: users, meta: { page, limit, total } });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const user = await updateUserById(req.params.id, data);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    await deleteUserById(req.params.id, user.id);
    res.status(200).json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
