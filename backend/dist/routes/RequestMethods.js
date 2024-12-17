"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMethodsMap = exports.RequestMethods = void 0;
var RequestMethods;
(function (RequestMethods) {
    RequestMethods["GET"] = "get";
    RequestMethods["POST"] = "post";
    RequestMethods["PATCH"] = "patch";
    RequestMethods["DELETE"] = "delete";
})(RequestMethods || (exports.RequestMethods = RequestMethods = {}));
exports.RequestMethodsMap = {
    fetch: 'get',
    get: 'get',
    create: 'create',
    post: 'create',
    patch: 'update',
    update: 'update',
    remove: 'delete',
    delete: 'delete',
};
