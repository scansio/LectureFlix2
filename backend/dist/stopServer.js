"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverTerminatorEvent_1 = require("./server/serverTerminatorEvent");
(() => {
    const argv = process.argv;
    const serverNameArg = argv.find((arg) => arg.startsWith('--server='));
    const serverName = serverNameArg?.split('=')[1];
    (0, serverTerminatorEvent_1.serverTerminatorEvent)(serverName);
})();
