import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

export const createFinancialRecord = async (data: any) => {
  const record = await prisma.financialRecord.create({ data });
  return record;
};

export const getFinancialRecords = async (page: number, limit: number, filters: any) => {
  const skip = (page - 1) * limit;
  const where: any = { isDeleted: false };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
  if (filters.startDate) where.date = { ...where.date, gte: filters.startDate };
  if (filters.endDate) where.date = { ...where.date, lte: filters.endDate };

  const [records, total] = await prisma.$transaction([
    prisma.financialRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return { records, total };
};

export const getFinancialRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });
  if (!record) {
    throw new AppError('NOT_FOUND', 'Record not found');
  }
  return record;
};

export const updateFinancialRecordById = async (id: string, data: any) => {
  const record = await prisma.financialRecord.update({
    where: { id },
    data,
  });
  return record;
};

export const deleteFinancialRecordById = async (id: string) => {
  await prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });
};
