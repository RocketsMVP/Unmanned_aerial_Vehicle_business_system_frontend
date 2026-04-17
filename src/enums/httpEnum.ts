/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 401,
  CHANGETOKEN = 402,
  INVALIDTOKEN = 403,
  NOFIND = 404,
  TIMEOUT = 30000,
  TYPE = "success"
}
/**
 * @description：请求emit配置
 */
export enum ResultEmitEnum {
  SUCCESS = "api_success_emit",
  ERROR = "api_error_emit",
  INVALIDTOKEN = "api_invalidtoken_emit",
  OVERDUE = "api_overdue_emit",
  TIMEOUT = "api_timeout_emit",
  NOFIND = "api_nofind_emit"
}
/**
 * @description：请求方法
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE"
}

/**
 * @description：常用的 contentTyp 类型
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // text
  TEXT = "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data 上传
  FORM_DATA = "multipart/form-data;charset=UTF-8"
}
