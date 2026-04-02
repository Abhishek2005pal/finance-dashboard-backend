import { RecordType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import {
    createFinancialRecord,
    deleteFinancialRecordById,
    getFinancialRecordById,
    getFinancialRecords,
    updateFinancialRecordById,
} from './records.service';

const recordSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  type: z.nativeEnum(RecordType),
  category: z.string().min(2, "Category must be at least 2 characters long"),
  date: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
});

// ... existing code ...

export const updateRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateSchema = recordSchema.partial();
    const data = updateSchema.parse(req.body);
    const record = await updateFinancialRecordById(req.params.id, data);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = recordSchema.parse(req.body);
    const user = (req as any).user;
    const record = await createFinancialRecord({ ...data, createdById: user.id });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    const filters = {
      type: type as any,
      category: category as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    };
    const { records, total } = await getFinancialRecords(Number(page), Number(limit), filters);
    res.status(200).json({ success: true, data: records, meta: { page, limit, total } });
  } catch (error) {
    next(error);
  }
};

export const getRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await getFinancialRecordById(req.params.id);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFinancialRecordById(req.params.id);
    res.status(200).json({ success: true, data: { message: 'Record deleted successfully' } });
  } catch (error) {
    next(error);
  }
};
