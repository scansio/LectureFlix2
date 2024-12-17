"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const constants_1 = require("../configs/constants");
class GlobalConfig {
    MEMORY_STORAGE = 0;
    LOCAL_STORAGE = 1;
    SESSION_STORAGE = 2;
    DESTROY_ALL = 0xa2;
    static _instance;
    dynamicConfig = {};
    constructor() { }
    switchSet(k, v, where) {
        switch (where) {
            case this.MEMORY_STORAGE:
                this.dynamicConfig[k] = v;
                break;
            /*
            case this.LOCAL_STORAGE:
              if (v instanceof Object) {
                v = JSON.stringify(v);
              }
              let thisUserId = this.getSessionData(UID);
              if (!thisUserId) {
                throw new Error(`Authentication error`);
              }
              localStorage.setItem(`${thisUserId}_${k}`, btoa(v));
              break;
      
            case this.SESSION_STORAGE:
              if (v instanceof Object) {
                v = JSON.stringify(v);
              }
              sessionStorage.setItem(k, btoa(v));
              break;
       */
            default:
                this.dynamicConfig[k] = v;
                break;
        }
    }
    __set(key, value, where) {
        if (key instanceof Object) {
            let configKey;
            let configObj;
            if (Array.isArray(key) && Array.isArray(value)) {
                configKey = key;
                configObj = value;
            }
            else {
                configKey = Object.keys(key);
                configObj = Object.values(key);
            }
            for (let i = 0; i < configKey.length; i++) {
                const k = configKey[i];
                const v = configObj[i];
                if (k) {
                    this.switchSet(k, v, where);
                }
            }
        }
        else {
            if (key) {
                this.switchSet(key, value, where);
            }
        }
    }
    __remove(k, where) {
        let v;
        switch (where) {
            case this.MEMORY_STORAGE:
                v = this.__get(k, this.MEMORY_STORAGE);
                if (v)
                    delete this.dynamicConfig[k];
                break;
            case this.LOCAL_STORAGE:
                {
                    const vlt = this.__get(k, this.LOCAL_STORAGE);
                    if (vlt) {
                        const thisUserId = this.getSessionData(constants_1.UID);
                        /* if (!thisUserId) {
                        throw new Error(`Authentication error`);
                      } */
                        const ktemp = `${thisUserId}_${k}`;
                        localStorage.removeItem(ktemp);
                    }
                    v = vlt;
                }
                break;
            case this.SESSION_STORAGE:
                {
                    const vst = this.__get(k, this.SESSION_STORAGE);
                    if (vst)
                        sessionStorage.removeItem(k);
                    v = vst;
                }
                break;
            default:
                v = null;
                break;
        }
        return v;
    }
    __destroy(where) {
        switch (where) {
            case this.MEMORY_STORAGE:
                this.dynamicConfig = {};
                break;
            case this.LOCAL_STORAGE:
                localStorage.clear();
                break;
            case this.SESSION_STORAGE:
                sessionStorage.clear();
                break;
            case this.DESTROY_ALL:
                this.dynamicConfig = {};
                localStorage.clear();
                sessionStorage.clear();
                break;
            default:
                break;
        }
    }
    __removeFrom(fromKey, valueToRemove = null, where) {
        const exist = this.__get(fromKey, where);
        if (!exist)
            return false;
        if (exist instanceof Array) {
            let deleted;
            if (!valueToRemove) {
                deleted = exist.pop();
            }
            else {
                deleted = exist[exist.indexOf(valueToRemove)];
                delete exist[exist.indexOf(valueToRemove)];
            }
            this.__set(fromKey, exist, where);
            return deleted;
        }
        return false;
    }
    __has(key, where) {
        const exist = this.__get(key, where);
        return exist ? true : false;
    }
    __get(k, where) {
        let v;
        switch (where) {
            case this.MEMORY_STORAGE:
                v = this.dynamicConfig[k] || null;
                break;
            /*
            case this.LOCAL_STORAGE:
              let thisUserId = this.getSessionData(UID);
              if (!thisUserId) {
                throw new Error(`Authentication error`);
              }
              let vlt = localStorage.getItem(`${thisUserId}_${k}`);
              vlt = vlt && atob(vlt);
              try {
                let jlt = JSON.parse(v as any);
                vlt = jlt ?? vlt;
              } catch (error) {}
              v = vlt;
              break;
      
            case this.SESSION_STORAGE:
              let vst = sessionStorage.getItem(k);
              vst = vst && atob(vst);
              try {
                let jst = JSON.parse(v as any);
                vst = jst ?? vst;
              } catch (error) {}
              v = vst;
              break; */
            default:
                v = null;
                break;
        }
        return v;
    }
    static getInstance() {
        if (!GlobalConfig._instance) {
            GlobalConfig._instance = new GlobalConfig();
        }
        return GlobalConfig._instance;
    }
    get(key) {
        return this.__get(key, this.MEMORY_STORAGE);
    }
    set(key, value) {
        this.__set(key, value, this.MEMORY_STORAGE);
    }
    addTo(parentKey, valueToAdd) {
        if (!Object.hasOwnProperty.call(this.dynamicConfig, parentKey)) {
            this.dynamicConfig[parentKey] = [];
        }
        if (this.dynamicConfig[parentKey] instanceof Array) {
            this.dynamicConfig[parentKey].push(valueToAdd);
            return true;
        }
        return false;
    }
    addToFlashData(parentKey, valueToAdd) {
        return this.addToLocalData(parentKey, valueToAdd);
    }
    addToLocalData(parentKey, valueToAdd) {
        let exist = this.__get(parentKey, this.LOCAL_STORAGE);
        if (!exist)
            exist = [];
        if (exist instanceof Array) {
            exist.push(valueToAdd);
            this.__set(parentKey, exist, this.LOCAL_STORAGE);
            return true;
        }
        return false;
    }
    addToSessionData(parentKey, valueToAdd) {
        let exist = this.__get(parentKey, this.SESSION_STORAGE);
        if (!exist)
            exist = [];
        if (exist instanceof Array) {
            exist.push(valueToAdd);
            this.__set(parentKey, exist, this.SESSION_STORAGE);
            return true;
        }
        return false;
    }
    removeFrom(parentKey, valueToRemove = null) {
        return this.__removeFrom(parentKey, valueToRemove, this.MEMORY_STORAGE);
    }
    removeFromFlashData(parentKey, valueToRemove = null) {
        return this.removeFromLocalData(parentKey, valueToRemove);
    }
    removeFromLocalData(parentKey, valueToRemove = null) {
        return this.__removeFrom(parentKey, valueToRemove, this.LOCAL_STORAGE);
    }
    removeFromSessionData(parentKey, valueToRemove = null) {
        return this.__removeFrom(parentKey, valueToRemove, this.SESSION_STORAGE);
    }
    getFlashData(key) {
        return this.__remove(key, this.LOCAL_STORAGE);
    }
    setFlashData(key, value) {
        this.setLocalData(key, value);
    }
    getLocalData(key) {
        return this.__get(key, this.LOCAL_STORAGE);
    }
    setLocalData(key, value) {
        this.__set(key, value, this.LOCAL_STORAGE);
    }
    getSessionData(key) {
        return this.__get(key, this.SESSION_STORAGE);
    }
    setSessionData(key, value) {
        this.__set(key, value, this.SESSION_STORAGE);
    }
    has(key) {
        return this.__has(key, this.MEMORY_STORAGE);
    }
    isFlashData(key) {
        return this.isLocalData(key);
    }
    isLocalData(key) {
        return this.__has(key, this.LOCAL_STORAGE);
    }
    isSessionData(key) {
        return this.__has(key, this.SESSION_STORAGE);
    }
    remove(key) {
        return this.__remove(key, this.MEMORY_STORAGE);
    }
    removeSessionData(key) {
        return this.__remove(key, this.SESSION_STORAGE);
    }
    removeLocalData(key) {
        return this.__remove(key, this.LOCAL_STORAGE);
    }
    removeFlashData(key) {
        return this.removeLocalData(key);
    }
    destroy() {
        this.__destroy(this.MEMORY_STORAGE);
    }
    destroyLocalData() {
        this.__destroy(this.LOCAL_STORAGE);
    }
    destroySessionData() {
        this.__destroy(this.SESSION_STORAGE);
    }
    destroyAll() {
        this.__destroy(this.DESTROY_ALL);
    }
    increment(key, returnValue = true, throwIfNotfound = false) {
        if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
            if (typeof this.dynamicConfig[key] === 'number') {
                ++this.dynamicConfig[key];
                if (returnValue) {
                    return this.dynamicConfig[key];
                }
            }
            else {
                throw new Error("Specified key is not a number can't increment");
            }
        }
        else {
            if (throwIfNotfound)
                throw new Error('Key not found');
            if (returnValue)
                return (this.dynamicConfig[key] = 1);
        }
    }
    decrement(key, returnValue = true, throwIfNotfound = false) {
        if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
            if (typeof this.dynamicConfig[key] === 'number') {
                --this.dynamicConfig[key];
                if (returnValue) {
                    return this.dynamicConfig[key];
                }
            }
            else {
                throw new Error("Specified key is not a number can't decrement");
            }
        }
        else {
            if (throwIfNotfound)
                throw new Error('Key not found');
            //if (returnValue) return (this.dynamicConfig[key] = 0);
        }
    }
}
const SharedConfig = GlobalConfig.getInstance();
exports.default = SharedConfig;
