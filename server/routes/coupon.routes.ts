import express from 'express'
import CouponController from '../controllers/coupon.controller'
import { authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.get('/', authRoute, ctrlWrapper(CouponController.getCoupon))
router.post('/validate', authRoute, ctrlWrapper(CouponController.validateCoupon))

export default router
