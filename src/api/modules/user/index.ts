import { PORT3, http } from "@/api";
import { ReqPageParams } from "@/api/interface";

/**
 * @name 用户模块
 */
export const userApi = {
  // 获取用户列表
  getUserList: (params: ReqPageParams<UserTD.UserItem>) => {
    return http.get<UserTD.UserItem[]>(PORT3 + `/list`, params);
  },
  // 获取用户详情
  getUserDetail: (id: UserTD.UserItem["id"]) => {
    return http.get<UserTD.UserItem>(PORT3 + `/${id}`, { id });
  },
  // 新增用户
  createUser: (params: UserTD.UserBaseInfo) => {
    return http.post(PORT3 + `/create`, params);
  },
  // 修改用户
  updateUser: (params: UserTD.UserBaseInfo) => {
    return http.put(PORT3 + `/update`, params);
  },
  // 删除用户
  deleteUser: (id: UserTD.UserItem["id"]) => {
    return http.delete(PORT3 + `/delete`, { id });
  },
  // 获取用户信息ByToken
  getUserInfo: () => {
    return http.get<UserTD.UserBaseInfo>(PORT3 + `/according_token_basic`, {});
  },
  // 获取用户权限菜单
  getUserMenu: () => {
    return http.get<UserTD.MenuItem[]>(PORT3 + `/according_token_obtain`, {});
  },
  // 根据token修改用户信息
  updateUserInfo: (params: Partial<UserTD.UserItem>) => {
    return http.put(PORT3 + `/update_information`, params);
  }
};
