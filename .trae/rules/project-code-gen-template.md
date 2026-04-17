# 功能模板规范

## ZyfDtProTable（高级表格）

ZyfDtProTable 是封装后的高级表格组件，**自带搜索、分页、列设置等功能**，无需额外使用 ZyfDtSearchForm。

### 搜索配置（search）

在 column 中设置 `search` 属性即可启用搜索：

```typescript
const columns = [
  { prop: "name", label: "姓名", minWidth: 120, search: { el: "input", label: "姓名" } },
  { prop: "status", label: "状态", minWidth: 100, search: { el: "select" }, enum: [{ label: "启用", value: 1 }] },
  { prop: "createTime", label: "创建时间", minWidth: 180, search: { el: "date-picker" } }
];
```

### 枚举配置（enum）

```typescript
const columns = [{ prop: "status", label: "状态", minWidth: 100, enum: [{ label: "启用", value: 1 }], isFilterEnum: true }];
```

### 自定义渲染（render）

```typescript
const columns = [
  { prop: "action", label: "操作", width: 180, fixed: "right", render: (scope) => <el-button>编辑</el-button> },
];
```

### 列类型（type）

支持：index、selection、radio、expand

### 宽度设置规范

- **普通数据列**：使用 `minWidth`，让表格自动分配宽度
- **操作列/固定列**：使用 `width` + `fixed: "right"`，保持固定可见
- **序号列/选择列**：使用 `width`，固定宽度

---

## PC端列表页模板

**必须使用 ZyfDtProTable**，利用其自带的搜索功能：

```vue
<template>
  <div class="table-container">
    <ZyfDtProTable :columns="columns" :api="getList" :search-param="queryParams" />
  </div>
</template>

<script setup lang="ts">
const columns = [
  { type: "index", label: "序号", width: 60 },
  { prop: "name", label: "姓名", minWidth: 120, search: { el: "input" } },
  { prop: "status", label: "状态", minWidth: 100, search: { el: "select" }, enum: [], isFilterEnum: true },
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

---

## PC端表单页模板

使用弹窗组件：

```vue
<template>
  <el-button @click="visible = true">新增</el-button>
  <XxxOperateFrame v-model="visible" @success="fetchData" />
</template>
```

---

## PC端详情页模板

```vue
<template>
  <div class="detail-container">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="姓名">{row.name}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  width: 100%;
  height: 100%;
}
</style>
```

---

## H5端列表页模板

使用 Vant 组件：

- VanList + VanPullRefresh + VanSearch
- 下拉刷新、上拉加载、搜索、加载状态
