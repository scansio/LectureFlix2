"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./base/BaseController"));
const statusCodeConstants_1 = require("../configs/statusCodeConstants");
const multer_1 = __importDefault(require("multer"));
const MigrationModel_1 = __importDefault(require("../models/MigrationModel"));
class Migration extends BaseController_1.default {
    positions = [];
    MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
    ALLOWED_FILE_TYPES = ['application/json'];
    migrationModel;
    upload = (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(), // Can still store in memory if desired
        limits: {
            fileSize: this.MAX_FILE_SIZE,
        },
        fileFilter: (req, file, cb) => {
            if (this.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
                cb(null, true); // Accept the file
            }
            else {
                cb(new Error('Invalid file type. Only JSON files are allowed.'));
            }
        },
    });
    constructor(req, res, next) {
        super(req, res, next);
        this.__readModelsFiles = this.__readModelsFiles.bind(this);
        this.___readModelsFiles = this.___readModelsFiles.bind(this);
    }
    __readModelsFiles(resolve, reject) {
        this.upload.array('docs')(this.req, this.res, this.___readModelsFiles(resolve, reject));
    }
    ___readModelsFiles(resolve, reject) {
        return (error) => {
            if (error) {
                return reject(error);
            }
            const files = this.req.files;
            if (!files || files.length === 0) {
                return reject(new Error('No files uploaded'));
            }
            const docs = [];
            files.forEach((file) => {
                const fileContent = file.buffer.toString();
                if (fileContent) {
                    let json;
                    try {
                        json = JSON.parse(fileContent);
                    }
                    catch (e) {
                        /* empty */
                    }
                    if (json) {
                        docs.push(json);
                    }
                }
            });
            return resolve(docs);
        };
    }
    async readModelsFiles() {
        return await new Promise(this.__readModelsFiles);
    }
    async init() {
        this.migrationModel = await MigrationModel_1.default.initModels();
        return true;
    }
    async names() {
        this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(Object.keys(this.migrationModel.models)).send();
    }
    async get({ modelName }) {
        const model = await this.migrationModel.getModel(modelName)?.find().exec();
        if (!model)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Model not found').send();
        else
            this.status(true)
                .statusCode(statusCodeConstants_1.GET_SUCCESS)
                .setData({ [modelName]: model })
                .send();
    }
    async all() {
        const models = await this.migrationModel.getAll();
        if (!models || models.length < 1)
            this.status(false).statusCode(statusCodeConstants_1.NOTFOUND).message('Models not found').send();
        else
            this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(models).send();
    }
    async backup() {
        const backupData = await this.migrationModel.backup();
        this.status(true).statusCode(statusCodeConstants_1.GET_SUCCESS).setData(backupData).send();
    }
    async create({ updatingOption, ...data }) {
        let modelDocs = [];
        if (data && Array.isArray(data)) {
            modelDocs = data;
        }
        else {
            try {
                modelDocs = await this.readModelsFiles();
            }
            catch (error) {
                this.status(false)
                    .statusCode(statusCodeConstants_1.BAD_REQUEST)
                    .message(error.message)
                    .send();
            }
        }
        if (!modelDocs || modelDocs.length < 1) {
            this.status(false).statusCode(statusCodeConstants_1.BAD_REQUEST).message('No file content').send();
        }
        const msg = await this.migrationModel.create(modelDocs, updatingOption);
        this.status(true)
            .statusCode(statusCodeConstants_1.POST_SUCCESS)
            .message(msg || `No Model is ${updatingOption ? 'updated' : 'created'}`)
            .send();
    }
    async update(updatingOption) {
        return await this.create({ updatingOption: updatingOption || {} });
    }
    async delete({ all, models }) {
        if (all) {
            this.migrationModel.delete();
        }
        else if (!models) {
            this.status(false)
                .statusCode(statusCodeConstants_1.BAD_REQUEST)
                .message('Provide a list of model names to delete or specify all to true')
                .send();
        }
        else {
            this.migrationModel.delete(models);
        }
        this.status(true).statusCode(statusCodeConstants_1.POST_SUCCESS).message('Models deleted').send();
    }
}
exports.default = Migration;
