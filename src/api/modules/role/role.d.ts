// 用户管理模块
declare namespace RoleTD {
  interface RoleBaseInfo {
    id?: number;
    name: string;
    code: string;
    description: string;
  }
  interface RoleItem extends MakeRequired<RoleBaseInfo, "id"> {
    created_at: string;
    updated_at: string;
    menuList: number[];
  }
  interface PermissionParams {
    code: RoleItem["code"];
    checked:
      | MenuTD.MenuItem["code"][]
      | { path: BackendRouteTD.BackendRouteItem["path"]; act: BackendRouteTD.BackendRouteItem["method"] }[];
  }
}
