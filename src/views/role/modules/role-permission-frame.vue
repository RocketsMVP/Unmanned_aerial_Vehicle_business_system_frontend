<template>
  <el-drawer v-model="visible" title="角色权限" size="600px" destroy-on-close @close="handleCloseFrame">
    <el-row class="mb-10">
      <el-radio-group v-model="permissionType" @change="handleChangePermission" :disabled="loading">
        <el-radio-button value="updateMenuApi">角色菜单权限</el-radio-button>
        <el-radio-button value="updateRoleApi">角色API权限</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="mb-10" style="margin-top: 20px">
      <el-tree
        ref="elTreeRef"
        class="custom-tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        @check-change="handleCheckChange"
        node-key="code"
        :props="{
          label: 'name'
        }"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <span>{{ data.name }}</span>
            <span v-if="permissionType === 'updateRoleApi' && node.isLeaf && data.code">{{
              data.code.split("/").slice(0, -1).join("/")
            }}</span>
          </div>
        </template>
      </el-tree>
    </el-row>
    <template #footer>
      <div class="flx-right">
        <el-button @click="handleCloseFrame">取消</el-button>
        <el-button type="primary" @click="handleSubmit(true)" :loading="loading">提交</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage, type TreeInstance, type TreeKey } from "element-plus";
import { useLoading } from "@/hooks/useLoading";
import { ref, watch } from "vue";
import { roleApi, menuApi, backendRouteApi } from "@/api";

interface Props {
  rowCode?: RoleTD.RoleItem["code"];
}

interface Emits {
  (e: "submitted"): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const elTreeRef = ref<TreeInstance>();

const visible = defineModel<boolean>("visible", {
  default: false
});

const { loading, startLoading, endLoading } = useLoading(false);
type PermissionType = "updateMenuApi" | "updateRoleApi";
const permissionType = ref<PermissionType>("updateMenuApi");
const treeData = ref<MenuTD.SelectMenuTreeItem[]>([]);
const defaultCheckedKeys = ref<MenuTD.SelectMenuTreeItem["code"][]>([]);

const formatRoleListData = (list: BackendRouteTD.BackendRouteItem[]): MenuTD.SelectMenuTreeItem[] => {
  const groupMap = new Map();
  list.forEach(item => {
    const { group, name, path, method } = item;
    if (!groupMap.has(group)) {
      groupMap.set(group, {
        name: group,
        code: group,
        children: []
      });
    }
    groupMap.get(group).children.push({
      name,
      code: `${path}/${method}`,
      children: []
    });
  });
  return Array.from(groupMap.values());
};
let isChange: boolean = false;
const handleChangePermission = async (val: any) => {
  permissionType.value = val === "updateMenuApi" ? "updateRoleApi" : "updateMenuApi";
  if (isChange) {
    await handleSubmit(false);
  }
  permissionType.value = val as PermissionType;
  treeData.value = val === "updateRoleApi" ? formatRoleListData(apis) : menus;
  defaultCheckedKeys.value = val === "updateRoleApi" ? apisChecked : menusChecked;
};

const handleCheckChange = () => (isChange = true);

let menus: MenuTD.MenuItem[] = [];
let apis: BackendRouteTD.BackendRouteItem[] = [];

const reset = () => {
  menus = [];
  apis = [];
  menusChecked = [];
  apisChecked = [];
  treeData.value = [];
};
watch(
  () => visible.value,
  async () => {
    if (visible.value) {
      permissionType.value = "updateMenuApi";
      await fetchMenuList();
      await fetchBackendRouteList();
      await fetchRoleChecked();
      handleChangePermission(permissionType.value);
    } else {
      reset();
    }
  }
);
let menusChecked: string[] = [];
let apisChecked: string[] = [];

const removeLeafKey = (key: TreeKey[], data: MenuTD.SelectMenuTreeItem[]) => {
  const result: string[] = [];
  const traverse = (node: MenuTD.SelectMenuTreeItem) => {
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        traverse(child);
      });
    } else {
      result.push(node.code);
    }
  };
  data.forEach(node => {
    traverse(node);
  });
  return result.filter(item => key.includes(item));
};

async function fetchRoleChecked() {
  if (!props.rowCode) return;
  const { data } = await roleApi.getRoleChecked(props.rowCode);
  menusChecked = removeLeafKey(data.menu, menus);
  apisChecked = data.api.map(item => `${item.path}/${item.act}`);
}

async function fetchMenuList() {
  if (!props.rowCode) return;
  const { data } = await menuApi.getAllMenuTree();
  if (Array.isArray(data)) {
    menus = data;
  }
}
async function fetchBackendRouteList() {
  if (!props.rowCode) return;
  const { data } = await backendRouteApi.getBackendRouteList({ page: 1, page_size: 1000000 });
  if (Array.isArray(data.list)) {
    apis = data.list;
  }
}
function handleCloseFrame() {
  visible.value = false;
}

async function handleSubmit(tag: boolean) {
  if (loading.value) return;
  let checkedKeys: any = elTreeRef.value?.getCheckedKeys() ?? [];
  if (permissionType.value === "updateMenuApi") {
    checkedKeys = checkedKeys?.concat(elTreeRef.value?.getHalfCheckedKeys() || []);
  } else {
    checkedKeys = checkedKeys
      .filter(item => !apis.find(a => a.group === item))
      .map(item => {
        let list = item.split("/");
        return {
          act: list.pop(),
          path: list.join("/")
        };
      });
  }
  startLoading();
  try {
    const data: RoleTD.PermissionParams = {
      code: props.rowCode as RoleTD.RoleItem["code"],
      checked: checkedKeys as RoleTD.PermissionParams["checked"]
    };
    const { code } = await roleApi[permissionType.value](data);
    if (code === 200) {
      tag && handleCloseFrame();
      !tag && (await fetchRoleChecked());
      emit("submitted");
      isChange = false;
      ElMessage.success("更新成功");
    }
  } catch (error) {
    console.error(error);
  } finally {
    endLoading();
  }
}
</script>

<style scoped lang="scss">
.custom-tree {
  width: 100%;
  :deep(.custom-tree-node) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
