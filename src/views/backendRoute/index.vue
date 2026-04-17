<template>
  <div class="wh-full">
    <ProTable ref="proTable" row-key="id" :columns="columns" :request-api="backendRouteApi.getBackendRouteList" />
  </div>
</template>

<script setup lang="tsx">
import { backendRouteApi } from "@/api";
import { computed, ref } from "vue";

const proTable = ref();
const columns = computed(() => {
  return [
    { type: "index", label: "序号", width: "70px" },
    { prop: "name", label: "路由名称", search: { el: "input" } },
    { prop: "path", label: "路由地址", search: { el: "input" } },
    {
      prop: "method",
      label: "请求方式",
      search: { el: "select" },
      enum: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "DELETE", value: "DELETE" }
      ]
    },
    { prop: "group", label: "分组" },
    { prop: "created_at", label: "创建时间" }
  ];
});
</script>

<style scoped></style>
