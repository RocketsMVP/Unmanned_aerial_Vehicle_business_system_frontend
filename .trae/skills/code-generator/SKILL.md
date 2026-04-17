---
name: "code-generator"
description: "根据需求生成前端代码，包括页面组件、API接口、业务逻辑。使用项目公共组件，遵循代码生成规范。"
---

# 代码生成Skill

## 用途

根据解析后的需求生成可落地的Vue3前端代码，包括页面、API接口、业务逻辑。

## 生成范围

### 1. 页面代码

- 列表页
- 表单页
- 详情页

### 2. API接口

- 类型声明（.d.ts）
- 接口函数（.ts）

### 3. 业务逻辑

- 页面逻辑（modules/index.ts）
- 弹窗组件（modules/\*.vue）

## 生成规范

### 目录结构

按项目结构规范生成：

```
views/xxx/
├── modules/
│   ├── index.ts
│   └── xxx-frame.vue
└── index.vue
```

### 代码格式（必须遵守）

#### 语言规范

- **必须使用 TypeScript (.ts)**，禁止使用 JavaScript (.js)

#### 缩进与空格

- 缩进：2 个空格
- 禁止使用 tab，必须使用空格
- 不允许多个空行（最多 1 个）

#### 命名规范

- 函数/变量名：camelCase
- 常量：UPPER_CASE
- 组件/目录：PascalCase（组件）、kebab-case（目录）

#### 代码规范

- **禁止未使用变量**
- 禁止 console 输出
- 遵循 .eslintrc.cjs、.prettierrc.cjs、.stylelintrc.cjs 提供的规则

#### ESLint 规则

- 禁止使用 var，必须使用 let 或 const
- 禁止定义未使用的变量
- 禁止空函数
- 禁止使用 @ts-ignore，使用 @ts-expect-error
- 禁止 @ts-xxx 注释

#### Vue 规范

- 使用 `<script setup>` 语法糖
- 样式添加 scoped
- 禁止修改 props
- v-slot 使用具名插槽
- 属性命名使用连字符（kebab-case）

#### Prettier 规则

- 最大行长：130
- 语句末尾加分号
- 使用双引号
- 尾随逗号：none
- 箭头函数单参数省略括号

### 组件使用

**优先使用公共组件**，禁止使用散装控件。

#### ZyfDtProTable（高级表格）

ZyfDtProTable 是封装后的高级表格组件，**自带搜索、分页、列设置等功能**。

##### 基础属性

```typescript
interface ColumnProps<T = any> {
  type?: "index" | "selection" | "radio" | "expand";
  prop: string;
  label: string;
  minWidth?: number;
  width?: number;
  fixed?: "left" | "right";
  isShow?: boolean;
  search?: SearchProps;
  enum?: EnumProps[];
  isFilterEnum?: boolean;
  render?: (scope: RenderScope<T>) => VNode | string;
  headerRender?: (scope: HeaderRenderScope<T>) => VNode;
}
```

##### 搜索配置（search）

```typescript
const columns: ColumnProps[] = [
  { prop: "name", label: "姓名", minWidth: 120, search: { el: "input", label: "姓名" } },
  { prop: "status", label: "状态", minWidth: 100, search: { el: "select" }, enum: [{ label: "启用", value: 1 }] },
  { prop: "createTime", label: "创建时间", minWidth: 180, search: { el: "date-picker" } }
];
```

**支持的搜索类型（el）**：input | input-number | select | select-v2 | tree-select | cascader | date-picker | time-picker | time-select | switch | slider | year-picker

##### 枚举配置（enum）

```typescript
const columns: ColumnProps[] = [
  { prop: "gender", label: "性别", minWidth: 80, enum: [{ label: "男", value: 1 }], isFilterEnum: true }
];
```

##### 自定义渲染（render）

```typescript
const columns: ColumnProps[] = [
  { prop: "action", label: "操作", width: 180, fixed: "right", render: (scope) => <el-button>编辑</el-button> },
];
```

##### 宽度设置规范

- **普通数据列**：使用 `minWidth`
- **操作列/固定列**：使用 `width` + `fixed: "right"`
- **序号列/选择列**：使用 `width`

### 列表页模板

```vue
<template>
  <div class="table-container">
    <ZyfDtProTable :columns="columns" :api="getList" :search-param="queryParams" />
  </div>
</template>

<script setup lang="ts">
const queryParams = reactive({ pageNum: 1, pageSize: 10 });

const columns: ColumnProps[] = [
  { type: "index", label: "序号", width: 60 },
  { prop: "name", label: "姓名", minWidth: 120, search: { el: "input" } },
  { prop: "phone", label: "手机号", minWidth: 130 },
  { prop: "status", label: "状态", minWidth: 100, search: { el: "select" }, enum: [] },
  { prop: "action", label: "操作", width: 180, fixed: "right", render: () => <div>...</div> }
];
</script>

<style scoped lang="scss">
.table-container {
  width: 100%;
  height: 100%;
}
</style>
```

### API接口规范

#### 文件结构

```
api/modules/xxx/
├── xxx.d.ts      # 类型声明
└── xxx.ts        # 接口函数
```

#### 类型声明文件 (.d.ts)

```typescript
// worker.d.ts
export interface Worker {
  id?: number;
  name: string;
  phone: string;
  status: number;
}

export interface WorkerQuery {
  pageNum: number;
  pageSize: number;
  name?: string;
  status?: number;
}

export interface WorkerListRes {
  list: Worker[];
  total: number;
}
```

#### 接口函数文件 (.ts)

```typescript
import { PORT_LABOR, http } from "@/api";
import type { Worker, WorkerQuery, WorkerListRes } from "./worker.d";

export const getWorkerList = (params: WorkerQuery) => {
  return http.get<WorkerListRes>(PORT_LABOR + "/workers", { params });
};

export const getWorkerDetail = (id: number) => {
  return http.get<Worker>(PORT_LABOR + "/workers/" + id);
};

export const addWorker = (data: Worker) => {
  return http.post<any>(PORT_LABOR + "/workers", data);
};

export const updateWorker = (id: number, data: Worker) => {
  return http.put<any>(PORT_LABOR + "/workers/" + id, data);
};

export const deleteWorker = (id: number) => {
  return http.delete<any>(PORT_LABOR + "/workers/" + id);
};
```

### 业务逻辑规范

```typescript
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getWorkerList, deleteWorker } from "@/api/modules/xxx";

export const useWorker = () => {
  const loading = ref(false);
  const tableData = ref<any[]>([]);
  const total = ref(0);
  const queryParams = reactive({ pageNum: 1, pageSize: 10 });

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await getWorkerList(queryParams);
      tableData.value = res.list || [];
      total.value = res.total || 0;
    } catch (error) {
      console.error("获取列表失败", error);
    } finally {
      loading.value = false;
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteWorker(row.id);
      ElMessage.success("删除成功");
      fetchData();
    } catch (error) {
      ElMessage.error("删除失败");
    }
  };

  return {
    loading,
    tableData,
    total,
    queryParams,
    fetchData,
    handleDelete
  };
};
```

## 生成检查清单

生成代码后，必须检查：

- [ ] 无未使用变量（无红色飘红）
- [ ] 无 console.log
- [ ] 使用 TypeScript
- [ ] 使用 `<script setup>`
- [ ] 样式添加 scoped
- [ ] 缩进 2 空格
- [ ] 语句末尾分号
- [ ] 使用双引号
- [ ] API类型和函数分离到 .d.ts 和 .ts 文件
