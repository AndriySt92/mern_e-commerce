import { NextFunction, Response, Request } from 'express'

export const ctrlWrapper =
  (ctrl: (req: Request, res: Response, next: NextFunction) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next)
    } catch (error) {
      next(error)
    }
  }