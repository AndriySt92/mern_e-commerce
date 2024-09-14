import { Request, Response } from 'express'
import AnalyticsService from '../services/analytics.service'

export const getAnalyticsData = async (req: Request, res: Response) => {
    const analyticsData = await AnalyticsService.getAnalyticsData()
    const dailySalesData = await AnalyticsService.getDailySalesData()

    res.json({
      analyticsData,
      dailySalesData,
    })
};

export default {
    getAnalyticsData
  }
  

