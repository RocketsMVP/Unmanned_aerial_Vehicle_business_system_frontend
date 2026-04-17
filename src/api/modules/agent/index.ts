import { PORT4, http } from "@/api";
import { ReqPageParams } from "@/api/interface";

/**
 * @name 代理模块
 */
export const agentApi = {
  // 获取智能体广场列表
  getAgentList: (params: ReqPageParams<AgentTD.AgentItem>) => {
    return http.get<AgentTD.AgentItem[]>(PORT4 + `/market`, params);
  },
  // 获取我创建的智能体列表
  getAgentDetail: (params?: ReqPageParams<AgentTD.AgentItem>) => {
    return http.get<AgentTD.AgentItem[]>(PORT4 + `/my`, params);
  },
  // 创建智能体
  createAgent: (params: AgentTD.AgentBaseInfo) => {
    return http.post(PORT4 + `/create`, params);
  },
  // 删除代理
  deleteAgent: (id: AgentTD.AgentItem["id"]) => {
    return http.delete(PORT4 + `/delete`, { id });
  },
  // 代理下拉选择
  getSelectionCode: () => {
    return http.get<Pick<AgentTD.AgentItem, "code" | "name">>(PORT4 + `/selection`);
  },
  // 获取智能体详情
  getAgentDetailById: id => {
    return http.get(PORT4 + `/${id}`);
  }
};
