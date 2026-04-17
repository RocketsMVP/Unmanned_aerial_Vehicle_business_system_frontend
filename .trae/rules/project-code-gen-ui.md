# UI组件使用规范

## 组件导入

PC端：从 `element-plus` 按需导入
H5端：从 `vant` 导入

## 公共组件（优先使用）

| 组件          | 用途                 |
| ------------- | -------------------- |
| ZyfDtProTable | 高级表格（包括搜索） |

## 样式规范

PC端：px、kebab-case、全局样式 `src/styles/`
H5端：rem/vw、适配Vant变量

## 权限控制

PC端：v-hasPerm 指令 + ElMenu 动态渲染
H5端：路由级权限 + 条件渲染
