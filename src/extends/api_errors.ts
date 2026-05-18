type BaseError = {
  code: number,
  api_message: string,
  path: string
  method: string
}

export class APIError extends Error {
  declare code: number
  declare api_message: string
  declare path: string
  declare method: string

  constructor({ code, api_message, path, method }: BaseError, message: string) {
    super(message);
    this.path = path
    this.method = method
    this.code = code
    this.api_message = api_message
  }
}