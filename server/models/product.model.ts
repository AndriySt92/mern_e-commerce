import mongoose, { Model, Schema } from 'mongoose'
import { IProduct } from '../interfaces/productInterfaces'

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema)

export default Product
