"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const path_1 = require("path");
const Logger_1 = __importDefault(require("../miscs/Logger"));
const common_1 = require("../common");
const promises_1 = require("fs/promises");
const constants_1 = require("../configs/constants");
class MigrationModel {
    modelDir = (0, path_1.resolve)(__dirname, '..', 'models');
    models = {};
    constructor() { }
    static async initModels() {
        const thiz = new this();
        await thiz.initModels();
        return thiz;
    }
    async initModels() {
        const modelPaths = await (0, common_1.findFilesRecursively)(this.modelDir, [], ['.js']);
        for (const modelPath of modelPaths) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const model = require(modelPath).default;
                model && model.modelName && (this.models[model.modelName] = model);
            }
            catch (error) {
                Logger_1.default.error(error);
            }
        }
    }
    getModel(name) {
        name = name.split('Model')[0];
        return this.models[name];
    }
    async backup() {
        const backupPath = (0, path_1.resolve)(__dirname, '..', '..', '..', constants_1.EXPORT_DIRNAME);
        const models = await this.getAll();
        for (const model of models) {
            const [name] = Object.keys(model);
            const modelString = JSON.stringify(model);
            await (0, promises_1.writeFile)(`${backupPath}/${name}.json`, modelString);
        }
        return models;
    }
    async getAll() {
        const models = [];
        for (const [name, model] of Object.entries(this.models)) {
            try {
                const docs = await model.find().exec();
                if (!docs)
                    continue;
                models.push({ [name]: docs });
            }
            catch (error) {
                Logger_1.default.error(error);
            }
        }
        return models;
    }
    async create(modelDocs, updatingOption) {
        const updating = !!updatingOption;
        let msg = '';
        for (const modelDoc of modelDocs) {
            const [name, docs] = Object.entries(modelDoc)[0];
            const model = this.getModel(name);
            for (const doc of docs) {
                try {
                    if (updating) {
                        await model?.findOneAndUpdate({ _id: doc?._id }, doc, updatingOption || {});
                    }
                    else {
                        await model?.create(doc);
                    }
                }
                catch (error) {
                    //Logger.error(error)
                    msg += `${error?.message}\n\n`;
                }
            }
            msg += `Docs ${updating ? 'update in' : 'add to'} ${name}\n`;
        }
        return msg;
    }
    async update(modelDocs, updatingOption) {
        return await this.create(modelDocs, updatingOption || {});
    }
    async delete(models) {
        if (!models || models.length < 1) {
            for (const model of Object.values(this.models)) {
                await model.deleteMany().exec();
            }
        }
        else {
            for (const modelName of models) {
                await this.getModel(modelName).deleteMany().exec();
            }
        }
    }
}
exports.default = MigrationModel;
