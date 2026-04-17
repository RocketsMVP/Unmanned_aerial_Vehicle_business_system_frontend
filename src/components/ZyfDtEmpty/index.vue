<!--
 * @Author: guoke scc15599065860@163.com
 * @Date: 2024-04-29 13:32:44
 * @LastEditors: guoke scc15599065860@163.com
 * @LastEditTime: 2024-04-29 14:40:45
 * @FilePath: \CIM_Management_Platform\src\components\Empty\index.vue
 * @Description: 
-->
<template>
  <div ref="emptyRef" class="empty-box flx-center" :style="{ width, height }">
    <img src="./img/empty_img.png" alt="" :style="refSize" />
    <p class="title">{{ title }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
const props = defineProps({
  width: {
    type: String,
    default: () => "100%"
  },
  height: {
    type: String,
    default: () => "100%"
  },
  imgStyle: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: "暂无数据"
  }
});
const emptyRef = ref();
const refSize = ref<Record<string, any>>({
  height: "30%"
});
watchEffect(() => {
  if (emptyRef.value) {
    refSize.value =
      emptyRef.value.offsetHeight > emptyRef.value.offsetWidth
        ? { width: "30%" }
        : {
            height: "30%"
          };
  }
});
</script>
<style scoped lang="scss">
@use "./index";
</style>
