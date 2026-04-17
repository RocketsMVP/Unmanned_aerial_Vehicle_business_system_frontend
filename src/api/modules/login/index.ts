import { PORT1, http } from "@/api";

/**
 * @name 登录模块
 */
export const loginApi = {
  // 用户登录
  login: (params: LoginTD.ReqLoginForm) => {
    return http.post<LoginTD.ResLogin>(PORT1 + `/login`, params);
  },
  // 获取验证码
  getCaptcha: () => {
    return http.get<LoginTD.ResCaptcha>(PORT1 + `/captcha`);
  }
};
