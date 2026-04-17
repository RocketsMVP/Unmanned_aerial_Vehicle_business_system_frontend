import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import { userApi } from "@/api";
import { useTheme } from "@/hooks/useTheme";
import { useGlobalStore } from "./global";
import { GlobalState } from "@/stores/interface";
export const useUserStore = defineStore({
  id: "dt-ai-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "Geeker" }
  }),
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    async getUserInfo() {
      const { data } = await userApi.getUserInfo();
      this.userInfo = data;
      let layout: GlobalState = data?.layout ?? {};
      for (const key in layout) {
        if (Object.prototype.hasOwnProperty.call(layout, key)) {
          useGlobalStore().setGlobalState(key as ObjToKeyValArray<GlobalState>[0], layout[key]);
        }
      }
      const { initTheme } = useTheme();
      initTheme();
    }
  },
  persist: piniaPersistConfig("dt-ai-user")
});
