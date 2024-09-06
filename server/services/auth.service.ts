import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model'
import { redis } from '../config/redis'
import { httpError } from '../utils/httpError'
import { IDecodedToken, ILoginData, IRegisterData } from '../interfaces/userInterfaces'
import { generateTokensAndSetCookies } from '../utils/generateTokensAndSetCookies'
import { Response } from 'express'

const storeRefreshToken = async (userId: string, refreshToken: string) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60) // 7days
}

const register = async (registerData: IRegisterData, res: Response) => {
  const { username, password, email } = registerData

  const user = await UserModel.findOne({ email })

  if (user) {
    throw httpError({ status: 409, message: 'Email already use' })
  }

  const newUser = await UserModel.create({
    username,
    email,
    password,
  })

  const { refreshToken } = generateTokensAndSetCookies(newUser._id.toString(), res as any)
  await storeRefreshToken(newUser._id.toString(), refreshToken)
  return newUser
}

const login = async (loginData: ILoginData, res: Response) => {
  const { password, email } = loginData

  const user = await UserModel.findOne({ email })

  if (!user) {
    throw httpError({ status: 400, message: 'Invalid username or password' })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw httpError({ status: 400, message: 'Invalid username or password' })
  }

  const { refreshToken } = generateTokensAndSetCookies(user._id.toString(), res as any)
  await storeRefreshToken(user._id.toString(), refreshToken)

  return user
}

const logout = async (refreshToken: string) => {
  if (refreshToken) {
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as IDecodedToken

    await redis.del(`refresh_token:${userId}`)
  }
}

const refreshToken = async (refreshToken: string, res: Response) => {
  if (!refreshToken) {
    throw httpError({ status: 401, message: 'No refresh token provided' })
  }

  const { userId } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as IDecodedToken

  const storedToken = await redis.get(`refresh_token:${userId}`)

  if (storedToken !== refreshToken) {
    throw httpError({ status: 401, message: 'Invalid refresh token' })
  }

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  })
}

export default {
  register,
  login,
  logout,
  refreshToken,
}
