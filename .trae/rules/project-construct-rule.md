# Vue 3 + Vite 项目结构规范

## 目录结构

### 根目录

```
.husky/           # Git hooks
.vscode/          # VSCode 配置
build/            # 构建配置
public/           # 静态资源
src/              # 源代码
.env              # 环境变量
.env.development
.env.production
.env.test
.eslintrc.cjs     # ESLint
.prettierrc.cjs   # Prettier
.stylelintrc.cjs  # Stylelint
index.html
package.json
vite.config.ts
tsconfig.json
```

### src 目录

```
api/              # API 接口层
  config/         # 配置
  helper/         # 工具
  interface/      # 类型
  modules/        # 模块
  request/        # 请求封装
assets/          # 静态资源
  fonts/         # 字体
  iconfont/      # iconfont
  icons/         # SVG
  images/        # 图片
  json/          # JSON
components/      # 公共组件
config/          # 配置
constants/       # 常量
directives/      # 指令
enums/           # 枚举
hooks/           # Hooks
languages/       # 国际化
layouts/         # 布局
routers/         # 路由
stores/          # 状态管理
styles/          # 样式
typings/         # 类型声明
utils/           # 工具函数
views/           # 页面
App.vue
main.ts
```

## 命名规范

| 类型     | 规则       | 示例            |
| -------- | ---------- | --------------- |
| 目录     | kebab-case | api/modules     |
| 组件目录 | PascalCase | ZyfDtProTable   |
| Vue文件  | PascalCase | UserOperate.vue |
| 工具函数 | camelCase  | useTable.ts     |
| 样式     | kebab-case | common.scss     |

## 页面模板

```
views/xxx/
├── modules/      # 业务逻辑
└── index.vue     # 页面入口
```

## API模块

```
api/modules/xxx/
```

## 组件模板

```
components/Xxx/
├── components/
├── interface/
└── index.vue
```
