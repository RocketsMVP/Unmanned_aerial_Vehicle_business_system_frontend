// 对话管理模块
declare namespace ChatTD {
  interface ChatBaseInfo {
    id?: string;
    identifier: string; // 唯一标识
    name: string; // 对话名称
    user_id: UserTD.UserItem["id"]; // 对话用户
    agent_code?: AgentTD.AgentItem["code"]; // 对话智能体唯一标识
    group_code?: GroupTD.GroupItem["code"]; // 对话组唯一标识
    image_url?: string; // 对话头像
  }
  interface ChatItem extends MakeRequired<ChatBaseInfo, "id"> {
    created_at: string;
    updated_at: string;
  }
  interface ChatDetailInfo extends ChatItem {
    user: string; // 对话用户
  }
}
