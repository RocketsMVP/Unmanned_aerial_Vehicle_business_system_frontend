<template>
  <el-dialog v-model="visible" title="裁剪图片" width="680px" class="common-dialog" append-to-body @close="onClose">
    <div class="dialog-content">
      <!-- 上传区域 -->
      <div v-if="!selectedImage" class="upload-area">
        <el-upload
          class="upload-component"
          drag
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="handleFileSelect"
        >
          <el-icon class="upload-icon">
            <UploadFilled />
          </el-icon>
          <div class="upload-text">点击或拖拽上传头像</div>
          <div class="upload-tip">支持 JPG、PNG 格式，建议尺寸不小于 200x200</div>
        </el-upload>
      </div>

      <!-- 裁剪区域 -->
      <div v-else class="crop-area">
        <div class="crop-container">
          <!-- Vue Cropper 组件 -->
          <div class="cropper-wrapper">
            <VueCropper
              ref="cropper"
              :img="selectedImage"
              :info="true"
              :auto-crop="true"
              :auto-crop-width="200"
              :auto-crop-height="200"
              :fixed="true"
              :fixed-number="[1, 1]"
              :round="true"
              :output-size="1"
              :output-type="'png'"
              :can-move="true"
              :can-move-box="true"
              :can-scale="true"
              :center-box="true"
              :high="true"
              :background="true"
              :enlarge="1"
              :mode="'contain'"
              @real-time="handleRealTime"
              @crop-moving="handleRealTime"
              @crop-end="handleRealTime"
              @img-moving="handleRealTime"
              @img-move="handleRealTime"
            ></VueCropper>
          </div>

          <!-- 预览区域 -->
          <div class="preview-area">
            <div class="preview-container">
              <div class="preview-round">
                <img v-if="previewUrl" :src="previewUrl" alt="预览图片" class="preview-image" />
              </div>
            </div>
            <div class="preview-text">预览</div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="crop-controls">
          <el-button @click="rotateLeft" class="control-btn">
            <el-icon><RefreshLeft /></el-icon>
            向左旋转
          </el-button>
          <el-button @click="rotateRight" class="control-btn">
            <el-icon><RefreshRight /></el-icon>
            向右旋转
          </el-button>
          <el-button @click="resetImage" class="control-btn">
            <el-icon><Upload /></el-icon>
            重新上传
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="onCancel" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="onConfirm" class="confirm-btn" :disabled="!selectedImage"> 确认 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { UploadFilled, RefreshLeft, RefreshRight, Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadFile } from "element-plus";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [avatar: string];
}>();

const visible = ref(props.modelValue);
const selectedImage = ref("");
const cropper = ref<InstanceType<typeof VueCropper>>();
const previewUrl = ref("");
let updateTimer: NodeJS.Timeout | null = null;

// 监听外部控制显示隐藏
watch(
  () => props.modelValue,
  newVal => {
    visible.value = newVal;
    if (!newVal) {
      resetState();
    }
  }
);

// 监听内部状态变化
watch(visible, newVal => {
  emit("update:modelValue", newVal);
});

// 处理文件选择
const handleFileSelect = (file: UploadFile) => {
  const isImage = file.raw?.type?.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请选择图片文件！");
    return;
  }

  const isLt5M = (file.raw?.size || 0) / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过 5MB！");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    selectedImage.value = e.target?.result as string;
    // 等待 vue-cropper 组件挂载后初始化预览
    nextTick(() => {
      setTimeout(() => {
        updatePreview();
      }, 100);
    });
  };
  reader.readAsDataURL(file.raw!);
};

// 实时预览回调
const handleRealTime = (data: any) => {
  console.log("实时预览数据:", data);

  // 清除之前的定时器
  if (updateTimer) {
    clearTimeout(updateTimer);
  }

  // 使用防抖来优化更新频率
  updateTimer = setTimeout(() => {
    if (cropper.value) {
      cropper.value.getCropData((cropData: string) => {
        console.log("更新预览:", cropData.substring(0, 50) + "...");
        previewUrl.value = cropData;
      });
    }
  }, 50); // 50ms 防抖
};

// 图片加载完成回调
// const handleImageLoad = () => {
//   console.log("图片加载完成");
//   // 图片加载完成后立即更新预览
//   nextTick(() => {
//     updatePreview();
//   });
// };

// 向左旋转
const rotateLeft = () => {
  if (cropper.value) {
    cropper.value.rotateLeft();
    // 旋转后更新预览
    setTimeout(() => {
      updatePreview();
    }, 100);
  }
};

// 向右旋转
const rotateRight = () => {
  if (cropper.value) {
    cropper.value.rotateRight();
    // 旋转后更新预览
    setTimeout(() => {
      updatePreview();
    }, 100);
  }
};

// 更新预览
const updatePreview = () => {
  if (cropper.value) {
    // 获取圆形裁剪的数据
    cropper.value.getCropData((data: string) => {
      previewUrl.value = data;
    });
  }
};

// 重置图片
const resetImage = () => {
  selectedImage.value = "";
  previewUrl.value = "";
  resetState();
};

// 重置状态
const resetState = () => {
  previewUrl.value = "";
};

const onClose = () => {
  visible.value = false;
};

const onCancel = () => {
  visible.value = false;
};

const onConfirm = () => {
  if (!cropper.value) return;

  // 导出裁剪后的图片
  cropper.value.getCropData((data: string) => {
    emit("confirm", data);
    visible.value = false;
  });
};

defineExpose({
  reset: resetImage
});
</script>

<style lang="scss" scoped>
.dialog-content {
  min-height: 400px;
  padding: 24px;
  .upload-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    .upload-component {
      width: 100%;
      :deep(.el-upload-dragger) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 200px;
        background: #fafafa;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        transition: border-color 0.3s;
        &:hover {
          border-color: #1890ff;
        }
      }
      .upload-icon {
        margin-bottom: 16px;
        font-size: 48px;
        color: #bfbfbf;
      }
      .upload-text {
        margin-bottom: 8px;
        font-size: 16px;
        color: #262626;
      }
      .upload-tip {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }
  .crop-area {
    .crop-container {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
      .cropper-wrapper {
        flex: 1;
        height: 400px;
        overflow: hidden;
        background: #fafafa;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        :deep(.vue-cropper) {
          width: 100%;
          height: 100%;
        }

        /* 尝试让裁剪框显示为圆形 */
        :deep(.cropper-crop-box) {
          border-radius: 50% !important;
        }
        :deep(.cropper-view-box) {
          overflow: hidden;
          border-radius: 50% !important;
        }
      }
      .preview-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 140px;
        .preview-container {
          width: 120px;
          height: 120px;
          overflow: hidden;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 50%;
          .preview-round {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 50%;
            .preview-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            }
          }
        }
        .preview-text {
          margin-top: 12px;
          font-size: 12px;
          color: #8c8c8c;
          text-align: center;
        }
      }
    }
    .crop-controls {
      display: flex;
      gap: 12px;
      justify-content: center;
      .control-btn {
        display: flex;
        gap: 4px;
        align-items: center;
        font-size: 14px;
      }
    }
  }
}
</style>
