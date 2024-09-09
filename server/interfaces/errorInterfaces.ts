export interface IHttpError extends Error {
  status: number;
}

export interface IErrorMessageList {
  [key: number]: string
}
