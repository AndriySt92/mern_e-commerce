import mongoose, { Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { ICartItem } from '../interfaces/userInterfaces'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  cartItems: ICartItem[]
  role?: 'customer' | 'admin'
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
