import { PORT9, http } from "@/api";
import { ReqPageParams } from "@/api/interface";
/**
 * @name 后端路由模块
 */
export const backendRouteApi = {
  // 获取后端路由列表
  getBackendRouteList: (params: ReqPageParams<BackendRouteTD.BackendRouteItem>) => {
    return http.get<BackendRouteTD.BackendRouteItem[]>(PORT9 + `/list`, params);
  }
};
