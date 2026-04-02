import { RecordType } from '@prisma/client';
import { prisma } from '../../config/db';

export const getDashboardSummary = async () => {
  const totalIncomeDecimal = (await prisma.financialRecord.aggregate({
    where: { type: RecordType.INCOME, isDeleted: false },
    _sum: { amount: true },
  }))._sum.amount || 0;

  const totalExpensesDecimal = (await prisma.financialRecord.aggregate({
    where: { type: RecordType.EXPENSE, isDeleted: false },
    _sum: { amount: true },
  }))._sum.amount || 0;

  const totalRecords = await prisma.financialRecord.count({
    where: { isDeleted: false },
  });

  const totalIncome = Number(totalIncomeDecimal);
  const totalExpenses = Number(totalExpensesDecimal);

  return {
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_balance: totalIncome - totalExpenses,
    total_records: totalRecords,
  };
};

export const getDashboardByCategory = async () => {
  const results = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where: { isDeleted: false },
    _sum: {
      amount: true,
    },
  });

  const summary = results.reduce((acc: Record<string, { income: number; expense: number }>, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { income: 0, expense: 0 };
    }
    if (curr.type === RecordType.INCOME) {
      acc[curr.category].income += curr._sum.amount || 0;
    } else {
      acc[curr.category].expense += curr._sum.amount || 0;
    }
    return acc;
  }, {});

  return summary;
};

export const getDashboardTrends = async (groupBy: 'monthly' | 'weekly') => {
  // This is a simplified example. A real implementation would require more complex date handling.
  const results = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'asc' },
  });

  const trends = results.reduce((acc: Record<string, { period: string; income: number; expense: number }>, record) => {
    const period =
      groupBy === 'monthly'
        ? record.date.toISOString().slice(0, 7)
        : `W${getWeek(record.date)}`;

    if (!acc[period]) {
      acc[period] = { period, income: 0, expense: 0 };
    }

    if (record.type === RecordType.INCOME) {
      acc[period].income += record.amount;
    } else {
      acc[period].expense += record.amount;
    }

    return acc;
  }, {});

  return Object.values(trends);
};

export const getRecentDashboardActivity = async () => {
  return prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { date: 'desc' },
    take: 10,
  });
};

function getWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
