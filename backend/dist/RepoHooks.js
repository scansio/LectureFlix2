"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
const repohook_config_1 = __importDefault(require("./configs/repohook.config"));
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
var WriteType;
(function (WriteType) {
    WriteType[WriteType["BASE"] = 0] = "BASE";
    WriteType[WriteType["REPO_PARENT"] = 1] = "REPO_PARENT";
    WriteType[WriteType["CREDENTIAL"] = 2] = "CREDENTIAL";
})(WriteType || (WriteType = {}));
var ReadType;
(function (ReadType) {
    ReadType[ReadType["CREDENTIAL"] = 0] = "CREDENTIAL";
    ReadType[ReadType["BASE"] = 1] = "BASE";
    ReadType[ReadType["CUSTOM_BASE"] = 2] = "CUSTOM_BASE";
    ReadType[ReadType["REPO_CUSTOM_BASE"] = 3] = "REPO_CUSTOM_BASE";
})(ReadType || (ReadType = {}));
class RepoHooks {
    app;
    credential;
    req;
    res;
    next;
    commandTimeout;
    LIFT_DEPLOYMENT_KEY;
    GIT_ORIGIN;
    constructor(app, credential) {
        this.app = app;
        this.credential = credential;
        dotenv_1.default.config();
        this.LIFT_DEPLOYMENT_KEY = `${process.env.LIFT_DEPLOYMENT_KEY}`;
        this.GIT_ORIGIN = `https://${this.LIFT_DEPLOYMENT_KEY}@github.com/${process.env.GITHUB_USERNAME}`;
    }
    static async instance(app, credential) {
        const thiz = new RepoHooks(app, credential);
        await thiz.init();
        return thiz;
    }
    async init() {
        if (this.app) {
            this.app.use(async (req, res, next) => {
                this.req = req;
                this.res = res;
                this.next = next;
                const requestArguments = { ...req.params, ...req.body };
                this.commandTimeout = requestArguments.commandTimeout
                    ? parseInt(requestArguments.commandTimeout) * 1000
                    : undefined;
                const pathnames = req.path.split('/');
                const pathname = pathnames[1];
                switch (pathname) {
                    case 'credential':
                        this.checkMethod();
                        this.authenticate(requestArguments);
                        this.setCredential(requestArguments);
                        this.success();
                        break;
                    case 'sync':
                        const path = req.path;
                        const searchString = 'sync/';
                        const parts = path.split(searchString);
                        const repo = parts[1];
                        !repo && this.fail('Append repo name in the url');
                        await this.sync({ ...requestArguments, repo: `${repo}` });
                        break;
                    case 'push':
                        this.checkMethod();
                        this.authenticate(requestArguments);
                        await this.push(requestArguments);
                        break;
                    case 'run':
                        this.checkMethod();
                        this.authenticate(requestArguments);
                        await this.run(requestArguments);
                        break;
                    case 'config':
                        this.checkMethod();
                        this.authenticate(requestArguments);
                        this.config(requestArguments);
                        this.success();
                        break;
                    default:
                        this.fail('Invalid route');
                        break;
                }
            });
            this.app.use(this.terminator);
        }
        else {
            this.authenticate(this.credential || {});
        }
    }
    checkMethod(method = 'post') {
        if (this.req) {
            const reqMethod = this.req.method.toLowerCase();
            if (method !== reqMethod) {
                return this.fail('Invalid Method');
            }
            return true;
        }
    }
    setCredential({ newUsername, newPassword }) {
        this.write({
            type: WriteType.CREDENTIAL,
            value: { username: newUsername, password: newPassword },
        });
    }
    fail(message) {
        this.send(400, message);
    }
    authFail(message) {
        this.send(403, message);
    }
    send(statusCode = 400, message = '') {
        const terminatingSignal = new Error();
        terminatingSignal.statusCode = statusCode;
        terminatingSignal.message = message;
        if (this.next) {
            this.next(terminatingSignal);
        }
        else {
            if (statusCode != 200) {
                throw terminatingSignal;
            }
            else {
                return terminatingSignal;
            }
        }
    }
    success(message) {
        this.send(200, message);
    }
    async sync({ repo }) {
        const repoDir = this.getPath(repo);
        await this.exec(repoDir, `git pull ${this.getOrigin(repo)}`, 
        //"npm run build",
        'sudo systemctl restart liftMainServer');
    }
    async push({ repo, commitMessage }) {
        commitMessage = commitMessage ? `${commitMessage}` : 'Repo Hook push: ' + new Date().toUTCString();
        const repoDir = this.getPath(repo);
        await this.exec(repoDir, `git add .`, `git commit -am "${commitMessage}" `, `git push ${this.getOrigin(repo)}`);
    }
    async run({ repo, command }) {
        const repoDir = this.getPath(repo);
        await this.exec(repoDir, command);
    }
    async exec(repoDir, ...commands) {
        process.chdir(repoDir);
        try {
            const commandReturns = [];
            let lock = 0;
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                const commandTemp = `${command}`;
                commandReturns.push(new Promise((resolve, _reject) => {
                    //Execute immediately if first
                    if (lock == 0 && i == 0) {
                        const runningCommand = child_process.exec(commandTemp, (error, stdout, stderr) => {
                            let msg = '';
                            if (error) {
                                msg += error.message;
                            }
                            else {
                                msg += `${command} executed successfully: ${stdout}`;
                            }
                            lock++;
                            resolve(msg);
                        });
                        this.timeRunningCommandOut({ runningCommand, resolve, timeout: this.commandTimeout });
                    }
                    else {
                        const intervalId = setInterval(() => {
                            if (lock == i) {
                                const runningCommand = child_process.exec(commandTemp, (error, stdout, stderr) => {
                                    let msg = '';
                                    if (error) {
                                        msg += error.message;
                                    }
                                    else {
                                        msg += `${command} executed successfully: ${stdout}`;
                                    }
                                    lock++;
                                    resolve(msg);
                                });
                                this.timeRunningCommandOut({ runningCommand, resolve, timeout: this.commandTimeout });
                                clearInterval(intervalId);
                            }
                        }, 500);
                    }
                }));
            }
            const results = await Promise.all(commandReturns);
            const stdout = results.reduce((prev, current) => {
                return (prev += '\n\n' + current);
            });
            this.success(stdout);
        }
        catch (error) {
            this.fail(error.message);
        }
    }
    timeRunningCommandOut({ runningCommand, timeout = 1000 * 60, resolve, }) {
        // Set a timeout to terminate the command if it exceeds the specified timeout
        const timeoutId = setTimeout(() => {
            runningCommand.kill(); // Terminate the command
            resolve && resolve(`Command timed out after ${timeout} milliseconds`);
        }, timeout);
        runningCommand.on('exit', () => {
            clearTimeout(timeoutId); // Cancel the timeout if the command exits before timeout
        });
    }
    getParentPath(repo) {
        const d = this.getData();
        let base = d.customBase[repo];
        if (base) {
            base = path.resolve(base);
        }
        else {
            base = path.resolve(__dirname, d.base);
        }
        return base;
    }
    getPath(repo) {
        const parent = this.getParentPath(repo);
        const repoPath = path.join(parent, repo);
        return repoPath;
    }
    getOrigin(repo) {
        return `${this.GIT_ORIGIN}/${repo}`;
    }
    setBase(value) {
        this.write({ type: WriteType.BASE, value });
    }
    getData(type, name) {
        const config = repohook_config_1.default;
        let value = null;
        switch (type) {
            case ReadType.CREDENTIAL:
                value = name ? config.credential[name] : config.credential;
                break;
            case ReadType.REPO_CUSTOM_BASE:
                value = name ? config.customBase[name] : config.customBase;
                break;
            case ReadType.CUSTOM_BASE:
                value = name ? { [name]: config.customBase[name] } : config.customBase;
                break;
            case ReadType.BASE:
                value = config.base;
                break;
            default:
                value = config;
                break;
        }
        return value;
    }
    authenticate({ username, password }) {
        const credential = this.getData(ReadType.CREDENTIAL);
        if (!(username == credential.username && password == credential.password)) {
            this.authFail('Invalid credential');
        }
    }
    write({ type, value, name }) {
        const config = repohook_config_1.default;
        switch (type) {
            case WriteType.CREDENTIAL:
                value.username && (config.credential.username = value.username);
                value.password && (config.credential.password = value.password);
                break;
            case WriteType.REPO_PARENT:
                config.customBase[name] = value;
                break;
            case WriteType.BASE:
            default:
                config.base = value;
                break;
        }
        return this._write(config);
    }
    remove({ repo }) {
        const config = repohook_config_1.default;
        config.customBase[repo] && delete config.customBase[repo];
        this._write(config);
    }
    _write(obj) {
        const data = JSON.stringify(obj);
        const outPath = path.join(__dirname, 'configs', 'repohook.config.json');
        try {
            fs.writeFileSync(outPath, data);
        }
        catch (error) {
            this.fail(error.message);
        }
    }
    config({ base, repo, parentPath, removeRepo }) {
        if (base) {
            try {
                const tp = path.resolve(base);
                fs.accessSync(tp, fs.constants.W_OK);
                this.setBase(tp);
            }
            catch (error) {
                this.fail('Error resolving base: ' + error.message);
            }
        }
        removeRepo && this.remove({ repo: removeRepo });
        if (repo && parentPath) {
            try {
                const tpp = path.resolve(parentPath);
                const existRepoDir = path.join(tpp, repo);
                fs.accessSync(tpp, fs.constants.W_OK);
                fs.accessSync(existRepoDir, fs.constants.W_OK);
                this.write({
                    type: WriteType.REPO_PARENT,
                    value: parentPath,
                    name: repo,
                });
            }
            catch (error) {
                this.fail('Error resolving parentPath: ' + error.message);
            }
        }
    }
    terminator(error, req, res, next) {
        res.status(error.statusCode || 400).send(error.message || 'Service unavailable');
    }
}
exports.default = RepoHooks;
