import axios from "axios";
import CryptoJS from "crypto-js";
import setStyle from "./style";
import { handleRequestHeader, handleStatusCode, createToastError } from "./tool";
import EventBus from "./bus";
import qs from "qs";

setStyle();
const CancelToken = axios.CancelToken;
const decrypt = (word, key) => {
  let keys = CryptoJS.enc.Utf8.parse(key);
  let decrypt = CryptoJS.AES.decrypt(word, keys, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

const xfs_header_session = sessionStorage.getItem("xfs_header_session") || "";
/**
 * @class
 * http类，保证各模块网络请求相互之间不影响
 * @param {String} @params.baseURL
 * @param {Number} @params.timeout
 *
 */

class HTTP {
  constructor(params) {
    console.log("初始化API");
    // axios实例
    this.client = null;

    this._cancel = [];
    // 基础路径
    this.baseURL = params?.baseURL || null;
    // 超时时间
    this.timeout = params?.timeout || 1000 * 60;
    // 请求头
    this.headers = params?.headers || null;
    // 请求拦截器回调函数
    this.requestCallBack = params?.requestCallBack || null;
    // 响应拦截器中包含失败和成功的回调函数
    this.responseCallBack = params?.responseCallBack || null;
    // 使用默认加密方式的加密key
    this.decryptKey = params?.decryptKey || null;
    // 使用自定义加密方式的回调函数
    this.decryptCallback = params?.decryptCallback || null;
    // 服务器返回的成功状态码
    this.successCode = params?.successCode || 200;
    // 服务器返回的状态码控制
    this.statusCodeList = params?.statusList || [];
    // 最多重试几次
    this.maxCount = params?.maxCount || 0;
    // 创建http实例的事件总线
    this.apiEventBus = EventBus.create(`zyfApiEventBus_${Date.now()}`);
    this.create();
  }
  /**
   * 创建axios实例
   */
  create(setting = {}) {
    if (Object.prototype.toString.call(setting) !== "[object Object]") {
      setting = {};
    }
    this.client = axios.create();
    if (this.baseURL) {
      this.client.defaults.baseURL = this.baseURL;
    }
    if (this.timeout) {
      this.client.defaults.timeout = this.timeout;
    }
    if (setting.requestCallBack && !this.requestCallBack) {
      this.requestCallBack = setting.requestCallBack;
    }
    if (setting.responseCallBack && !this.responseCallBack) {
      this.responseCallBack = setting.responseCallBack;
    }
    // 设置 xfs_header_session
    if (xfs_header_session) {
      this.client.defaults.headers.xfs_header_session = xfs_header_session;
    }
    if (this.headers) {
      // 默认headers最多两层
      Object.keys(this.headers).forEach(key => {
        const val = this.headers[key];
        if (typeof val === "object" && val !== null) {
          Object.keys(val).forEach(minkey => {
            this.client.defaults.headers[key][minkey] = val[minkey];
          });
        } else {
          this.client.defaults.headers[key] = val;
        }
      });
    }
    this.interceptorsRequest();
    this.interceptorsResponse();
  }
  /**
   * 请求拦截器
   */
  interceptorsRequest() {
    this.client.interceptors.request.use(
      config => {
        handleRequestHeader.call(this, config);
        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
  }
  /**
   * 响应拦截器
   */
  interceptorsResponse() {
    this.client.interceptors.response.use(
      async res => {
        if (res?.status !== 200) {
          createToastError({
            message: res?.statusText ?? "请求失败"
          });
          return Promise.reject(res?.statusText ?? "请求失败");
        }

        if (this.decryptKey) {
          res.data.data = JSON.parse(decrypt(res.data.data, this.decryptKey));
        }
        if (this.decryptCallback) {
          res.data.data = this.decryptCallback(res.data.data);
        }
        res = await handleStatusCode.call(this, res);
        if (this.responseCallBack) {
          let callbackRes = this.responseCallBack(res);
          res = callbackRes ? callbackRes : res;
        }
        return res.data;
      },
      err => {
        if (err.response) {
          const { status } = err.response;
          if (status === 404) {
            createToastError({
              message: "请求地址不存在"
            });
          }
          if (status === 500) {
            createToastError({
              message: "服务器错误"
            });
          }
        }
        if (this.responseCallBack) {
          err = this.responseCallBack(err);
        }
        return Promise.reject(err);
      }
    );
  }
  /**
   *重新请求重试
   */
  retry(fn, maxCount = this.maxCount) {
    return fn().catch(err => (maxCount <= 0 ? Promise.reject(err) : this.retry(fn, maxCount - 1)));
  }
  /**
   * get请求
   * @param {string} url 请求地址
   * @param {JSON} param 请求参数
   * @param {JSON} config 自定义配置
   */
  get(url, param, config) {
    if (this.client === null) return;
    let cancelToken = {
      url,
      source: null
    };
    return this.retry(
      () =>
        new Promise((resolve, reject) => {
          this.client({
            method: "get",
            url,
            params: param,
            paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
            cancelToken: new CancelToken(source => {
              cancelToken.source = source;
              this._cancel.push(cancelToken);
            }),
            ...config
          })
            .then(res => {
              resolve(res);
              this.clearHttp(cancelToken);
            })
            .catch(err => {
              reject(err);
              this.clearHttp(cancelToken);
            });
        })
    );
  }
  /**
   * post请求
   * @param {string} url 请求地址
   * @param {JSON} param 请求参数
   * @param {JSON} config 自定义配置
   */
  post(url, param, config) {
    if (this.client === null) return;
    let cancelToken = {
      url,
      source: null
    };
    return new Promise((resolve, reject) => {
      this.client({
        method: "post",
        url,
        data: param,
        cancelToken: new CancelToken(source => {
          cancelToken.source = source;
          this._cancel.push(cancelToken);
        }),
        ...config
      })
        .then(res => {
          resolve(res);
          this.clearHttp(cancelToken);
        })
        .catch(err => {
          reject(err);
          this.clearHttp(cancelToken);
        });
    });
  }
  /**
   * put请求
   * @param {string} url 请求地址
   * @param {JSON} param 请求参数
   * @param {JSON} config 自定义配置
   */
  put(url, param, config) {
    if (this.client === null) return;
    let cancelToken = {
      url,
      source: null
    };
    return new Promise((resolve, reject) => {
      this.client({
        method: "put",
        url,
        data: param,
        cancelToken: new CancelToken(source => {
          cancelToken.source = source;
          this._cancel.push(cancelToken);
        }),
        ...config
      })
        .then(res => {
          resolve(res);
          this.clearHttp(cancelToken);
        })
        .catch(err => {
          reject(err);
          this.clearHttp(cancelToken);
        });
    });
  }
  /**
   * delete请求
   * @param {string} url 请求地址
   * @param {JSON} param 请求参数
   * @param {JSON} config 自定义配置
   */
  delete(url, param, config) {
    if (this.client === null) return;
    let cancelToken = {
      url,
      source: null
    };
    return new Promise((resolve, reject) => {
      this.client({
        method: "delete",
        url,
        data: param,
        cancelToken: new CancelToken(source => {
          cancelToken.source = source;
          this._cancel.push(cancelToken);
        }),
        ...config
      })
        .then(res => {
          resolve(res);
          this.clearHttp(cancelToken);
        })
        .catch(err => {
          reject(err);
          this.clearHttp(cancelToken);
        });
    });
  }
  /**
   * 取消请求
   * @param {object} 需要取消的请求对象
   */
  clearHttp(params) {
    if (params) {
      // 请求取消后需要移除对应的数据
      params.source(`取消对${params.url}的请求`);
      this.removeCancel(params);
    } else {
      // 全部取消
      this._cancel.forEach(item => {
        item.source(`取消对${item.url}的请求`);
      });
      this._cancel = [];
    }
  }
  /**
   * 移除this._cancel 中的数据
   */
  removeCancel(val) {
    const index = this._cancel.indexOf(val);
    this._cancel.splice(index, 1);
  }
}
export { HTTP as default, EventBus };
