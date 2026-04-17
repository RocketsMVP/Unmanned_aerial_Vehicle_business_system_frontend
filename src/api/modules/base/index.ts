import { http } from "@/api/request";
import { PORT6, getRenderingUrl, stripRenderingUrl } from "@/api/config";

/**
 * @name 基础模块
 */

// 基础模块不定基础路径

export const baseApi = {
  // 文件上传
  uploadFile: (file: File) => {
    return http.post(
      `${PORT6}/upload`,
      { file },
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  // 获取文件渲染路径
  getRenderingUrl: url => {
    return getRenderingUrl(url);
  },
  // 从渲染地址中提取后端原始资源路径
  stripRenderingUrl: url => {
    return stripRenderingUrl(url);
  }
};
