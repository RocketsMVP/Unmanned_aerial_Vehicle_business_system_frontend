<template>
  <div class="year-picker-box">
    <el-date-picker
      ref="startPickerRef"
      :size="size"
      v-model="startValue"
      :clearable="clearable"
      type="year"
      format="YYYY"
      value-format="YYYY"
      :placeholder="startPlaceholder"
      @change="handleStartDateChange"
      @visible-change="handleStartPickerVisibleChange"
    />
    <span>{{ rangeText }}</span>
    <el-date-picker
      ref="endPickerRef"
      :size="size"
      v-model="endValue"
      type="year"
      format="YYYY"
      value-format="YYYY"
      :clearable="false"
      :placeholder="endPlaceholder"
      :disabled-date="disabledEndDate"
      @change="handleEndDateChange"
      @visible-change="handleEndPickerVisibleChange"
    />
  </div>
</template>

<script setup lang="ts" name="YearPicker">
import { ref, watch } from "vue";
import { type ElDatePicker } from "element-plus";
interface Props {
  size: "small" | "mini" | "medium" | "large";
  startPlaceholder: string;
  endPlaceholder: string;
  rangeText: string;
  clearable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  startPlaceholder: "开始时间",
  endPlaceholder: "结束时间",
  rangeText: "至",
  clearable: false
});

const modelValue = defineModel<string[]>("modelValue", {
  default: () => []
});
const startValue = ref<string>("");
const endValue = ref<string>("");

watch(
  modelValue,
  newVal => {
    setValue(newVal);
  },
  {
    immediate: true
  }
);

function setValue(value: string[]) {
  if (value && value.length === 2) {
    startValue.value = value[0];
    endValue.value = value[1];
  } else {
    startValue.value = "";
    endValue.value = "";
  }
}

const startPickerRef = ref<InstanceType<typeof ElDatePicker>>();
const endPickerRef = ref<InstanceType<typeof ElDatePicker>>();

// 开始时间发生变化
function handleStartPickerVisibleChange(val: boolean) {
  if (!val && startValue.value) {
    endPickerRef.value!.focus();
  }
}
function handleStartDateChange(val: string) {
  endValue.value = "";
  startValue.value = val;
  if (!val) {
    modelValue.value = [];
  }
}
// 处理结束时间
function handleEndPickerVisibleChange(val: boolean) {
  if (val && !startValue.value) {
    startPickerRef.value?.focus();
    return false;
  }
  if (!val && !endValue.value) {
    setValue(modelValue.value);
  }
}

function disabledEndDate(val: Date) {
  return new Date(val).getUTCFullYear() < Number(startValue.value);
}

function handleEndDateChange() {
  modelValue.value = [startValue.value, endValue.value];
}
</script>
<style scoped lang="scss">
.year-picker-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  span {
    margin: 0 10px;
  }
}
</style>
