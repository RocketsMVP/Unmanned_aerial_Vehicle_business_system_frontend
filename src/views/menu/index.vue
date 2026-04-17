<template>
  <div class="wh-full">
    <ProTable
      ref="proTable"
      row-key="id"
      :columns="columns"
      :request-api="menuApi.getMenuList"
      :data-callback="formatData"
      :pagination="false"
      :init-param="{ page: 1, page_size: 100 }"
      :tree-props="{ children: 'children' }"
      :expand-row-keys="['2', '27']"
    >
      <template #tableHeader>
        <el-button :icon="Plus" type="primary" @click="handleAdd()">添加菜单</el-button>
      </template>
    </ProTable>
    <MenuOperateFrame
      v-model:visible="visible"
      :operate-type="operateType"
      :row-id="editId"
      :menu-options="menuOptions"
      @submitted="handleReloadTable"
    />
  </div>
</template>

<script setup lang="tsx">
import { Plus, ArrowRight } from "@element-plus/icons-vue";
import { menuApi } from "@/api";
import { computed, ref } from "vue";
import { useBoolean } from "@/hooks/useBoolean";
import type { OperateType, ProcessedMenuNode } from "./modules";
import MenuOperateFrame from "./modules/menu-operate-frame.vue";
import { ElMessage } from "element-plus";

const { setTrue: openFrame, bool: visible } = useBoolean(false);

const operateType = ref<OperateType>("add");
const editId = ref<MenuTD.MenuBaseInfo["id"]>();

const proTable = ref();

function setOperateType(type: OperateType = "add") {
  operateType.value = type;
}

function handleAdd() {
  setOperateType("add");
  openFrame();
}

function handleSubAdd(id: MenuTD.MenuBaseInfo["id"]) {
  editId.value = id;
  setOperateType("subAdd");
  openFrame();
}

function handleEdit(id: MenuTD.MenuBaseInfo["id"]) {
  editId.value = id;
  setOperateType("edit");
  openFrame();
}

async function handleDelete(id: MenuTD.MenuBaseInfo["id"]) {
  if (id) {
    const { code } = await menuApi.deleteMenu(id);
    if (code === 200) {
      ElMessage.success("删除成功");
      handleReloadTable();
    }
  }
}

async function handleReloadTable() {
  await proTable.value?.getTableList();
}
const menuOptions = ref<ProcessedMenuNode[]>([]);

function addHasChildrenFlag(menuData: MenuTD.MenuItem[]): ProcessedMenuNode[] {
  return menuData.map(node => {
    const processedNode: ProcessedMenuNode = {
      ...node,
      has_children: node.classify === "directory",
      expand: node.classify === "directory" && !node.parent_id ? true : false,
      children: node.children ? addHasChildrenFlag(node.children) : []
    };
    return processedNode;
  });
}
const defaultExpandedKeys = ref<string[]>();
function formatData(data: { list: MenuTD.MenuItem[] }) {
  menuOptions.value = [];
  if (Array.isArray(data?.list)) {
    menuOptions.value = addHasChildrenFlag(data.list);
    defaultExpandedKeys.value = menuOptions.value.filter(item => item.classify === "directory").map(item => `${item.id}`);
  }
  return menuOptions.value;
}

const columns = computed(() => {
  return [
    {
      prop: "name",
      label: "菜单名称",
      align: "left",
      render: scope => {
        return (
          <el-space
            class={`cell-name-box ${scope.row.has_children && !scope.row.children.length && scope.row.parent_id ? "has-expand-icon" : ""}`}
          >
            {scope.row.has_children && !scope.row.children.length && (
              <el-icon
                class={`expand-icon ${scope.row.expand ? "flip-icon" : ""}`}
                onClick={() => (scope.row.expand = !scope.row.expand)}
              >
                <ArrowRight />
              </el-icon>
            )}
            {scope.row.name}
          </el-space>
        );
      }
    },
    {
      prop: "classify",
      label: "类型",
      enum: [
        { label: "菜单", value: "menu" },
        { label: "目录", value: "directory" }
      ]
    },
    {
      prop: "icon",
      label: "图标",
      width: "100px",
      render: scope => {
        return (
          <el-icon>
            <i class={`iconfont ${scope.row.icon}`}></i>
          </el-icon>
        );
      }
    },
    { prop: "path", label: "菜单路由" },
    { prop: "code", label: "唯一编码" },
    { prop: "component", label: "组件路径" },
    { prop: "order", label: "排序" },
    {
      prop: "is_hidden",
      label: "是否隐藏",
      render: scope => {
        return <el-tag type={!scope.row.is_hidden ? "success" : "danger"}>{!scope.row.is_hidden ? "显示" : "隐藏"}</el-tag>;
      }
    },
    {
      prop: "operation",
      label: "操作",
      width: 200,
      fixed: "right",
      align: "left",
      render: scope => {
        return (
          <el-space>
            <el-button link type="primary" onClick={() => handleEdit(scope.row.id)}>
              编辑
            </el-button>
            {scope.row.classify === "directory" && (
              <el-button link type="primary" onClick={() => handleSubAdd(scope.row.id)}>
                添加子菜单
              </el-button>
            )}
            {scope.row.id !== 1 && (
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="确定要删除该记录吗"
                width="175"
                onConfirm={() => handleDelete(scope.row.id)}
              >
                {{
                  reference: () => (
                    <el-button type="danger" link>
                      删除
                    </el-button>
                  )
                }}
              </el-popconfirm>
            )}
          </el-space>
        );
      }
    }
  ];
});
</script>

<style scoped lang="scss">
:deep(.cell-name-box) {
  .expand-icon {
    height: 20px;
    font-size: 12px;
    color: var(--el-text-color-regular, #606266);
    cursor: pointer;
    transition: transform var(--el-transition-duration-fast, 0.2s) ease-in-out;
  }
  .flip-icon {
    transform: rotate(90deg);
  }
  &.has-expand-icon {
    gap: 0 6px !important;
    margin-left: -20px;
  }
}
</style>
