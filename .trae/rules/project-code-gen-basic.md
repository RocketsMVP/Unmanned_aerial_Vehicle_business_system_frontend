# 代码生成基础规范

## 工程结构

### 目录规范

- 目录按「业务模块+端类型」拆分
- PC端：`src/views/*`
- H5端：`src/h5/*`
- 公共代码放入 `src/common/*`（组件/工具/接口）

### 文件命名

- 组件/页面：kebab-case（如 `user-list.vue`）
- 工具/接口：camelCase（如 `getUser.ts`）
- 常量：UPPER_CASE（如 `CONSTANT.ts`）

### API接口文件结构

```
api/modules/xxx/
├── xxx.d.ts      # 类型声明
└── xxx.ts        # 接口函数
```

## 基础模板

- Vue 组件默认使用 `<script setup>` 语法糖
- 样式默认添加 `scoped`
- 导入路径使用 Vite 别名 `@/`

## 代码语法

### Vue3 核心语法

- 响应式数据仅使用 `ref/reactive`
- 生命周期使用 `onMounted` 等组合式钩子
- 组件传参用 `defineProps/defineEmits`（带类型）
- 禁止生成 Options API
- 父组件传参使用 hyphenated 的形式

### 接口请求

- 接口按业务模块拆分（如 `api/modules/user/index.ts`）
- 类型声明在 .d.ts 文件，接口函数在 .ts 文件
- 使用 `import type` 导入类型
- 异步请求使用 `async/await`
- 统一导入封装的 `import { PORT1, http } from "@/api"`
- PORT1 为接口前缀需要在 `servicePort.ts` 中定义
- http 为 axios 实例，可以使用 `http.post/get/put/delete` 等方法
- 示例如下：

```
// 用户登录
  login: (params: LoginTD.ReqLoginForm) => {
    return http.post<LoginTD.ResLogin>(PORT1 + `/login`, params);
  },
```

## 工程化配置

- 仅使用 Vite 规范的 `import.meta.env`
- 区分开发/生产环境配置（DEV/PROD）
- 禁止使用 `process.env`
