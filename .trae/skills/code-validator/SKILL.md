---
name: "code-validator"
description: "代码校验验证，包括ESLint检查、TypeScript类型检查、代码格式校验、项目规范检查。"
---

# 代码校验Skill

## 用途
对生成的代码进行校验验证，确保符合项目规范，包括语法检查、格式校验、规范检查。

## 校验范围

### 1. ESLint检查
代码语法和风格检查：
- 禁止未使用变量
- 禁止console输出
- 函数/变量命名规范
- 字符串引号规范

### 2. TypeScript类型检查
- 类型定义完整性
- 接口类型正确性
- 类型推导准确性

### 3. 代码格式
- 缩进：2个空格
- 语句末尾分号
- 导入路径规范

### 4. 项目规范检查
- 目录结构规范
- 文件命名规范
- 组件使用规范
- 公共组件优先使用

## 校验命令

```bash
# ESLint检查
pnpm lint:eslint

# Prettier格式化
pnpm lint:prettier

# Stylelint样式检查
pnpm lint:stylelint

# TypeScript类型检查
pnpm type:check

# 完整检查
pnpm lint:lint-staged
```

## 常见问题修复

### ESLint错误
- 未使用变量 → 删除或使用_
- console输出 → 删除或替换为logger
- 引号错误 → 使用单引号

### TypeScript错误
- any类型 → 定义具体类型
- 类型推导失败 → 显式定义类型

### 格式问题
- 缩进不一致 → 运行Prettier
- 行尾逗号 → 调整配置

## 使用方法

1. 生成代码后运行校验命令
2. 根据错误提示修复问题
3. 重新运行校验确认通过
4. 确保代码符合项目规范
