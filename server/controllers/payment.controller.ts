import { Request, Response } from 'express'
import PaymentService from '../services/payment.service'
import { IUser } from '../models/user.model'

interface IRequest extends Request {
  user?: IUser
}

const createCheckoutSession = async (req: IRequest, res: Response) => {
  // const { products, couponCode } = req.body
  const { _id: userId } = req.user as IUser

  // const paymentInfo = await PaymentService.createCheckoutSession(products, couponCode, userId)

  // res.json(paymentInfo)
  res.json({message: 'success'})
}

const checkoutSuccess = async (req: Request, res: Response) => {
  const { sessionId } = req.body

  const order = await PaymentService.checkoutSuccess(sessionId)

  res.json({
    success: true,
    message: 'Payment successful, order created, and coupon deactivated if used.',
    orderId: order?._id,
  })
}

export default {
  createCheckoutSession,
  checkoutSuccess,
}
