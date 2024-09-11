import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/connectDB'
import { IHttpError } from './interfaces/errorInterfaces'
import { errorMessageList } from './utils/httpError'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'


dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

//error handlers
app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not Found' })
})
app.use((err: IHttpError, req: Request, res: Response, next: NextFunction): void => {
  //To avoid error "RangeError [ERR_HTTP_INVALID_STATUS_CODE]: Invalid status code: undefined"
  const status =
    err.status && Number.isInteger(err.status) && err.status >= 100 && err.status < 600
      ? err.status
      : 500
  const message = err.message || errorMessageList[status] || 'Internal Server Error'

  res.status(status).json({ message })
})

// Database connection
connectDB()

export default app
