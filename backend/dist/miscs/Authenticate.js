"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || '';
class Authenticate {
    req;
    constructor(req) {
        this.req = req;
        if (!JWT_SECRET) {
            throw new Error('Invalid JWT_SECRET');
        }
    }
    async verify() {
        let token = this.req.headers.authorization;
        token = token?.split('Bearer ').pop();
        if (!token) {
            return false;
        }
        return await new Promise((resolve) => {
            jsonwebtoken_1.default.verify(token, JWT_SECRET, (error, decoded) => {
                if (!error) {
                    ;
                    this.req.user = decoded;
                    this.req.token = token;
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
    static async decode(token) {
        if (!token) {
            return false;
        }
        return await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, JWT_SECRET, (error, decoded) => {
                if (error) {
                    reject(error);
                }
                resolve(decoded);
            });
        });
    }
    generateToken(user) {
        const payload = user;
        const currentTimestamp = Date.now();
        const expirationTimestamp = currentTimestamp + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        const credentials = {
            subject: `${user?._id || user?.uid}`,
            expiresIn: Math.floor(expirationTimestamp / 1000), // Convert to seconds
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, credentials);
        return token;
    }
}
exports.default = Authenticate;
