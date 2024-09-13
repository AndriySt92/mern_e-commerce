import express from 'express'
import PaymentController from '../controllers/payment.controller'
import { authRoute } from '../middlewares/authenticate'
import { ctrlWrapper } from '../utils/ctrlWrapper'

const router = express.Router()

router.post('/create-checkout-session', authRoute, ctrlWrapper(PaymentController.createCheckoutSession))
router.post('/checkout-success', authRoute, ctrlWrapper(PaymentController.checkoutSuccess))

export default router

