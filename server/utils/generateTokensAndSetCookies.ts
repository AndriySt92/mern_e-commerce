import { Response } from 'express';
import jwt from 'jsonwebtoken'

export const generateTokensAndSetCookies = (userId: string, res: Response) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  })

  res.cookie("accessToken", accessToken, {
		httpOnly: true, 
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", 
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, 
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

  return { refreshToken }
}
