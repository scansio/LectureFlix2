"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DateSchema = new mongoose_1.Schema({
    timeString: String,
    dateString: String,
    time: Number,
    date: String,
});
