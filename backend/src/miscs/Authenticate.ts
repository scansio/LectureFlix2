/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Request } from 'express'
dotenv.config()

const JWT_SECRET: string = process.env.JWT_SECRET || ''

class Authenticate {
  private req: Request

  constructor(req: Request) {
    this.req = req
    if (!JWT_SECRET) {
      throw new Error('Invalid JWT_SECRET')
    }
  }

  public async verify() {
    let token = this.req.headers.authorization
    token = token?.split('Bearer ').pop()
    if (!token) {
      return false
    }
    return await new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (error: unknown, decoded: unknown) => {
        if (!error) {
          ;(this.req as any).user = decoded
          ;(this.req as any).token = token
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  public static async decode(token: string) {
    if (!token) {
      return false
    }
    return await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (error: any, decoded: any) => {
        if (error) {
          reject(error)
        }
        resolve(decoded)
      })
    })
  }

  public generateToken(user: any): string {
    const payload = user
    const currentTimestamp = Date.now()
    const expirationTimestamp = currentTimestamp + 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

    const credentials = {
      subject: `${user?._id || user?.uid}`,
      expiresIn: Math.floor(expirationTimestamp / 1000), // Convert to seconds
    }
    const token = jwt.sign(payload, JWT_SECRET, credentials)
    return token
  }
}

export default Authenticate
