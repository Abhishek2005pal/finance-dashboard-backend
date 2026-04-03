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
exports.deleteRecord = exports.getRecord = exports.getRecords = exports.createRecord = exports.updateRecord = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const records_service_1 = require("./records.service");
const recordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive("Amount must be a positive number"),
    type: zod_1.z.nativeEnum(client_1.RecordType),
    category: zod_1.z.string().min(2, "Category must be at least 2 characters long"),
    date: zod_1.z.string().transform((str) => new Date(str)),
    notes: zod_1.z.string().optional(),
});
// ... existing code ...
const updateRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateSchema = recordSchema.partial();
        const data = updateSchema.parse(req.body);
        const record = yield (0, records_service_1.updateFinancialRecordById)(req.params.id, data);
        res.status(200).json({ success: true, data: record });
    }
    catch (error) {
        next(error);
    }
});
exports.updateRecord = updateRecord;
const createRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = recordSchema.parse(req.body);
        const user = req.user;
        const record = yield (0, records_service_1.createFinancialRecord)(Object.assign(Object.assign({}, data), { createdById: user.id }));
        res.status(201).json({ success: true, data: record });
    }
    catch (error) {
        next(error);
    }
});
exports.createRecord = createRecord;
const getRecords = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
        const filters = {
            type: type,
            category: category,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        };
        const { records, total } = yield (0, records_service_1.getFinancialRecords)(Number(page), Number(limit), filters);
        res.status(200).json({ success: true, data: records, meta: { page, limit, total } });
    }
    catch (error) {
        next(error);
    }
});
exports.getRecords = getRecords;
const getRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield (0, records_service_1.getFinancialRecordById)(req.params.id);
        res.status(200).json({ success: true, data: record });
    }
    catch (error) {
        next(error);
    }
});
exports.getRecord = getRecord;
const deleteRecord = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, records_service_1.deleteFinancialRecordById)(req.params.id);
        res.status(200).json({ success: true, data: { message: 'Record deleted successfully' } });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRecord = deleteRecord;
