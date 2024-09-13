import CouponModel from '../models/coupon.model'
import OrderModel from '../models/order.model'
import { httpError } from '../utils/httpError'
import { IOrderProduct } from '../interfaces/orderInterfaces'
import { stripe } from '../config/stripe'

const createCheckoutSession = async (
  products: IOrderProduct,
  couponCode: string,
  userId: string,
) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw httpError({ status: 400, message: 'Invalid or empty products array' })
  }

  let totalAmount = 0

  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100) // price in cents for Stripe
    totalAmount += amount * product.quantity

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    }
  })

  let coupon = null
  if (couponCode) {
    coupon = await CouponModel.findOne({ code: couponCode, userId, isActive: true })
    if (coupon) {
      totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100)
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    metadata: {
      userId: userId.toString(),
      couponCode: couponCode || '',
      products: JSON.stringify(
        products.map((p) => ({
          id: p._id,
          quantity: p.quantity,
          price: p.price,
        })),
      ),
    },
  })

  if (totalAmount >= 20000) {
    await createNewCoupon(userId)
  }

  return { id: session.id, totalAmount: totalAmount / 100 }
}

const checkoutSuccess = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === 'unpaid') {
    throw httpError({ status: 402, message: 'Payment was not successful.' })
  }

  if (session.payment_status === 'paid') {
    if (session.metadata && session.metadata.couponCode) {
      await CouponModel.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        {
          isActive: false,
        },
      )
    }

    if (session.metadata && session.metadata.products) {
      const products = JSON.parse(session.metadata.products)

      const newOrder = new OrderModel({
        user: session.metadata.userId,
        products: products.map((product: { id: string; quantity: number; price: number }) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total ? session.amount_total / 100 : 0, // convert from cents to dollars, handle possible null
        stripeSessionId: sessionId,
      })

      await newOrder.save()

      return newOrder._id
    }
  }
}

async function createStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: 'once',
  })

  return coupon.id
}

async function createNewCoupon(userId: string) {
  await CouponModel.findOneAndDelete({ userId })

  const newCoupon = new CouponModel({
    code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  })

  await newCoupon.save()

  return newCoupon
}

export default {
  createCheckoutSession,
  checkoutSuccess,
}
