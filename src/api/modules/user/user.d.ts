// 用户管理模块
declare namespace UserTD {
  import { GlobalState } from "@/stores/interface";
  interface UserBaseInfo {
    id?: number;
    name: string;
    login: string;
    role_id: number | null;
    sex: "man" | "woman" | "secret";
    state?: number;
    avatar?: string;
    password?: string;
  }
  interface UserItem extends MakeRequired<UserBaseInfo, "id"> {
    layout: GlobalState | null;
    created_at: string;
    updated_at: string;
  }
  interface MenuItem {
    id: number;
    name: string;
    path: string;
    component?: string;
    code: string;
    icon?: string;
    redirect?: string;
    active?: string;
    link?: string;
    parent_id?: number | "";
    is_hidden: boolean;
    is_keep_alive: boolean;
    order: number;
    remark?: string;
    classify: "directory" | "menu";
    button_code?: string;
    status: boolean;
    children?: MenuItem[];
  }
}
