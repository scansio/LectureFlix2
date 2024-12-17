/* eslint-disable @typescript-eslint/no-explicit-any */
import { UID } from '../configs/constants'

class GlobalConfig {
  private readonly MEMORY_STORAGE = 0
  private readonly LOCAL_STORAGE = 1
  private readonly SESSION_STORAGE = 2
  private readonly DESTROY_ALL = 0xa2

  private static _instance: GlobalConfig
  private dynamicConfig: { [key: string]: any } = {}

  private constructor() {}

  private switchSet(k: string, v: any, where: number) {
    switch (where) {
      case this.MEMORY_STORAGE:
        this.dynamicConfig[k] = v
        break
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
        this.dynamicConfig[k] = v
        break
    }
  }

  private __set(key: string | object | any[], value: any, where: number) {
    if (key instanceof Object) {
      let configKey
      let configObj
      if (Array.isArray(key) && Array.isArray(value)) {
        configKey = key
        configObj = value
      } else {
        configKey = Object.keys(key)
        configObj = Object.values(key)
      }
      for (let i = 0; i < configKey.length; i++) {
        const k = configKey[i]
        const v = configObj[i]
        if (k) {
          this.switchSet(k, v, where)
        }
      }
    } else {
      if (key) {
        this.switchSet(key as any, value, where)
      }
    }
  }

  private __remove(k: string, where: number) {
    let v
    switch (where) {
      case this.MEMORY_STORAGE:
        v = this.__get(k, this.MEMORY_STORAGE)
        if (v) delete this.dynamicConfig[k]
        break

      case this.LOCAL_STORAGE:
        {
          const vlt = this.__get(k, this.LOCAL_STORAGE)
          if (vlt) {
            const thisUserId = this.getSessionData(UID)
            /* if (!thisUserId) {
            throw new Error(`Authentication error`);
          } */
            const ktemp = `${thisUserId}_${k}`
            localStorage.removeItem(ktemp)
          }
          v = vlt
        }
        break

      case this.SESSION_STORAGE:
        {
          const vst = this.__get(k, this.SESSION_STORAGE)
          if (vst) sessionStorage.removeItem(k)
          v = vst
        }
        break

      default:
        v = null
        break
    }
    return v
  }

  private __destroy(where: number) {
    switch (where) {
      case this.MEMORY_STORAGE:
        this.dynamicConfig = {}
        break

      case this.LOCAL_STORAGE:
        localStorage.clear()
        break

      case this.SESSION_STORAGE:
        sessionStorage.clear()
        break

      case this.DESTROY_ALL:
        this.dynamicConfig = {}
        localStorage.clear()
        sessionStorage.clear()
        break

      default:
        break
    }
  }

  private __removeFrom(fromKey: string, valueToRemove = null, where: number) {
    const exist = this.__get(fromKey, where)
    if (!exist) return false
    if (exist instanceof Array) {
      let deleted
      if (!valueToRemove) {
        deleted = exist.pop()
      } else {
        deleted = exist[exist.indexOf(valueToRemove)]
        delete exist[exist.indexOf(valueToRemove)]
      }
      this.__set(fromKey, exist, where)
      return deleted
    }
    return false
  }

  private __has(key: string, where: number) {
    const exist = this.__get(key, where)
    return exist ? true : false
  }

  private __get(k: string, where: number) {
    let v
    switch (where) {
      case this.MEMORY_STORAGE:
        v = this.dynamicConfig[k] || null
        break
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
        v = null
        break
    }
    return v
  }

  static getInstance(): GlobalConfig {
    if (!GlobalConfig._instance) {
      GlobalConfig._instance = new GlobalConfig()
    }
    return GlobalConfig._instance
  }

  get(key: string) {
    return this.__get(key, this.MEMORY_STORAGE)
  }

  set(key: string | object | any[], value?: any) {
    this.__set(key, value, this.MEMORY_STORAGE)
  }

  addTo(parentKey: string, valueToAdd: any) {
    if (!Object.hasOwnProperty.call(this.dynamicConfig, parentKey)) {
      this.dynamicConfig[parentKey] = []
    }
    if (this.dynamicConfig[parentKey] instanceof Array) {
      this.dynamicConfig[parentKey].push(valueToAdd)
      return true
    }
    return false
  }

  addToFlashData(parentKey: string, valueToAdd: any) {
    return this.addToLocalData(parentKey, valueToAdd)
  }

  addToLocalData(parentKey: string, valueToAdd: any) {
    let exist = this.__get(parentKey, this.LOCAL_STORAGE)
    if (!exist) exist = []
    if (exist instanceof Array) {
      exist.push(valueToAdd)
      this.__set(parentKey, exist, this.LOCAL_STORAGE)
      return true
    }
    return false
  }

  addToSessionData(parentKey: string, valueToAdd: any) {
    let exist = this.__get(parentKey, this.SESSION_STORAGE)
    if (!exist) exist = []
    if (exist instanceof Array) {
      exist.push(valueToAdd)
      this.__set(parentKey, exist, this.SESSION_STORAGE)
      return true
    }
    return false
  }

  removeFrom(parentKey: string, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.MEMORY_STORAGE)
  }

  removeFromFlashData(parentKey: string, valueToRemove = null) {
    return this.removeFromLocalData(parentKey, valueToRemove)
  }

  removeFromLocalData(parentKey: string, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.LOCAL_STORAGE)
  }

  removeFromSessionData(parentKey: string, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.SESSION_STORAGE)
  }

  getFlashData(key: string) {
    return this.__remove(key, this.LOCAL_STORAGE)
  }

  setFlashData(key: string, value: any) {
    this.setLocalData(key, value)
  }

  getLocalData(key: string) {
    return this.__get(key, this.LOCAL_STORAGE)
  }

  setLocalData(key: string, value: any) {
    this.__set(key, value, this.LOCAL_STORAGE)
  }

  getSessionData(key: string) {
    return this.__get(key, this.SESSION_STORAGE)
  }

  setSessionData(key: string, value: any) {
    this.__set(key, value, this.SESSION_STORAGE)
  }

  has(key: string) {
    return this.__has(key, this.MEMORY_STORAGE)
  }

  isFlashData(key: string) {
    return this.isLocalData(key)
  }

  isLocalData(key: string) {
    return this.__has(key, this.LOCAL_STORAGE)
  }

  isSessionData(key: string) {
    return this.__has(key, this.SESSION_STORAGE)
  }

  remove(key: string) {
    return this.__remove(key, this.MEMORY_STORAGE)
  }

  removeSessionData(key: string) {
    return this.__remove(key, this.SESSION_STORAGE)
  }

  removeLocalData(key: string) {
    return this.__remove(key, this.LOCAL_STORAGE)
  }

  removeFlashData(key: string) {
    return this.removeLocalData(key)
  }

  destroy() {
    this.__destroy(this.MEMORY_STORAGE)
  }

  destroyLocalData() {
    this.__destroy(this.LOCAL_STORAGE)
  }

  destroySessionData() {
    this.__destroy(this.SESSION_STORAGE)
  }

  destroyAll() {
    this.__destroy(this.DESTROY_ALL)
  }

  increment(key: string, returnValue = true, throwIfNotfound = false) {
    if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
      if (typeof this.dynamicConfig[key] === 'number') {
        ++this.dynamicConfig[key]
        if (returnValue) {
          return this.dynamicConfig[key]
        }
      } else {
        throw new Error("Specified key is not a number can't increment")
      }
    } else {
      if (throwIfNotfound) throw new Error('Key not found')
      if (returnValue) return (this.dynamicConfig[key] = 1)
    }
  }

  decrement(key: string, returnValue = true, throwIfNotfound = false) {
    if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
      if (typeof this.dynamicConfig[key] === 'number') {
        --this.dynamicConfig[key]
        if (returnValue) {
          return this.dynamicConfig[key]
        }
      } else {
        throw new Error("Specified key is not a number can't decrement")
      }
    } else {
      if (throwIfNotfound) throw new Error('Key not found')
      //if (returnValue) return (this.dynamicConfig[key] = 0);
    }
  }
}

const SharedConfig = GlobalConfig.getInstance()
export default SharedConfig
