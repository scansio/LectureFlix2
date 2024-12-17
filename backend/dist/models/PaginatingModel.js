"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../configs/constants");
const common_1 = require("../common");
const SharedConfig_1 = __importDefault(require("../libs/SharedConfig"));
class PaginatingModel {
    model;
    schema;
    query;
    controller;
    parsedClientQuery;
    isPublic;
    countOnly;
    sumField;
    constructor(clazz, controller) {
        this.model = clazz;
        this.schema = this.model.schema;
        this.controller = controller;
        this.isPublic = false;
        this.countOnly = false;
        this.sumField = '';
        const { q } = this.controller.req.query;
        this.parsedClientQuery = !q ? {} : this.parsedQueryOptions(q);
        this.query = this.model.find();
    }
    count(filter) {
        if (filter) {
            this.query.count(filter);
        }
        else {
            this.query.count();
        }
        return this;
    }
    countDocuments(filter, options) {
        if (filter) {
            this.query.countDocuments(filter, options);
        }
        else {
            this.query.countDocuments();
        }
        return this;
    }
    populate(docs, options) {
        if (!docs) {
            return this;
        }
        if (Array.isArray(docs)) {
            return this.model.populate(docs, options);
        }
        else if (docs && options) {
            return this.model.populate(docs, options);
        }
        else if (typeof docs === 'string') {
            this.query.populate(docs);
            return this;
        }
    }
    find(filter, projection, options) {
        if (filter) {
            this.model.find(filter, projection, options);
        }
        else {
            this.model.find();
        }
        return this;
    }
    sort(arg) {
        this.query.sort(arg);
        return this;
    }
    where(path, val) {
        if (!path)
            return;
        if (path && val) {
            this.query.where(path, val);
        }
        else {
            this.model.where(path);
        }
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    $where(argument) {
        this.query.$where(argument);
        return this;
    }
    distinct(field, filter) {
        this.query.distinct(field, filter);
        return this;
    }
    estimatedDocumentCount(options) {
        this.model.estimatedDocumentCount(options);
        return this;
    }
    exists(filter) {
        this.model.exists(filter);
        return this;
    }
    parsedQueryOptions(query) {
        if (!query) {
            return this.parsedQueryOptions(this.parsedClientQuery);
        }
        else if (typeof query == 'string') {
            return (0, common_1.decodeQuery)(query);
        }
        else {
            return (0, common_1.encodeQuery)(query);
        }
    }
    makePublic(yes) {
        this.isPublic = yes;
        return this;
    }
    setCountOnly(yes) {
        this.countOnly = yes;
        return this;
    }
    setSumField(field) {
        this.sumField = field;
        return this;
    }
    async setClientQueryOptions() {
        const DBQuery = { ...this.parsedClientQuery };
        if (!this.isPublic) {
            if (DBQuery.uid) {
                await this.controller.ownerAndAdminAccess(DBQuery.uid);
            }
            else {
                await this.controller.adminAccess();
            }
        }
        for (const pathName in DBQuery) {
            const pathValue = DBQuery[pathName];
            if (pathValue instanceof Object && !Array.isArray(pathValue)) {
                if (pathName == '$sort') {
                    this.query.sort(pathValue);
                    delete DBQuery[pathName];
                }
                else if (pathName == '$in') {
                    const $inKeys = Object.keys(pathValue);
                    for (const $inKey of $inKeys) {
                        this.query.find({ [$inKey]: { $in: pathValue[$inKey] } });
                    }
                    delete DBQuery[pathName];
                }
                else if (pathName == '$nin') {
                    const $ninKeys = Object.keys(pathValue);
                    for (const $ninKey of $ninKeys) {
                        this.query.find({ [$ninKey]: { $nin: pathValue[$ninKey] } });
                    }
                    delete DBQuery[pathName];
                }
                else if (!(pathValue.$gt || pathValue.$gte || pathValue.$lt || pathValue.$lte)) {
                    delete DBQuery[pathName];
                }
            }
            else if (pathName == 'createdAt' || pathName == 'updatedAt') {
                delete DBQuery[pathName];
                DBQuery[pathName + '.dateString'] = {
                    $regex: new RegExp(pathValue === 'today' ? (0, common_1.getDayRegex)() : (0, common_1.getDayRegex)(pathValue)),
                };
            }
            else if (pathName === 'populate') {
                if (Array.isArray(pathValue)) {
                    pathValue.forEach((path) => {
                        if (typeof path == 'string') {
                            this.query.populate(path);
                        }
                        else {
                            const sortName = Object.keys(path.options.sort)[0];
                            const sortOrder = Object.values(path.options.sort)[0];
                            this.query.populate(path.path).sort({ [`${path.path}.${sortName}`]: sortOrder });
                        }
                    });
                }
                else if (typeof pathValue === 'string') {
                    this.query.populate(pathValue);
                }
                delete DBQuery[pathName];
            }
            else {
                if (typeof pathValue === 'string' && (!Number.parseInt(pathValue) || !Number.parseFloat(pathValue))) {
                    /* if (pathValue.trim() == "") {
                      delete DBQuery[pathName];
                    } else { */
                    if (this.schema.path(pathName).instance == 'String') {
                        const or = pathValue.split('|');
                        or.forEach((val) => {
                            if (DBQuery.$or) {
                                DBQuery.$or.push({
                                    [pathName]: {
                                        $regex: new RegExp(`.*${(0, common_1.escapeRegExp)(val)}.*`, 'gi'),
                                    },
                                });
                            }
                            else {
                                DBQuery.$or = [
                                    {
                                        [pathName]: {
                                            $regex: new RegExp(`.*${(0, common_1.escapeRegExp)(val)}.*`, 'gi'),
                                        },
                                    },
                                ];
                            }
                        });
                        delete DBQuery[pathName];
                    }
                    // }
                }
            }
        }
        if (DBQuery) {
            this.query.find(DBQuery);
        }
    }
    async exec() {
        await this.setClientQueryOptions();
        if (this.sumField) {
            const results = await this.query.clone().exec();
            const sum = (0, common_1.sumField)(results, this.sumField);
            return sum;
        }
        const totalResults = await this.query.clone().count().exec();
        if (this.countOnly) {
            return totalResults;
        }
        const { page, size } = this.controller.req.query;
        const parsed_page = Number.parseInt(`${page}`);
        const parsed_size = Number.parseInt(`${size}`);
        let t_page = isNaN(parsed_page) || parsed_page < 1 ? 1 : parsed_page;
        const t_size = isNaN(parsed_size)
            ? SharedConfig_1.default.get('NORMAL_RETURNED_RESULT_SET') || constants_1.NORMAL_RETURNED_RESULT_SET
            : parsed_size > (SharedConfig_1.default.get('RESULT_SET_MAX') || constants_1.RESULT_SET_MAX)
                ? SharedConfig_1.default.get('RESULT_SET_MAX') || constants_1.RESULT_SET_MAX
                : parsed_size;
        let totalPages = Math.ceil(totalResults / t_size);
        totalPages < 1 && (totalPages = 1);
        while (t_size * t_page - t_size > totalResults && t_page > 1) {
            --t_page;
        }
        const offset = totalPages == 1 ? 0 : t_size * t_page - t_size;
        const results = await this.query.skip(offset).limit(t_size).clone().exec();
        const metadata = {
            totalPages,
            totalResults,
            resultCount: results.length,
            currentPage: t_page,
            size: t_size,
            nextUrl: `${(0, common_1.getCurrentUrlWithoutQueryParams)(this.controller.req)}?q=${this.parsedQueryOptions()}&page=${t_page + 1}&size=${t_size}`,
            previousUrl: `${(0, common_1.getCurrentUrlWithoutQueryParams)(this.controller.req)}?q=${this.parsedQueryOptions()}&page=${t_page - 1}&size=${t_size}`,
            hasNext: t_page + 1 <= totalPages,
            hasPrevious: t_page > 1,
            url: (0, common_1.getCurrentUrlWithoutQueryParams)(this.controller.req),
            query: this.parsedQueryOptions(),
            nextPage: t_page + 1,
            previousPage: t_page - 1,
        };
        const data = {
            metadata,
            results,
        };
        return data;
    }
}
exports.default = PaginatingModel;
