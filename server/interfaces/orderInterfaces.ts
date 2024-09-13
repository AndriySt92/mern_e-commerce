import { ObjectId } from "mongoose"

export interface IOrderProduct {
  product: ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  user: ObjectId
  products: IOrderProduct[]
  totalAmount: number
  stripeSessionId?: string
}
