import { Request, Response } from 'express'
import CartService from '../services/cart.service'
import { IUser } from '../models/user.model'

interface IRequest extends Request {
  user?: IUser
}

const getCartProducts = async (req: IRequest, res: Response) => {
  const user = req.user as IUser

  const cardItems = await CartService.getAll(user.cartItems)
  res.json(cardItems)
}

const addToCart = async (req: IRequest, res: Response) => {
  const user = req.user as IUser
  const { productId } = req.body

  const cardItems = await CartService.add(productId, user)
  res.json(cardItems)
}

const removeAllFromCart = async (req: IRequest, res: Response) => {
  const user = req.user as IUser
  const { productId } = req.body

  const cardItems = await CartService.removeAll(productId, user)
  res.json(cardItems)
}

const updateQuantity = async (req: IRequest, res: Response) => {
  const user = req.user as IUser
  const { id: productId } = req.params
  const { quantity } = req.body

  const cardItems = await CartService.updateQuantity(productId, user, quantity)
  res.json(cardItems)
}

export default {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateQuantity,
}
