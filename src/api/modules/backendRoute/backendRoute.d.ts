// 用户管理模块
declare namespace BackendRouteTD {
  interface BackendRouteItem {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    path: string;
    method: string;
    group: string;
  }
}
