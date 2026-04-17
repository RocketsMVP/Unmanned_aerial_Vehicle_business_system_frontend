<template>
  <el-form
    ref="loginFormRef"
    class="loginform"
    label-width="70px"
    label-position="left"
    hide-required-asterisk
    :model="loginForm"
    :rules="loginRules"
    size="large"
  >
    <el-form-item prop="login" label="用户名">
      <el-input v-model="loginForm.login" placeholder="请输入用户名">
        <template #prefix>
          <img src="@/assets/images/login/user.png" class="icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password autocomplete="new-password">
        <template #prefix>
          <img src="@/assets/images/login/password.png" class="icon" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="captcha" class="captcha" label-width="0px">
      <el-input v-model="loginForm.captcha" :maxlength="captchaLength" placeholder="请输入图形验证码">
        <template #prefix>
          <img src="@/assets/images/login/vcode.png" class="icon" />
        </template>
        <template #append>
          <img class="captcha" :src="captchaUrl" @click="getCaptcha" />
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button
      :icon="UserFilled"
      native-type="submit"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="login(loginFormRef)"
    >
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
// import { getTimeState } from "@/utils";
// import { ElMessage, ElNotification } from "element-plus";
import { loginApi } from "@/api";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  login: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const captchaUrl = ref("");
const captchaLength = ref(4);
const loginForm = reactive<LoginTD.ReqLoginForm>({
  login: "admin",
  password: "lroa@1234",
  captcha_id: "",
  captcha: ""
});

async function getCaptcha() {
  const { data, code } = await loginApi.getCaptcha();
  if (code === 200) {
    loginForm.captcha_id = data.captcha_id;
    loginForm.captcha = "";
    captchaLength.value = data.captcha_length;
    captchaUrl.value = data.pic_path;
  }
}
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi.login({ ...loginForm });
      if (!data) {
        getCaptcha();
        return;
      }
      userStore.setToken(data);
      // 1.1 获取用户信息
      await userStore.getUserInfo();

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      // 4.跳转到首页
      router.push(HOME_URL);
    } catch (e) {
      getCaptcha();
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  getCaptcha();
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

onBeforeUnmount(() => {
  document.onkeydown = null;
});
</script>

<style scoped lang="scss">
@use "../index";
</style>

<style lang="scss">
.loginform {
  .el-input__wrapper {
    background: rgb(0 0 0 / 15%);
    border-radius: 30px;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 10%);
  }
  .el-form-item__error {
    color: #ff4c4c;
  }
  .el-form-item__label {
    font-family: MiSans-Medium;
    font-size: 16px;
    font-weight: 500;
    color: #34495e;
  }
  .el-input__inner {
    font-size: 12px;
    color: #34495e;
  }
  .el-input__inner::placeholder {
    font-weight: 300;
    color: #34495e;
  }
  .el-input__password {
    color: #34495e;
  }
  .captcha {
    .el-input-group__append {
      padding: 0;
      margin: 0 10px;
    }
  }
}
</style>
