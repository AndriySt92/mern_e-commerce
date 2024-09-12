import CouponModel from '../models/coupon.model'
import { httpError } from '../utils/httpError'

const getOne = async (userId: string) => {
  const coupon = await CouponModel.findOne({ userId, isActive: true })
  return coupon
}

const validate = async (code: string, userId: string) => {
  const coupon = await CouponModel.findOne({ code, userId, isActive: true })

  if (!coupon) {
    throw httpError({ status: 404, message: 'Coupon not found' })
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false
    await coupon.save()

    throw httpError({ status: 404, message: 'Coupon expired' })
  }

  return coupon
}

export default {
  getOne,
  validate,
}
