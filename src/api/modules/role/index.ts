import { PORT8, http } from "@/api";
import { ReqPageParams } from "@/api/interface";

/**
 * @name 角色模块
 */
export const roleApi = {
  // 获取角色列表
  getRoleList: (params: ReqPageParams<RoleTD.RoleItem>) => {
    return http.get<RoleTD.RoleItem[]>(PORT8 + `/list`, params);
  },
  // 获取角色详情
  getRoleDetail: (id: RoleTD.RoleItem["id"]) => {
    return http.get<RoleTD.RoleItem>(PORT8 + `/${id}`, { id });
  },
  // 新增角色
  createRole: (params: RoleTD.RoleBaseInfo) => {
    return http.post(PORT8 + `/create`, params);
  },
  // 修改角色
  updateRole: (params: RoleTD.RoleBaseInfo) => {
    return http.put(PORT8 + `/update`, params);
  },
  // 删除角色
  deleteRole: (id: RoleTD.RoleItem["id"]) => {
    return http.delete(PORT8 + `/delete`, { id });
  },
  // 修改角色API权限
  updateRoleApi: (params: RoleTD.PermissionParams) => {
    return http.post(PORT8 + `/update_role_api`, params);
  },
  // 修改角色API权限
  updateMenuApi: (params: RoleTD.PermissionParams) => {
    return http.post(PORT8 + `/update_role_menu`, params);
  },
  // 获取当前权限
  getRoleChecked: (code: RoleTD.RoleItem["code"]) => {
    return http.get<Pick<RoleTD.PermissionParams, "checked">>(PORT8 + `/get_role_permission`, { code });
  }
};
