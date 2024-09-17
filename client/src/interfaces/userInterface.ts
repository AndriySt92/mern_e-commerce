export interface ICartItem {
  _id: string
  quantity: number
  product: string
}

export interface IUser {
  _id: string
  username: string
  email: string
  cartItems: ICartItem[]
  role?: 'customer' | 'admin'
}

export interface ISignUpData {
  username: string
  email: string
  password: string
  confirmPassword: string
}
