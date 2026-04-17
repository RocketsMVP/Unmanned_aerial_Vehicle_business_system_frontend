<template>
  <el-config-provider :locale="zhCn" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "@/hooks/useTheme";
import { ElConfigProvider } from "element-plus";
import { useGlobalStore } from "@/stores/modules/global";
import { useUserStore } from "@/stores/modules/user";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const globalStore = useGlobalStore();

const { initTheme } = useTheme();
const userStore = useUserStore();

// 初始化文字
const i18n = useI18n();
onMounted(() => {
  i18n.locale.value = "zh";
  if (userStore.token) {
    userStore.getUserInfo();
  } else {
    initTheme();
  }
});

// 标签尺寸
const assemblySize = computed(() => globalStore.assemblySize);

// 按钮配置
const buttonConfig = reactive({ autoInsertSpace: false });
</script>
