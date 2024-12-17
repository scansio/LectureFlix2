"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const common_1 = require("./common");
(async () => {
    await (0, common_1.createIndexHtmlRecursively)((0, path_1.resolve)(__dirname, '..'));
})();
