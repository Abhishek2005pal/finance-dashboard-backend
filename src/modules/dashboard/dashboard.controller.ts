import { NextFunction, Request, Response } from 'express';
import {
    getDashboardByCategory,
    getDashboardSummary,
    getDashboardTrends,
    getRecentDashboardActivity,
} from './dashboard.service';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getDashboardSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

export const getSummaryByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getDashboardByCategory();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupBy = 'monthly' } = req.query;
    const trends = await getDashboardTrends(groupBy as 'monthly' | 'weekly');
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await getRecentDashboardActivity();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};
