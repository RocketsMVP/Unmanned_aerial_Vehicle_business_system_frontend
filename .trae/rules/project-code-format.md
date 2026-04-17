# 代码格式规范

## 语言规范

- 脚本语言：**必须使用 TypeScript (.ts)**，禁止使用 JavaScript (.js)

## 缩进与空格

- 缩进：2 个空格
- 禁止使用 tab，必须使用空格
- 不允许多个空行（最多 1 个）

## 命名规范

- 函数/变量名：camelCase
- 常量：UPPER_CASE
- 组件/目录：PascalCase（组件）、kebab-case（目录）

## 代码规范

- 禁止未使用变量
- 禁止 console 输出
- 遵循 .eslintrc.cjs、.prettierrc.cjs、.stylelintrc.cjs 提供的规则

## ESLint 规则

### TypeScript 规则

- 禁止使用 var，必须使用 let 或 const
- 禁止定义未使用的变量
- 禁止空函数
- 禁止使用 @ts-ignore，使用 @ts-expect-error
- 禁止 @ts-xxx 注释

### Vue 规则

- 使用 `<script setup>` 语法糖
- 样式添加 scoped
- 禁止修改 props
- v-slot 使用具名插槽
- 属性命名使用连字符（kebab-case）

## Prettier 规则

- 最大行长：130
- 缩进宽度：2
- 语句末尾加分号
- 使用双引号
- 对象属性引号：as-needed
- 尾随逗号：none
- 对象括号内有空格
- 箭头函数单参数省略括号

## Stylelint 规则

- URL 必须加引号
- 16 进制颜色使用长格式
- 忽略 global、v-deep、deep 伪类
