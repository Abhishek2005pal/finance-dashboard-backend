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
exports.deleteFinancialRecordById = exports.updateFinancialRecordById = exports.getFinancialRecordById = exports.getFinancialRecords = exports.createFinancialRecord = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const createFinancialRecord = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield db_1.prisma.financialRecord.create({ data });
    return record;
});
exports.createFinancialRecord = createFinancialRecord;
const getFinancialRecords = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const where = { isDeleted: false };
    if (filters.type)
        where.type = filters.type;
    if (filters.category)
        where.category = { contains: filters.category, mode: 'insensitive' };
    if (filters.startDate)
        where.date = Object.assign(Object.assign({}, where.date), { gte: filters.startDate });
    if (filters.endDate)
        where.date = Object.assign(Object.assign({}, where.date), { lte: filters.endDate });
    const [records, total] = yield db_1.prisma.$transaction([
        db_1.prisma.financialRecord.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: 'desc' },
        }),
        db_1.prisma.financialRecord.count({ where }),
    ]);
    return { records, total };
});
exports.getFinancialRecords = getFinancialRecords;
const getFinancialRecordById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield db_1.prisma.financialRecord.findFirst({
        where: { id, isDeleted: false },
    });
    if (!record) {
        throw new AppError_1.AppError('NOT_FOUND', 'Record not found');
    }
    return record;
});
exports.getFinancialRecordById = getFinancialRecordById;
const updateFinancialRecordById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield db_1.prisma.financialRecord.update({
        where: { id },
        data,
    });
    return record;
});
exports.updateFinancialRecordById = updateFinancialRecordById;
const deleteFinancialRecordById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.prisma.financialRecord.update({
        where: { id },
        data: { isDeleted: true },
    });
});
exports.deleteFinancialRecordById = deleteFinancialRecordById;
