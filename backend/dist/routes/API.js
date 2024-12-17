"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const API = [];
const isDir = (dir) => {
    const stats = (0, fs_1.statSync)(dir);
    return stats.isDirectory();
};
const versionsDir = (0, path_1.resolve)(__dirname, 'versions');
for (const dir of (0, fs_1.readdirSync)(versionsDir)) {
    const dirPath = (0, path_1.resolve)(versionsDir, dir);
    const controllerRoutes = [];
    let info = null;
    const recursive = (__dirPath) => {
        for (const filename of isDir(__dirPath) ? (0, fs_1.readdirSync)(__dirPath) : []) {
            const filePath = (0, path_1.resolve)(__dirPath, filename);
            if (isDir(filePath)) {
                recursive(filePath);
            }
            else if (filename.endsWith('.js')) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const fetch = (__filePath) => require((0, path_1.resolve)(__filePath)).default;
                if (filename === 'info.js') {
                    info = fetch(filePath);
                }
                else {
                    controllerRoutes.push(fetch(filePath));
                }
            }
        }
    };
    recursive(dirPath);
    if (info) {
        API.push({ info, controllerRoutes, status: info.status });
    }
}
const APIDocPath = (0, path_1.resolve)(__dirname, '..', '..', 'cdn', 'APIDoc.json');
const APIDoc = JSON.stringify(API);
(0, promises_1.writeFile)(APIDocPath, APIDoc);
exports.default = API;
