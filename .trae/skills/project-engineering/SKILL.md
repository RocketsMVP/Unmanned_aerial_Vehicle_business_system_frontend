---
name: "project-engineering"
description: "项目工程化配置，包括目录结构、路由配置、状态管理、环境变量等工程相关设置。"
---

# 工程化配置Skill

## 用途
处理项目工程化相关配置，包括目录结构、路由、状态管理、环境变量等。

## 配置范围

### 1. 目录结构
项目目录规范：
```
src/
├── api/          # API接口层
├── assets/       # 静态资源
├── components/  # 公共组件
├── hooks/        # 组合式API
├── layouts/      # 布局组件
├── routers/      # 路由配置
├── stores/       # 状态管理
├── styles/       # 样式文件
├── utils/        # 工具函数
└── views/        # 页面组件
```

### 2. 路由配置
- 静态路由：src/routers/modules/staticRouter.ts
- 动态路由：src/routers/modules/dynamicRouter.ts

### 3. 状态管理
Pinia stores结构：
```
stores/
├── modules/
│   ├── auth.ts
│   ├── user.ts
│   ├── global.ts
│   └── tabs.ts
└── index.ts
```

### 4. 环境变量
Vite环境变量规范：
- .env.development
- .env.production
- .env.test

使用 import.meta.env.xxx

## 工程化规则

### 文件命名
- 组件/页面：kebab-case
- 组件目录：PascalCase
- 工具函数：camelCase
- 样式文件：kebab-case

### 代码规范
- Vue3 Composition API
- <script setup>语法糖
- scoped样式
- TypeScript类型

## 使用场景

1. 新增页面需要配置路由
2. 新增功能需要状态管理
3. 新增环境变量
4. 调整项目结构
