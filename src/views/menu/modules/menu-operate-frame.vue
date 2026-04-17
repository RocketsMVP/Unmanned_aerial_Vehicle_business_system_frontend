<template>
  <el-dialog v-model="visible" :title="title" width="1000px" destroy-on-close @close="handleCloseFrame">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型">
            <el-radio-group v-model="model.classify">
              <el-radio-button value="directory">目录</el-radio-button>
              <el-radio-button value="menu">菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parent_id">
            <el-tree-select
              v-model="model.parent_id"
              value-key="id"
              :data="menuOptionsList"
              check-strictly
              default-expand-all
              :props="{ label: 'name', id: 'id', children: 'children' }"
              placeholder="请选择上级菜单"
            >
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="唯一编码" prop="code">
            <el-input v-model="model.code" placeholder="请输入唯一编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="model.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单路由" prop="path">
            <el-input v-model="model.path" placeholder="请输入菜单路由" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件路径">
            <el-input v-model="model.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外链url"> <el-input v-model="model.link" placeholder="请输入外链url" /> </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单排序" prop="order">
            <el-input-number :min="0" style="width: 100%" v-model="model.order" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-select-v2
              v-model="model.icon"
              filterable
              :options="iconListName"
              :props="{ label: 'name', value: 'name' }"
              placeholder="请选择图标"
              class="w-full"
              clearable
            >
              <template #default="{ item }">
                <div class="w-full flex justify-between items-center">
                  <span>{{ item.name }}</span>
                  <el-icon>
                    <i class="iconfont" :class="item.name"></i>
                  </el-icon>
                </div>
              </template>
            </el-select-v2>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="高亮路由">
            <el-input v-model="model.active" placeholder="请输入高亮路由路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注说明" prop="remark">
            <el-input v-model="model.remark" type="textarea" placeholder="请输入备注说明" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否隐藏" prop="is_hidden">
            <el-switch v-model="model.is_hidden" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否缓存" prop="is_keep_alive">
            <el-switch v-model="model.is_keep_alive" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="status">
            <el-switch v-model="model.status" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="flx-center">
        <el-button @click="handleCloseFrame">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormRules } from "element-plus";
import { computed, ref, watch } from "vue";
import { useLoading } from "@/hooks/useLoading";
import { cloneDeep } from "lodash-es";
import { menuApi } from "@/api";
import { useElForm, useFormRules } from "@/hooks/common";
import { getIcons } from "@/utils/iconfont";

export type OperateType = "add" | "edit" | "subAdd";
export interface ProcessedMenuNode extends MenuTD.MenuItem {
  children?: ProcessedMenuNode[];
  expand: boolean;
  has_children: boolean;
}
interface Props {
  operateType: OperateType;
  rowId: MenuTD.MenuBaseInfo["id"];
  menuOptions: ProcessedMenuNode[];
}

interface Emits {
  (e: "submitted"): void;
}

type RuleKey = "name" | "path" | "code";

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>("visible", {
  default: false
});

const { loading, startLoading, endLoading } = useLoading(false);

const { formRef, validate } = useElForm();

const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: "新增菜单",
    edit: "编辑菜单",
    subAdd: "添加子菜单"
  };
  return titles[props.operateType];
});

const model = ref<MenuTD.MenuBaseInfo>(createDefaultModel());

const rules: FormRules<RuleKey> = {
  name: [defaultRequiredRule],
  path: [defaultRequiredRule],
  code: [defaultRequiredRule]
};

type MenuOptions = Omit<ProcessedMenuNode, "id"> & { id: number | "" };
const menuOptionsList = ref<MenuOptions[]>([]);

watch(visible, () => {
  if (visible.value) {
    init();
  }
});
const iconListName = ref<{ name: string }[]>([]);
async function init() {
  getIcons().then(res => {
    iconListName.value = res.map(item => ({ name: item }));
  });
  updatedModelByOperateType();
}

function createDefaultModel(): MenuTD.MenuBaseInfo {
  return {
    parent_id: "",
    code: "",
    name: "",
    icon: "",
    order: 0,
    path: "",
    component: "",
    is_keep_alive: false,
    remark: "",
    is_hidden: false,
    status: true,
    link: "",
    active: "",
    classify: "menu",
    button_code: ""
  };
}

const filterTreeByHasChildren = (treeData: ProcessedMenuNode[]): ProcessedMenuNode[] => {
  return treeData
    .filter(node => node.has_children !== false) // 保留 has_children 不为 false 的节点
    .map(node => ({
      ...node,
      children: node.children
        ? filterTreeByHasChildren(node.children) // 递归处理子节点
        : []
    }));
};

// 创造菜单树
function createMenuTree(menuList: ProcessedMenuNode[] = []): any[] {
  return [
    {
      id: "",
      name: "根菜单",
      path: "",
      code: "",
      is_hidden: false,
      is_keep_alive: false,
      order: 0,
      status: true,
      classify: "directory",
      children: filterTreeByHasChildren(menuList),
      has_children: true
    }
  ];
}

function updatedModelByOperateType() {
  menuOptionsList.value = createMenuTree(props.menuOptions);
  const fetchModel = async () => {
    if (props.rowId) {
      const { data, code } = await menuApi.getMenuDetail(props.rowId);
      if (code === 200) {
        model.value = data;
      }
    }
  };
  const handles: Record<OperateType, () => void> = {
    add: () => {
      model.value = createDefaultModel();
    },
    edit: fetchModel,
    subAdd: () => {
      model.value = createDefaultModel();
      model.value.parent_id = props.rowId;
    }
  };

  handles[props.operateType]();
}
// 关闭弹窗
function handleCloseFrame() {
  visible.value = false;
}

async function handleSubmit() {
  if (loading.value) return;
  await validate();
  startLoading();
  try {
    let mutableCode: number;
    let message = "添加成功!";
    const data = cloneDeep(model.value);
    if (!data.icon) {
      data.icon = "";
    }
    if (props.operateType === "add" || props.operateType === "subAdd") {
      if (data.parent_id === "") {
        data.parent_id = null;
      }
      const { code } = await menuApi.createMenu(data);
      mutableCode = code;
    } else {
      data.id = props.rowId;
      const { code } = await menuApi.updateMenu(data as MakeRequired<MenuTD.MenuBaseInfo, "id">);
      mutableCode = code;
      message = "更新成功!";
    }
    if (mutableCode === 200) {
      handleCloseFrame();
      emit("submitted");
      ElMessage.success(message);
    }

    // location.reload();
  } catch (error) {
    console.error(error);
  } finally {
    endLoading();
  }
}
</script>

<style scoped></style>
