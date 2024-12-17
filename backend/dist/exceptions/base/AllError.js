"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
class AllError extends Error {
    constructor(message) {
        super();
        if (message instanceof Error) {
            this.code = message.code;
            this.message = message.message;
            this.stack = message.stack;
            this.index = message.index;
        }
        else if (typeof message == 'string') {
            this.message = message;
        }
    }
}
exports.default = AllError;
