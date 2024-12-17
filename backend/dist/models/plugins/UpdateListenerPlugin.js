"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateListenerPlugin = (scm, handler) => {
    scm.post(/update*/, async (docs, next) => {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        processHook(docs);
        next();
    });
    scm.post(/save/, async (docs, next) => {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        processHook(docs);
        next();
    });
    scm.post(/find*AndUpdate/, async (docs, next) => {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }
        processHook(docs);
        next();
    });
    async function processHook(docs) {
        if (!docs) {
            return;
        }
        for (const doc of docs) {
            handler(doc);
        }
    }
};
exports.default = UpdateListenerPlugin;
