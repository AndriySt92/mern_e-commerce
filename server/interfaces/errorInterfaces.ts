export interface IHttpError {
  status: number
  message?: string
}

export interface IErrorMessageList {
  [key: number]: string
}
