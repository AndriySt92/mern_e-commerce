import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/connectDB'
import { IHttpError } from './interfaces/errorInterfaces'
import { errorMessageList, httpError } from './utils/httpError'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'
import couponRoutes from './routes/coupon.routes'
import paymentRoutes from './routes/payment.routes'
import analyticsRoutes from './routes/analytics.routes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

//error handlers
app.all('*', (req, _res, _next): void => {
  throw httpError({ status: 404, message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

// Database connection
connectDB()

export default app
