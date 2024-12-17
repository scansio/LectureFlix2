"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const CronJob_1 = __importDefault(require("../base/CronJob"));
const TimeSpan_1 = __importDefault(require("../base/TimeSpan"));
const constants_1 = require("../../configs/constants");
const MigrationModel_1 = __importDefault(require("../../models/MigrationModel"));
const RepoHooks_1 = __importDefault(require("../../RepoHooks"));
const Logger_1 = __importDefault(require("../../miscs/Logger"));
const axios_1 = __importDefault(require("axios"));
class DoBackupORANDPush extends CronJob_1.default {
    static type = TimeSpan_1.default.MINUTE;
    //Runs every 30 minutes
    static span = 30;
    async criteria() {
        return true;
    }
    async job() {
        const migration = await MigrationModel_1.default.initModels();
        if (process.env.DO_DOWNLOAD_SERVER_DATA_UPDATE) {
            try {
                const data = await (0, axios_1.default)({
                    method: 'GET',
                    baseURL: process.env.MAIN_SERVER_URL,
                    url: constants_1.SERVER_UPDATE_DATA_URL,
                    headers: {
                        Authorization: process.env.MAIN_SERVER_ADMIN_TOKEN,
                    },
                });
                const d = data?.data?.data?.models;
                await migration.update(d);
            }
            catch (error) {
                Logger_1.default.error(error);
            }
        }
        if (process.env.DO_BACKUP) {
            const backupData = await migration.backup();
            if (backupData && backupData[0]) {
                try {
                    await (0, axios_1.default)({
                        method: 'POST',
                        baseURL: process.env.MAIN_SERVER_URL,
                        url: constants_1.MIGRATE_DATA_URL,
                        data: {
                            data: backupData,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: process.env.MAIN_SERVER_ADMIN_TOKEN,
                        },
                    });
                }
                catch (error) {
                    Logger_1.default.error(error);
                }
            }
        }
        if (process.env.DO_PUSHES) {
            try {
                const repoController = await RepoHooks_1.default.instance(null, {
                    username: `${process.env.GIT_DB_PUSH_USERNAME}`,
                    password: `${process.env.GIT_DB_PUSH_PASSWORD}`,
                });
                repoController.push({
                    repo: constants_1.EXPORT_DIRNAME,
                    commitMessage: 'Committed from DailyDBFileGitPush at ' + new Date().toUTCString(),
                });
            }
            catch (error) {
                error.statusCode && error.statusCode != 200 && Logger_1.default.error(error);
            }
        }
    }
}
exports.default = DoBackupORANDPush;
