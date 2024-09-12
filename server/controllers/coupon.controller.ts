import { Request, Response } from 'express'
import CouponService from '../services/coupon.service'
import { IUser } from '../models/user.model'

interface IRequest extends Request {
  user?: IUser
}

const getCoupon = async (req: IRequest, res: Response) => {
  const { _id: userId } = req.user as IUser

  const coupon = await CouponService.getOne(userId)
  res.json(coupon || null)
}

const validateCoupon = async (req: Request, res: Response) => {
  const { _id: userId } = req.user as IUser
  const { code } = req.body

  const coupon = await CouponService.validate(code, userId)

  res.json({
    message: 'Coupon is valid',
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  })
}

export default {
  getCoupon,
  validateCoupon,
}
