import express from 'express'
import AnalyticsController from '../controllers/analytics.controller'
import { adminRoute, authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.get('/', authRoute, adminRoute, ctrlWrapper(AnalyticsController.getAnalyticsData))

export default router
