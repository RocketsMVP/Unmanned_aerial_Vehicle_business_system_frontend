import { http } from "@/api/request";
import { PORT5, PORT7, getRenderingUrl, joinServerUrl } from "@/api/config";
import { ReqPageParams } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

/**
 * @name 对话模块
 */
export const chatApi = {
  // 获取对话列表
  getChatList: (params: ReqPageParams<ChatTD.ChatItem>) => {
    return http.get<ChatTD.ChatItem[]>(PORT5 + `/list`, params);
  },
  // 获取对话详情
  getChatDetail: (identifier: ChatTD.ChatItem["identifier"]) => {
    return http.get<ChatTD.ChatItem>(PORT5 + `/message`, { order: identifier });
  },
  // 删除对话
  deleteChat: (id: ChatTD.ChatItem["id"]) => {
    return http.delete(PORT5 + `/delete`, { id });
  },
  //进行对话
  postChat: params => {
    const userStore = useUserStore();
    return {
      url: joinServerUrl(`${PORT7}/chat`),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "lroa-token": userStore.token
        },
        body: JSON.stringify(params)
      }
    };
  },
  //获取标题
  getChatTitle: params => {
    return http.post(PORT7 + `/title`, params);
  },
  // 文件上传
  uploadFile: (file: File) => {
    return http.post(
      ` /document/upload`,
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
  //删除对话条目
  deleteChatItem: id => {
    return http.delete(PORT5 + `/delete-message`, { identifier: id });
  }
};
