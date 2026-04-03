"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentDashboardActivity = exports.getDashboardTrends = exports.getDashboardByCategory = exports.getDashboardSummary = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const getDashboardSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalIncomeDecimal = (yield db_1.prisma.financialRecord.aggregate({
        where: { type: client_1.RecordType.INCOME, isDeleted: false },
        _sum: { amount: true },
    }))._sum.amount || 0;
    const totalExpensesDecimal = (yield db_1.prisma.financialRecord.aggregate({
        where: { type: client_1.RecordType.EXPENSE, isDeleted: false },
        _sum: { amount: true },
    }))._sum.amount || 0;
    const totalRecords = yield db_1.prisma.financialRecord.count({
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
});
exports.getDashboardSummary = getDashboardSummary;
const getDashboardByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield db_1.prisma.financialRecord.groupBy({
        by: ['category', 'type'],
        where: { isDeleted: false },
        _sum: {
            amount: true,
        },
    });
    const summary = results.reduce((acc, curr) => {
        if (!acc[curr.category]) {
            acc[curr.category] = { income: 0, expense: 0 };
        }
        if (curr.type === client_1.RecordType.INCOME) {
            acc[curr.category].income += curr._sum.amount || 0;
        }
        else {
            acc[curr.category].expense += curr._sum.amount || 0;
        }
        return acc;
    }, {});
    return summary;
});
exports.getDashboardByCategory = getDashboardByCategory;
const getDashboardTrends = (groupBy) => __awaiter(void 0, void 0, void 0, function* () {
    // This is a simplified example. A real implementation would require more complex date handling.
    const results = yield db_1.prisma.financialRecord.findMany({
        where: { isDeleted: false },
        orderBy: { date: 'asc' },
    });
    const trends = results.reduce((acc, record) => {
        const period = groupBy === 'monthly'
            ? record.date.toISOString().slice(0, 7)
            : `W${getWeek(record.date)}`;
        if (!acc[period]) {
            acc[period] = { period, income: 0, expense: 0 };
        }
        if (record.type === client_1.RecordType.INCOME) {
            acc[period].income += record.amount;
        }
        else {
            acc[period].expense += record.amount;
        }
        return acc;
    }, {});
    return Object.values(trends);
});
exports.getDashboardTrends = getDashboardTrends;
const getRecentDashboardActivity = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.financialRecord.findMany({
        where: { isDeleted: false },
        orderBy: { date: 'desc' },
        take: 10,
    });
});
exports.getRecentDashboardActivity = getRecentDashboardActivity;
function getWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
