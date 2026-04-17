<template>
  <el-dialog v-model="visible" :title="title" width="500px" destroy-on-close @close="handleCloseFrame">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="model.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="登录名" prop="login">
        <el-input v-model="model.login" placeholder="请输入登录名" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <div style="display: flex; width: 500px">
          <el-input disabled v-model="model.password" placeholder="字母与数字混合,长度6~20位" />
          <el-button v-if="!passwordflag" style="margin-left: 10px" type="primary" @click="getpassword">{{
            props.operateType == "edit" ? "重置密码" : "随机生成"
          }}</el-button>
          <el-button v-else style="margin-left: 10px" type="primary" @click="copy">复制</el-button>
        </div>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="model.role_id" placeholder="请选择角色">
          <el-option v-for="role in roleOptions" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="model.sex" placeholder="请选择角色">
          <el-option label="男" value="man" />
          <el-option label="女" value="woman" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div class="avatar">
          <img @click="showAvatarDialog = true" :src="model.avatar" @error="handleImageError" class="avatar-preview" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flx-center">
        <el-button @click="handleCloseFrame">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
      </div>
    </template>
  </el-dialog>
  <CropAvatar v-model="showAvatarDialog" @confirm="handleAvatarChange" ref="cropAvatarRef" />
</template>

<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import { ElMessage, type FormRules } from "element-plus";
import { computed, ref, watch } from "vue";
import { useLoading } from "@/hooks/useLoading";
import { cloneDeep } from "lodash-es";
import { roleApi, userApi, baseApi } from "@/api";
import { useElForm, useFormRules } from "@/hooks/common";
import CropAvatar from "./crop-avatar.vue";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
console.log(userStore.userInfo.id);

export type OperateType = "add" | "edit";

interface Props {
  operateType: OperateType;
  rowId?: UserTD.UserBaseInfo["id"];
}

interface Emits {
  (e: "submitted"): void;
}

type RuleKey = keyof Omit<UserTD.UserBaseInfo, "id" | "state">;

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const errorImg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmOWY5Ii8+CiAgICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzMzMyIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+5aS05YOPPC90ZXh0Pgo8L3N2Zz4=";

const visible = defineModel<boolean>("visible", {
  default: false
});

const showAvatarDialog = ref(false);

const { loading, startLoading, endLoading } = useLoading(false);

const { formRef, validate } = useElForm();

const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: "新增用户",
    edit: "编辑用户"
  };
  return titles[props.operateType];
});
const passwordflag = ref(false);
const model = ref<UserTD.UserBaseInfo>(createDefaultModel());

const rules: FormRules<RuleKey> = {
  name: [defaultRequiredRule],
  login: [defaultRequiredRule],
  password: [defaultRequiredRule],
  role_id: [defaultRequiredRule]
};

const roleOptions = ref<any[]>([]);

watch(visible, () => {
  if (visible.value) {
    init();
  }
});

function init() {
  updatedModelByOperateType();
  fetchRoleOptions();
  // fetchDepOptions();
}

function createDefaultModel() {
  return {
    id: undefined,
    name: "",
    login: "",
    password: "",
    role_id: null,
    sex: "man",
    avatar: errorImg
  } as UserTD.UserBaseInfo;
}

function getpassword() {
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "@$!%*?&_";
  const allChars = [...lowerChars, ...upperChars, ...numbers, ...specialChars];

  let generatedPassword = "";
  const charTypes = [lowerChars, upperChars, numbers, specialChars];
  charTypes.forEach(charType => {
    const randomIndex = Math.floor(Math.random() * charType.length);
    generatedPassword += charType[randomIndex];
  });

  for (let i = 4; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    generatedPassword += allChars[randomIndex];
  }

  generatedPassword = generatedPassword
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  model.value.password = generatedPassword;
  passwordflag.value = true;
}

const { toClipboard } = useClipboard();
async function copy() {
  try {
    await toClipboard(model.value.password as string);
    ElMessage.success("复制成功");
  } catch (e) {
    console.error(e);
  }
}
async function fetchRoleOptions() {
  const { data, code }: any = await roleApi.getRoleList({ page: 1, page_size: 999999 });
  if (code === 200) {
    roleOptions.value = data.list;
  }
}

function updatedModelByOperateType() {
  console.log(props.operateType);
  const handles: Record<OperateType, () => void> = {
    add: () => {
      passwordflag.value = false;
      model.value = createDefaultModel();
    },
    edit: async () => {
      if (props.rowId) {
        passwordflag.value = false;
        const { data } = await userApi.getUserDetail(props.rowId as number);
        model.value = data;
        model.value.sex = data?.sex ?? "man";
        model.value.role_id = data?.role_id ?? 0;
        model.value.password = "已设置";
        if (model.value.avatar) {
          model.value.avatar = baseApi.getRenderingUrl(model.value.avatar);
        } else {
          model.value.avatar = errorImg;
        }
      }
    }
  };
  handles[props.operateType]();
}

const cropAvatarRef = ref<InstanceType<typeof CropAvatar>>();

const handleAvatarChange = (newAvatar: string) => (model.value.avatar = newAvatar);

function handleCloseFrame() {
  visible.value = false;
  cropAvatarRef.value?.reset();
}

async function handleSubmit() {
  if (loading.value) return;
  await validate();
  startLoading();
  try {
    let mutableCode: any;
    let message = "添加成功!";
    const data = cloneDeep(model.value);

    // 处理头像上传
    if (data.avatar && data.avatar !== errorImg) {
      // 如果是base64格式的裁剪图片，需要上传
      if (data.avatar.startsWith("data:")) {
        try {
          const uploadedAvatarUrl = await uploadAvatar(data.avatar);
          data.avatar = uploadedAvatarUrl;
        } catch (error) {
          ElMessage.error("头像上传失败");
          return;
        }
      } else {
        // 如果是渲染路径，提取原始路径
        data.avatar = baseApi.stripRenderingUrl(data.avatar);
      }
    } else {
      // 如果没有头像或是默认头像，设为空字符串
      data.avatar = "";
    }

    if (props.operateType === "add") {
      data.password = data.password;
      const { code } = await userApi.createUser(data);
      mutableCode = code;
    } else {
      delete data.role;
      delete data.created_at;
      delete data.updated_at;
      if (data.password === "已设置") {
        delete data.password;
      } else {
        data.password = data.password;
      }
      const { code } = await userApi.updateUser(data);
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

const handleImageError = e => {
  e.target.src = errorImg;
};

// 上传头像函数
const uploadAvatar = async (avatar: string): Promise<string> => {
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const file = dataURLtoFile(avatar, `avatar_${Date.now()}.png`);
  const { data } = await baseApi.uploadFile(file);
  return data.path_encryption;
};
</script>

<style scoped lang="scss">
.avatar {
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
    border: 1px solid #000000;
    border-radius: 50%;
  }
}
</style>
