declare namespace MenuTD {
  interface MenuBaseInfo {
    id?: number;
    name: string;
    path: string;
    component?: string;
    code: string;
    icon?: string;
    redirect?: string;
    active?: string;
    link?: string;
    parent_id?: number | "" | null;
    is_hidden: boolean;
    is_keep_alive: boolean;
    order: number;
    remark?: string;
    classify: "directory" | "menu";
    button_code?: string;
    status: boolean;
  }
  interface MenuItem extends MakeRequired<MenuBaseInfo, "id"> {
    children?: MenuItem[];
  }
  type SelectMenuTreeItem = Pick<MenuTD.MenuItem, "code" | "name"> & { children?: SelectMenuTreeItem[] };
}
