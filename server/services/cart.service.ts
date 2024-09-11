import ProductModel from '../models/product.model'
import { httpError } from '../utils/httpError'
import { ICartItem } from '../interfaces/userInterfaces'
import { IUser } from '../models/user.model'

const add = async (productId: string, user: IUser) => {
  const existingItem = user.cartItems.find((item) => item._id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    user.cartItems.push({ product: productId, quantity: 1 } as ICartItem)
  }
  //@ts-ignore
  await user.save()

  return user.cartItems
}

const getAll = async (userCartItems: ICartItem[]) => {
  const productIds = userCartItems.map((item) => item.product)
  const products = await ProductModel.find({ _id: { $in: productIds } })

  const cartItems = products.map((product) => {
    const item = userCartItems.find((cartItem) => cartItem._id === product._id)
    return { ...product.toJSON(), quantity: item?.quantity }
  })

  return cartItems
}

const removeAll = async (productId: string, user: IUser) => {
  if (!productId) {
    user.cartItems = []
  } else {
    user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId)
  }
  //@ts-ignore
  await user.save()

  return user.cartItems
}

const updateQuantity = async (productId: string, user: IUser, quantity: number) => {
  const existingItem = user.cartItems.find((item) => item.product.toString() === productId)

  if (existingItem) {
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId)
      //@ts-ignore
      await user.save()

      return user.cartItems
    }

    existingItem.quantity = quantity
    //@ts-ignore
    await user.save()

    return user.cartItems
  } else {
    throw httpError({ status: 404, message: 'Product not found' })
  }
}

export default {
  add,
  getAll,
  removeAll,
  updateQuantity,
}
