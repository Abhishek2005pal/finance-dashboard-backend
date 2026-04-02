import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { loginUser, registerUser } from './auth.service';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.nativeEnum(Role).optional(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);
    const { user, token } = await registerUser({ name, email, password, role });
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, token } = await loginUser({ email, password });
    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};
