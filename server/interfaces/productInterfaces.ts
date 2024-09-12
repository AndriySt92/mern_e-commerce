import mongoose, { Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  image: string
  category: string
  isFeatured?: boolean
}

export interface ICoupon extends Document {
  code: string
  discountPercentage: number
  expirationDate: Date
  isActive: boolean
  userId: mongoose.Types.ObjectId
}
