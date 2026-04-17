<template>
  <el-dialog v-model="visible" :title="title" width="500px" destroy-on-close @close="handleCloseFrame">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="model.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="model.code" placeholder="请输入登录名" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="model.description"
          placeholder="请输入备注"
          type="textarea"
          show-word-limit
          maxlength="200"
          :autosize="{ minRows: 3 }"
        />
      </el-form-item>
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
import { roleApi } from "@/api";
import { useElForm, useFormRules } from "@/hooks/common";

export type OperateType = "add" | "edit";

interface Props {
  operateType: OperateType;
  rowId?: RoleTD.RoleBaseInfo["id"];
}

interface Emits {
  (e: "submitted"): void;
}

type RuleKey = keyof Omit<RoleTD.RoleBaseInfo, "id" | "state">;

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>("visible", {
  default: false
});

const { loading, startLoading, endLoading } = useLoading(false);

const { formRef, validate } = useElForm();

const { defaultRequiredRule, createLengthRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: "新增角色",
    edit: "编辑角色"
  };
  return titles[props.operateType];
});
const model = ref<RoleTD.RoleBaseInfo>(createDefaultModel());

const rules: FormRules<RuleKey> = {
  name: [defaultRequiredRule],
  code: [defaultRequiredRule],
  description: [createLengthRule(200)]
};

watch(visible, () => {
  if (visible.value) {
    init();
  }
});

function init() {
  updatedModelByOperateType();
}

function createDefaultModel(): RoleTD.RoleBaseInfo {
  return {
    name: "",
    code: "",
    description: ""
  };
}

function updatedModelByOperateType() {
  const handles: Record<OperateType, () => void> = {
    add: () => {
      model.value = createDefaultModel();
    },
    edit: async () => {
      if (props.rowId) {
        const { data } = await roleApi.getRoleDetail(props.rowId);
        if (data) {
          model.value = data;
        }
      }
    }
  };
  handles[props.operateType]();
}

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
    if (props.operateType === "add") {
      const { code } = await roleApi.createRole(data);
      mutableCode = code;
    } else {
      const { code } = await roleApi.updateRole({ id: props.rowId, ...data });
      mutableCode = code;
      message = "更新成功!";
    }
    if (mutableCode === 200) {
      handleCloseFrame();
      emit("submitted");
      ElMessage.success(message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    endLoading();
  }
}
</script>

<style scoped></style>
