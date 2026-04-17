// 登录模块
declare namespace LoginTD {
  interface ReqLoginForm {
    login: string;
    password: string;
    captcha_id: string;
    captcha: string;
  }
  interface ResLogin {
    access_token: string;
  }
  interface ResCaptcha {
    [key: string]: string[];
  }
}
