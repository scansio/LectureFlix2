"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
//import Logger from '../../miscs/Logger'
const constants_1 = require("../../configs/constants");
const TimeSpanSubscribe_1 = __importDefault(require("../base/TimeSpanSubscribe"));
const Logger_1 = __importDefault(require("../../miscs/Logger"));
const SharedConfig_1 = __importDefault(require("../../libs/SharedConfig"));
const OptionModel_1 = __importDefault(require("../../models/OptionModel"));
class CronDefinition {
    intervalInMillis = constants_1.MINUTE;
    timeSpanSubscribe = new TimeSpanSubscribe_1.default();
    jobsPath;
    oneTimeJobsPath;
    constructor() {
        this.jobsPath = path_1.default.resolve(__dirname, '../jobs');
        this.oneTimeJobsPath = path_1.default.resolve(__dirname, '../onetimejobs');
    }
    setJobsPath(pathname) {
        this.jobsPath = path_1.default.resolve(__dirname, pathname);
        return this;
    }
    async loadJobs() {
        try {
            const dir = await (0, promises_1.opendir)(this.jobsPath);
            for await (const dirent of dir) {
                if (dirent.isFile() && dirent.name.endsWith('.js')) {
                    const cronJobFile = path_1.default.resolve(`${this.jobsPath}`, `${dirent.name}`);
                    let cronJob;
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        cronJob = require(cronJobFile).default;
                    }
                    catch (error) {
                        Logger_1.default.log('error', error);
                        //console.log(error, '\n\n')
                    }
                    if (cronJob) {
                        this.timeSpanSubscribe.addJob({
                            job: cronJob,
                            span: cronJob.span,
                            type: cronJob.type,
                        });
                    }
                }
            }
        }
        catch (error) {
            Logger_1.default.log('error', error);
            //console.log(error, '\n\n')
        }
    }
    async loadOneTimeJobs() {
        try {
            const dir = await (0, promises_1.opendir)(this.oneTimeJobsPath);
            for await (const dirent of dir) {
                if (dirent.isFile() && dirent.name.endsWith('.js')) {
                    const cronJobFile = path_1.default.resolve(`${this.oneTimeJobsPath}`, `${dirent.name}`);
                    let cronJob;
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        cronJob = require(cronJobFile).default;
                    }
                    catch (error) {
                        Logger_1.default.log('error', error);
                        //console.log(error, '\n\n')
                    }
                    if (cronJob) {
                        new cronJob().run();
                    }
                }
            }
        }
        catch (error) {
            Logger_1.default.log('error', error);
            //console.log(error, '\n\n')
        }
    }
    async start() {
        SharedConfig_1.default.set(process.env);
        const options = await OptionModel_1.default.find().exec();
        for (const option of options) {
            SharedConfig_1.default.set(option.name, option.value);
        }
        this.loadOneTimeJobs();
        this.loadJobs();
        setInterval(() => this.timeSpanSubscribe.runDueJobs(), this.intervalInMillis);
    }
}
exports.default = CronDefinition;
