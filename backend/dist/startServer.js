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
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path_1 = require("path");
(async () => {
    const argv = process.argv;
    const serverNameArg = argv.find((arg) => arg.startsWith('--server='));
    const serverName = serverNameArg?.split('=')[1];
    const servers = [
        { name: 'MainServer', module: (0, path_1.resolve)(__dirname, './server/MainServer') },
        {
            name: 'SchedulingServer',
            module: (0, path_1.resolve)(__dirname, './server/SchedulingServer'),
        },
        {
            name: 'RepoHookServer',
            module: (0, path_1.resolve)(__dirname, './server/RepoHookServer'),
        },
        { name: 'CdnServer', module: (0, path_1.resolve)(__dirname, './server/CdnServer') },
        {
            name: 'SocketServer',
            module: (0, path_1.resolve)(__dirname, './server/SocketServer'),
        },
    ];
    const forkServer = (serverConfig) => {
        // Open files for stdout and stderr logging
        const out = fs.openSync(`./${serverConfig.name}-out.log`, 'a');
        const err = fs.openSync(`./${serverConfig.name}-err.log`, 'a');
        // Spawn the child process
        const child = (0, child_process_1.spawn)('node', [serverConfig.module], {
            detached: true, // Ensure the child process runs independently of its parent
            stdio: ['ignore', out, err], // Ignore stdin, and direct stdout and stderr to the log files
        });
        // Allow the parent to exit while the child continues running
        //child.unref();
    };
    const found = serverName && servers.find((serverConfig) => serverName === serverConfig.name);
    if (found) {
        forkServer(found);
    }
    else {
        for (const serverConfig of servers) {
            forkServer(serverConfig);
        }
    }
})();
