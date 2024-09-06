import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { IDecodedToken } from '../interfaces/userInterfaces'
import userModel, { IUser } from '../models/user.model'

interface IRequest extends Request {
  user?: IUser
}

export const authRoute = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized - No access token provided' })
  }

  const { userId } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as IDecodedToken

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Invalid Token' })
  }

  const user = await userModel.findById(userId).select('-password')

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  req.user = user;
  next()
}

export const adminRoute = (req: IRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user?.role === 'admin') {
    next()
  } else {
    return res.status(403).json({ message: 'Access denied - Admin only' })
  }
}
