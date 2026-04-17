<template>
  <div class="wh-full">
    <ProTable ref="proTable" row-key="id" :columns="columns" :request-api="roleApi.getRoleList">
      <template #tableHeader>
        <el-button :icon="Plus" type="primary" @click="handleAdd()">添加角色</el-button>
      </template>
    </ProTable>
    <role-operate-frame v-model:visible="visible" :operate-type="operateType" @submitted="handleReloadTable" :row-id="editId" />
    <role-permission-frame v-model:visible="permissionVisible" @submitted="handleReloadTable" :row-code="editCode" />
  </div>
</template>

<script setup lang="tsx">
import { Plus } from "@element-plus/icons-vue";
import { roleApi } from "@/api";
import { computed, ref } from "vue";
import { useBoolean } from "@/hooks/useBoolean";
import type { OperateType } from "./modules";
import RoleOperateFrame from "./modules/role-operate-frame.vue";
import RolePermissionFrame from "./modules/role-permission-frame.vue";
import { ElMessage } from "element-plus";

const { setTrue: openFrame, bool: visible } = useBoolean(false);
const { setTrue: openPermissionFrame, bool: permissionVisible } = useBoolean(false);

const operateType = ref<OperateType>("add");
const editId = ref<RoleTD.RoleBaseInfo["id"]>();
const editCode = ref<RoleTD.RoleBaseInfo["code"]>();

const proTable = ref();

function setOperateType(type: OperateType = "add") {
  operateType.value = type;
}

function handleAdd() {
  editId.value = undefined;
  setOperateType("add");
  openFrame();
}

function handleOpenMenu(code: RoleTD.RoleItem["code"]) {
  editCode.value = code;
  openPermissionFrame();
}

function handleEdit(id: RoleTD.RoleItem["id"]) {
  editId.value = id;
  setOperateType("edit");
  openFrame();
}

async function handleDelete(id: RoleTD.RoleItem["id"]) {
  console.log(id);
  if (id) {
    const { code } = await roleApi.deleteRole(id);
    console.log(code);
    if (code === 200) {
      ElMessage.success("删除成功");
      handleReloadTable();
    }
  }
}

async function handleReloadTable() {
  await proTable.value?.getTableList();
}

const columns = computed(() => {
  return [
    { type: "index", label: "序号", width: "70px" },
    { prop: "name", label: "角色名称" },
    { prop: "code", label: "编码" },
    { prop: "description", label: "备注" },
    {
      prop: "operation",
      label: "操作",
      width: 300,
      align: "left",
      fixed: "right",
      render: scope => {
        return (
          <el-space>
            <el-button link type="primary" onClick={() => handleEdit(scope.row.id)}>
              编辑
            </el-button>
            <el-button link type="primary" onClick={() => handleOpenMenu(scope.row.code)}>
              角色权限
            </el-button>
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

<style scoped></style>
