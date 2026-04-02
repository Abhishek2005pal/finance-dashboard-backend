import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { config } from '../../config/env';
import { AppError } from '../../utils/AppError';

export const registerUser = async (data: any) => {
  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('VALIDATION_ERROR', 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || Role.VIEWER,
    },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('UNAUTHORIZED', 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('UNAUTHORIZED', 'Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
