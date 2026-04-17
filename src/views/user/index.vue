<template>
  <div class="wh-full">
    <ProTable ref="proTable" row-key="id" :columns="columns" :request-api="userApi.getUserList" :data-callback="dataCallback">
      <template #tableHeader>
        <el-button :icon="Plus" type="primary" @click="handleAdd()">添加用户</el-button>
      </template>
    </ProTable>
    <UserOperateFrame v-model:visible="visible" :operate-type="operateType" :row-id="editId" @submitted="handleReloadTable" />
  </div>
</template>

<script setup lang="tsx">
import { Plus } from "@element-plus/icons-vue";
import { userApi } from "@/api";
import { ref, reactive } from "vue";
import { useBoolean } from "@/hooks/useBoolean";
import UserOperateFrame from "./modules/user-operate-frame.vue";
import type { OperateType } from "./modules/user-operate-frame.vue";
import { ElMessage } from "element-plus";

const { setTrue: openFrame, bool: visible } = useBoolean(false);

const operateType = ref<OperateType>("add");
const editId = ref<UserTD.UserBaseInfo["id"]>();

const proTable = ref();

function setOperateType(type: OperateType = "add") {
  operateType.value = type;
}

const dataCallback = data => {
  return {
    list: data.list,
    total: data.total
  };
};
// const roleOptions = ref<any[]>([]);
// async function fetchRoleOptions() {
//   const { data, code }: any = await userApi.getUserList({ page: 1, page_size: 999 });
//   if (code === 200) {
//     roleOptions.value = data.list;
//   }
// }
// fetchRoleOptions();
function handleAdd() {
  editId.value = undefined;
  setOperateType("add");
  openFrame();
}

function handleEdit(id: UserTD.UserBaseInfo["id"]) {
  editId.value = id;
  setOperateType("edit");
  openFrame();
}

async function handleUpload(row: UserTD.UserBaseInfo) {
  if (row.id) {
    let obj: any = {
      id: row.id,
      state: row.state == 0 ? 1 : 0
    };
    const { code } = await userApi.updateUser(obj);
    if (code === 200) {
      ElMessage.success("修改成功");
      handleReloadTable();
    }
  }
}
async function handleDel(id: UserTD.UserBaseInfo["id"]) {
  if (id) {
    const { code } = await userApi.deleteUser(id);
    if (code === 200) {
      ElMessage.success("删除成功");
      handleReloadTable();
    }
  }
}

async function handleReloadTable() {
  await proTable.value?.getTableList();
}

let columns = reactive([
  { type: "index", label: "序号", width: "70px" },
  { prop: "login", label: "登录名", search: { el: "input" } },
  { prop: "name", label: "姓名", search: { el: "input" } },
  { prop: "role_id", label: "角色", render: scope => scope.row?.role?.name ?? "--" },
  { prop: "updated_at", label: "更新时间", width: "200px" },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    align: "left",
    fixed: "right",
    render: scope => {
      return (
        scope.row.id !== 1111 && (
          <el-space>
            <el-button link type="primary" onClick={() => handleEdit(scope.row.id)}>
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确定要修改该记录吗"
              width="175"
              onConfirm={() => handleUpload(scope.row)}
            >
              {{
                reference: () => (
                  <div style="margin-bottom:4px">
                    <el-button type="danger" link>
                      {scope.row.state ? "设为无效" : "设为有效"}
                    </el-button>
                  </div>
                )
              }}
            </el-popconfirm>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确定要删除该记录吗"
              width="175"
              onConfirm={() => handleDel(scope.row.id)}
            >
              {{
                reference: () => (
                  <div style="margin-bottom:4px">
                    <el-button type="danger" link>
                      删除
                    </el-button>
                  </div>
                )
              }}
            </el-popconfirm>
          </el-space>
        )
      );
    }
  }
]);
</script>

<style lang="scss">
.wh-full {
  width: 100%;
  height: 100%;
}
.avatar-user-manage {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  // cursor: pointer;
  // border-radius: 50%;
  img {
    width: 60px;
    height: 60px;
  }
}
</style>
