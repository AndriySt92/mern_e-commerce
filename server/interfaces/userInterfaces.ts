export interface IRegisterData {
  username:string
  password: string
  email: string
}

export interface ILoginData extends Omit<IRegisterData, 'username'> {}

export interface ICartItem {
  quantity: number
  product: string
}

export interface IDecodedToken {
  userId: string
}
