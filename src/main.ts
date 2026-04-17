import { createApp } from "vue";
import App from "./App.vue";
import "@/styles/reset.scss";
import "@/styles/common.scss";
import "@/assets/iconfont/iconfont.css";
import "@/assets/fonts/font.scss";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/element-dark.scss";
import "@/styles/element.scss";
import "virtual:svg-icons-register";
import ElementPlus from "element-plus";
import * as Icons from "@element-plus/icons-vue";
import router from "@/routers";
import I18n from "@/languages/index";
import pinia from "@/stores";

const app = createApp(App);

// 自动注册 src/components 下的所有 .vue 组件（使用 eager 并处理 index.vue 的文件夹命名）
const modules = import.meta.glob("./components/**/*.vue", { eager: true }) as Record<string, any>;
Object.entries(modules).forEach(([filePath, module]) => {
  const comp = module.default ?? module;
  if (!comp) return;

  // 计算基础名称：若文件名为 index 则使用父目录名，否则使用文件名
  const parts = filePath.split("/");
  const fileNameWithExt = parts.pop()!;
  const parentDir = parts.pop();
  const fileName = fileNameWithExt.replace(/\.\w+$/, "");
  const baseName = fileName === "index" && parentDir ? parentDir : fileName;

  // 转为 PascalCase（例如 zyf-dt-pro-table -> ZyfDtProTable）
  const pascalName = baseName.replace(/(^|[-_\/])([a-zA-Z0-9])/g, (_, __, c) => (c ? c.toUpperCase() : "")).replace(/[-_]/g, "");

  // 注册自定义名称
  if (comp.name) {
    app.component(comp.name, comp);
  }

  // 注册 PascalCase 名称
  const nameToRegister = pascalName;
  app.component(pascalName, comp);

  // 同时注册 kebab-case，方便模板中以 <zyf-dt-pro-table> 使用
  const kebabName = nameToRegister.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  if (kebabName !== nameToRegister.toLowerCase()) {
    app.component(kebabName, comp);
  }
});

Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app
  .use(ElementPlus)
  .use(router)
  .use(I18n as any)
  .use(pinia as any)
  .mount("#main");
