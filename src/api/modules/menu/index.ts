import { PORT2, http } from "@/api";
import { ReqPageParams } from "@/api/interface";
/**
 * @name 菜单模块
 */
export const menuApi = {
  // 获取菜单列表
  getMenuList: (params: ReqPageParams<Omit<MenuTD.MenuBaseInfo, "children">>) => {
    return http.get<MenuTD.MenuItem[]>(PORT2 + `/list`, params);
  },
  // 获取菜单详情
  getMenuDetail: (id: MenuTD.MenuItem["id"]) => {
    return http.get<MenuTD.MenuItem>(PORT2 + `/${id}`, { id });
  },
  // 新增菜单
  createMenu: (params: MenuTD.MenuBaseInfo) => {
    return http.post(PORT2 + `/create`, params);
  },
  // 修改菜单
  updateMenu: (params: MakeRequired<MenuTD.MenuBaseInfo, "id">) => {
    return http.put(PORT2 + `/update`, params);
  },
  // 删除菜单
  deleteMenu: (id: MenuTD.MenuItem["id"]) => {
    return http.delete(PORT2 + `/delete`, { id });
  },
  // 获取全部菜单树
  getAllMenuTree: () => {
    return http.get<MenuTD.SelectMenuTreeItem[]>(PORT2 + `/tree`, {});
  }
};
