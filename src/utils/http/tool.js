/**
 * @filter
 * 处理http的set config
 */
import qs from "qs";

let toast = null;
// error toast
export const createToastError = options => {
  const msg = options.message;
  const time = options.time || 1000;
  const body = document.getElementsByTagName("body")[0];
  const create = () => {
    if (toast) return;
    toast = document.createElement("div");
    toast.className = "zyf-dt-error-toast";
    const htmlstr = `
      <i class="error-icon"></i>
      <span style="font-size: 14px;color: #f56c6c;margin-left: 8px; line-height: 16px;">${msg}</span>
    `;
    body.appendChild(toast);
    toast.innerHTML = htmlstr;
    setTimeout(() => {
      toast.style.top = "3%";
    }, 0);
  };
  const clear = () => {
    if (toast) {
      toast.style.top = "0%";
      toast.remove();
      toast = null;
    }
  };
  return new Promise((resove, reject) => {
    create();
    setTimeout(() => {
      clear();
      resove();
    }, time);
  });
};

/**
 * 请求头
 */
export const handleRequestHeader = function (config) {
  if (
    config.method === "post" &&
    config.headers["Content-Type"] &&
    config.headers["Content-Type"].indexOf("multipart/form-data") === -1 &&
    config.headers["Content-Type"].match("form")
  ) {
    config.data = qs.stringify(config.data);
  }
  let token = this.token || window.sessionStorage.getItem("Authorization") || "";
  if (config.headers && token) {
    config.headers["Authorization"] = token;
  }
  if (this.requestCallBack) {
    let request = this.requestCallBack(config);
    if (request) {
      config = request;
    }
  }
};
/**
 * 权限
 */
export const handleAuth = function (res) {
  if (location.href.indexOf("noauth") === -1 && location.href.indexOf("logoutcorp") === -1) {
    window.sessionStorage.removeItem("welfareModelShow");
    createToastError({
      message: "登录态过期，请重新登录",
      time: 1000
    }).then(() => {
      window.parent.location.replace(res.headers.loginurl);
    });
  }
};
/**
 * 网络错误处理
 */
export const handleNetworkError = function () {};
/**
 * 权限错误处理
 */
export const handleAuthError = () => {};
/**
 * 其他错误处理
 */
export const handleOtherError = function () {};

/**
 *
 */
export const handleStatusCode = async function (result) {
  let data = result.data;
  let findCode = this.statusCodeList.find(item => item.code === data.code);
  if (findCode) {
    findCode.key && this.apiEventBus.trigger(findCode.key, result, this.client);
    if (findCode.callback) {
      let fnResult = await findCode.callback(result, this.client);
      fnResult && (result = fnResult);
    }
  }
  return result;
};
