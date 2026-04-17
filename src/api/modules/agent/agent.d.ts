// 代理管理模块
declare namespace AgentTD {
  interface AgentBaseInfo {
    id?: string | number;
    name: string; // 代理名称
    prompt: string; // 提示词
    code: string; // 代理代码
    temperature: number; // 温度 0-1
    max_tokens: number; // 最大生成长度 整数
    // seed: number; // 随机种子 整数
    top_p: number; // 概率 float
    handoffs: string; // 代理转接
    agent_type: { [key in string]: any }; //  代理类型
    llm_id: string; // 模型 ID
    brief_description: string; // 代理描述
    img_url: string; // 代理图片
    whether_disclose: { [key in string]: any }; // 是否公开
  }
  interface AgentItem extends MakeRequired<AgentBaseInfo, "id"> {
    created_at: string;
    updated_at: string;
    llm_model: { id: string; name: string };
  }
}
