<template>
  <div class="micro-view">
    <component v-if="currentComponent" :is="currentComponent" />
    <div v-else class="not-found">页面不存在或未找到组件</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

const authStore = useAuthStore();

const route = useRoute();

// 引入 views 下所有 vue 文件（和项目中 dynamicRouter 使用的 modules 一致）
const modules = import.meta.glob("@/views/**/*.vue");

const currentComponent = ref<any>(null);

const pagePath = computed(() => {
  return route.path;
});

async function loadComponentByPage(pagePath: string) {
  if (!pagePath) {
    currentComponent.value = null;
    return;
  }

  const page = authStore.flatMenuListGet.find(it => it.path === pagePath);

  if (page) {
    // 优先处理 authStore 中已设置的 component（可能为 import 函数或已解析模块）
    if (page.component) {
      try {
        // 如果是懒加载函数（import 函数），调用它
        if (typeof page.component === "function") {
          const mod = await page.component();
          currentComponent.value = mod.default || mod;
          return;
        }
        // 如果已经是模块或组件，直接使用
        currentComponent.value = page.component.default || page.component;
        return;
      } catch (e) {
        console.error("加载 authStore 中的组件失败:", e);
        // 继续走后续的回退逻辑
      }
    }

    // 回退：按文件路径从当前 views 模块集合中查找
    const candidates = Object.keys(modules);
    const match = candidates.find(
      k => k.endsWith(`/${page.path}.vue`) || k.endsWith(`/${page.path}/index.vue`) || k.endsWith(`/${page.name}.vue`)
    );

    if (match) {
      try {
        const mod = await (modules as any)[match]();
        currentComponent.value = mod.default || mod;
        return;
      } catch (e) {
        console.error("动态加载组件失败:", e);
      }
    }
  }

  // 未找到或加载失败
  currentComponent.value = null;
}

watch(
  pagePath,
  v => {
    loadComponentByPage(v);
  },
  { immediate: true }
);

onMounted(() => {
  loadComponentByPage(pagePath.value);
});
</script>

<style lang="scss" scoped>
.micro-view {
  width: 100%;
  height: 100%;
}
.not-found {
  padding: 16px;
  color: #999999;
}
</style>
