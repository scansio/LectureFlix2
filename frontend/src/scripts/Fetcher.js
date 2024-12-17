/* eslint-disable require-jsdoc */
import md5, { rand } from "./md5";
import { API_VERSION, BASE } from "./config/RestEndpoints";
import axios from "axios";
import { SharedConfig, useContext } from "reblendjs";
import { authTokenContext, netErrContext } from "../context";
import { redirectTo } from "reblend-router";
import { toast } from "react-toastify";
import { TO_VISIT_URL_KEY } from "./config/contants";

class Fetcher {
  static RETURN_JSON_OBJECT = 2;
  static RETURN_RESPONSE_OBJECT = 1;
  static RETURN_BLOB = 3;
  auth = "";

  constructor(url = "", addVersion = true) {
    this.base_url = url || (addVersion ? `${BASE}/${API_VERSION}` : `${BASE}`);
    this.listeners = {};
    this.frequency = 30000;
    this.FAIL_SAFE_THRESHOLD = 500;
    const [auth] = useContext.bind(this)(authTokenContext, "auth");
    this.auth = auth;
  }

  addListenerForUrl(
    fetchOptions,
    listener,
    frequency = this.frequency,
    returnType = Fetcher.RETURN_JSON_OBJECT,
    failstop = this.FAIL_SAFE_THRESHOLD
  ) {
    if (!fetchOptions) throw new Error("Invalid fetch options provided");
    if (!listener) throw new Error("Invalid listener provided");
    if (!returnType) throw new Error("Invalid returnType provided");
    if (!frequency) throw new Error("Invalid frequency provided");
    if (!failstop) throw new Error("Invalid failstop provided");
    const id = this.getId();
    const intervalId = setInterval(async () => {
      const intervalOwner = this.listeners[id];
      const hasReachThreshHold =
        intervalOwner.fail - intervalOwner.success >= failstop;
      try {
        const data = await this.fetch(fetchOptions, returnType);
        if (data) {
          ++intervalOwner.success;
          listener(data);
        } else {
          if (hasReachThreshHold) {
            this.removeListener(id);
          } else {
            ++intervalOwner.fail;
          }
        }
      } catch (e) {
        if (hasReachThreshHold) {
          this.removeListener(id);
        } else {
          ++intervalOwner.fail;
        }
      }
    }, frequency);
    this.listeners[id] = {
      fetchOptions,
      listener,
      intervalId,
      fail: 0,
      success: 0,
    };
    return id;
  }

  removeListener(id) {
    if (!id || id === "") throw Error("Id required to remove listener");
    if (Object.hasOwnProperty.call(this.listeners, id)) {
      this.clear(this.listeners[id].intervalId);
      delete this.listeners[id];
    }
  }

  async release() {
    return new Promise((resolve) => {
      let listenersArr = Object.values(this.listeners);
      listenersArr.forEach((listener) => {
        this.clear(listener.intervalId);
      });
      this.listeners = null;
      listenersArr = null;
      resolve(true);
    });
  }

  async fetch(options, returnType = Fetcher.RETURN_JSON_OBJECT) {
    let url;
    const defaultOptions = {
      method: "POST",
    };
    if (typeof options === "string") {
      url = options;
      defaultOptions.method = "GET";
      options = defaultOptions;
    } else {
      url = options.url;
      if (url) {
        delete options.url;
      } else {
        throw new Error("URL not found in options");
      }
      options = { ...defaultOptions, ...options };
    }
    options.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": " no-cache",
      ...options.headers,
    };
    this.auth && (options.headers.Authorization = this.auth);
    if (!`${url}`.startsWith("http")) {
      url = `${this.base_url}${url}`;
    }
    options = { url, ...options };
    returnType === Fetcher.RETURN_BLOB &&
      (options = { ...options, responseType: "blob" });
    let res;
    try {
      res = await axios(options);
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        netErrContext.update(true);
      }
      if (!error?.response?.data) {
        throw new Error(error.message);
      }
      res = error.response;
    }
    const data = res?.data;
    if (data?.connection?.statusCode === 401) {
      SharedConfig.setFlashData(TO_VISIT_URL_KEY, window.location.pathname);
      toast.error("Please login");
      redirectTo("/login");
    }
    return returnType === Fetcher.RETURN_RESPONSE_OBJECT || !data ? res : data;
  }

  clear(intervalId) {
    clearInterval(intervalId);
  }

  getId() {
    let id = md5(`${rand()}`);
    while (Object.hasOwnProperty.call(this.listeners, id)) {
      id = md5(rand());
    }
    return id;
  }
}

export default Fetcher;
