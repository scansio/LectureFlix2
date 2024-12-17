/* eslint-disable @typescript-eslint/no-explicit-any */
class AllError extends Error {
  constructor(message?: string | Error) {
    super()
    if (message instanceof Error) {
      this.code = (message as any).code
      this.message = (message as any).message
      this.stack = (message as any).stack
      this.index = (message as any).index
    } else if (typeof message == 'string') {
      this.message = message
    }
  }
  [key: string]: any
}

export default AllError
