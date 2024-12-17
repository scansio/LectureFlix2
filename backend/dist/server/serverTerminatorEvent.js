"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverTerminatorEvent = exports.startServerTerminatorListener = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const IPC = path_1.default.resolve(__dirname, 'server-terminator-ipc');
const startServerTerminatorListener = (server, cb) => {
    fs_1.default.watchFile(IPC, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
            fs_1.default.readFile(IPC, 'utf8', (err, serverName) => {
                if (err) {
                    console.log('Error reading IPC: ' + IPC, err);
                }
                else {
                    serverName = `${serverName}`.trim();
                    if (serverName && (serverName === server || serverName === 'All')) {
                        cb();
                    }
                }
            });
        }
    });
};
exports.startServerTerminatorListener = startServerTerminatorListener;
const serverTerminatorEvent = (server) => fs_1.default.writeFileSync(IPC, `${server || 'All'}`);
exports.serverTerminatorEvent = serverTerminatorEvent;
