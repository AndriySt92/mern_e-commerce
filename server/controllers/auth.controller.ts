import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { httpError } from '../utils/httpError'
import AuthService from '../services/auth.service'
import { IUser } from '../models/user.model'

interface IRequest extends Request {
  user?: IUser
}

const register = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const user = await AuthService.register(req.body, res as any)

  res.status(201).json(user)
}

const login = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const user = await AuthService.login(req.body, res as any)

  res.status(200).json(user)
}

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  await AuthService.logout(refreshToken)

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: 'Logged out successfully' })
}

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  await AuthService.refreshToken(refreshToken, res as any)

  res.json({ message: 'Token refreshed successfully' })
}

const getProfile  = async (req: IRequest, res: Response) => {
  const user = req.user
  res.json(user)
}

export default {
  register,
  login,
  logout,
  refreshToken,
  getProfile
}
