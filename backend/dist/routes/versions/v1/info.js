"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const APIVersionStatus_1 = require("../../APIVersionStatus");
const constants_1 = require("../../../configs/constants");
const info = {
    title: 'LectureFlix API Endpoints',
    description: 'A combo of Netflix and YouTube',
    version: 'v1',
    servers: ['/main'],
    status: APIVersionStatus_1.APIVersionStatus.ENABLED,
    miscModel: {
        AuthenticationLevel: constants_1.AuthenticationLevel,
    },
};
exports.default = info;
