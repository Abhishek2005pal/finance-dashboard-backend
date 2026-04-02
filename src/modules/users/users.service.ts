import { Role, UserStatus } from '@prisma/client';
import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const getAllUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count(),
  ]);
  return { users, total };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError('NOT_FOUND', 'User not found');
  }
  return user;
};

export const updateUserById = async (id: string, data: { name?: string; role?: Role; status?: UserStatus }) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const deleteUserById = async (id: string, currentUserId: string) => {
  if (id === currentUserId) {
    throw new AppError('VALIDATION_ERROR', 'You cannot delete your own account');
  }
  await prisma.user.update({
    where: { id },
    data: { status: UserStatus.INACTIVE },
  });
};
