import type { AxiosRequestConfig } from "axios";

// 自定义Axios请求配置，扩展原有配置
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  needToken?: boolean;
}

// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  page?: number;
  page_size?: number;
  pageNum?: number;
  pageSize?: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

export type ReqPageParams<T> = ReqPage & Partial<T>;
