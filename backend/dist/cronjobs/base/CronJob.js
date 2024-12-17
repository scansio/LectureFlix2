"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
//import Logger from '../../miscs/Logger'
const Logger_1 = __importDefault(require("../../miscs/Logger"));
const TimeSpan_1 = __importDefault(require("./TimeSpan"));
class CronJob {
    static type = TimeSpan_1.default.MINUTE;
    static span = 1;
    async criteria() {
        return false;
    }
    run() {
        this.criteria()
            .then((_criteria) => {
            if (_criteria) {
                this.job(_criteria).catch((error) => {
                    Logger_1.default.log('error', error);
                });
            }
        })
            .catch(() => { });
    }
}
exports.default = CronJob;
