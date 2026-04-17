import HTTP from "@/utils/http";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/components/Loading/fullScreen";
import { ResultEnum, ResultEmitEnum } from "@/enums/httpEnum";
import { useUserStore } from "@/stores/modules/user";
import { ElMessage } from "element-plus";
import type { AxiosResponse, AxiosInstance } from "axios";

export const http = new HTTP({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: ResultEnum.TIMEOUT,
  statusList: [
    {
      code: ResultEnum.NOFIND,
      key: ResultEmitEnum.NOFIND,
      isInterrupt: false,
      callback: (res: AxiosResponse) => {
        return res;
      }
    },
    {
      code: ResultEnum.CHANGETOKEN,
      callback: async (res: AxiosResponse, axios: AxiosInstance) => {
        if (res.headers["new-token"]) {
          const userStore = useUserStore();
          userStore.setToken(res.headers["new-token"]);
          // 重新发起请求;
          let retryData = await axios.request(res.config);
          res.data = retryData;
        }
        return res;
      }
    },
    {
      code: ResultEnum.INVALIDTOKEN,
      key: ResultEmitEnum.INVALIDTOKEN,
      isInterrupt: true
    },
    {
      code: ResultEnum.ERROR,
      key: ResultEmitEnum.ERROR,
      isInterrupt: false,
      callback: (res: AxiosResponse) => {
        if (res.data.msg) {
          ElMessage.error(res.data.msg);
        }
        return res;
      }
    }
  ],
  requestCallBack: config => {
    // 请求拦截器逻辑
    const userStore = useUserStore();
    if (config.headers && typeof config.headers.set === "function" && userStore.token) {
      config.headers.set("lroa-token", userStore.token);
    }
    config?.loading && showFullScreenLoading();
    return config;
  },
  responseCallBack: response => {
    response?.config?.loading && tryHideFullScreenLoading();
    return response;
  }
});
