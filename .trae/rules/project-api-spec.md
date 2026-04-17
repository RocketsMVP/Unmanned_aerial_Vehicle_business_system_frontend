# 接口规范

## 文件结构

接口文件按业务模块拆分，类型声明和接口函数分离：

```
api/modules/xxx/
├── xxx.d.ts      # 类型声明
└── xxx.ts        # 接口函数
```

## 类型声明文件 (.d.ts)

```typescript
// worker.d.ts
export interface LaborWorker {
  id?: number;
  name: string;
  idCard: string;
  phone: string;
  gender: number;
  age: number;
  projectId: number;
  teamId: number;
  jobType: string;
  status: number;
}

export interface LaborWorkerQuery {
  pageNum: number;
  pageSize: number;
  name?: string;
  phone?: string;
  idCard?: string;
  projectId?: number;
  teamId?: number;
  status?: number;
}

export interface LaborWorkerListRes {
  list: LaborWorker[];
  total: number;
}
```

## 接口函数文件 (.ts)

```typescript
import { PORT_LABOR, http } from "@/api";
import type { LaborWorker, LaborWorkerQuery, LaborWorkerListRes } from "./worker.d";

export const getWorkerList = (params: LaborWorkerQuery) => {
  return http.get<LaborWorkerListRes>(PORT_LABOR + "/workers", { params });
};

export const getWorkerDetail = (id: number) => {
  return http.get<LaborWorker>(PORT_LABOR + "/workers/" + id);
};

export const addWorker = (data: LaborWorker) => {
  return http.post<any>(PORT_LABOR + "/workers", data);
};

export const updateWorker = (id: number, data: LaborWorker) => {
  return http.put<any>(PORT_LABOR + "/workers/" + id, data);
};

export const deleteWorker = (id: number) => {
  return http.delete<any>(PORT_LABOR + "/workers/" + id);
};
```

## 导入规范

- 使用 `import type` 导入类型
- 使用 `import { PORT1, http }` 导入接口
- PORT1 为接口前缀，在 servicePort.ts 中定义

## 接口示例

```typescript
// 登录接口
login: (params: LoginTD.ReqLoginForm) => {
  return http.post<LoginTD.ResLogin>(PORT1 + "/login", params);
};
```
