<!-- 📚📚📚 Pro-Table 文档: https://juejin.cn/post/7166068828202336263 -->

<template>
  <div class="pro-table-warp">
    <div class="card" v-if="searchColumns.length">
      <slot name="prefix"></slot>
      <!-- 查询表单 -->
      <ZyfDtSearchForm
        v-show="isShowSearch"
        :search="_search"
        :reset="_reset"
        :columns="searchColumns"
        :search-param="searchParam"
        :search-col="searchCol"
      >
        <template #searchParamButton><slot name="searchParamButton"></slot></template>
        <!-- <slot name="searchParamButton">测</slot> -->
      </ZyfDtSearchForm>
    </div>
    <!-- 表格tab选项 -->
    <slot name="table-tab-header"></slot>
    <!-- 表格外层 包含tree -->
    <div class="tree-table-wrap">
      <!-- 树形菜单 插槽 -->
      <slot name="treeProps"></slot>
      <!-- 表格主体 -->
      <div class="table-main" :class="{ card: useCardTable }">
        <!-- 表格头部 操作按钮 -->
        <div class="table-header">
          <div class="header-button-lf">
            <slot
              name="tableHeader"
              :selected-list="selectedList"
              :selected-list-ids="selectedListIds"
              :is-selected="isSelected"
            />
          </div>
          <div v-if="toolButton" class="header-button-ri">
            <slot name="toolButton">
              <el-button v-if="showToolButton('refresh')" :icon="Refresh" circle @click="getTableList" />
              <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" circle @click="openColSetting" />
              <el-button
                v-if="showToolButton('search') && searchColumns?.length"
                :icon="Search"
                circle
                @click="isShowSearch = !isShowSearch"
              />
            </slot>
          </div>
        </div>
        <!-- 表格主体 -->
        <el-table
          v-if="!useCustomTable"
          ref="tableRef"
          v-bind="$attrs"
          :data="processTableData"
          :border="border"
          :row-key="rowKey"
          @selection-change="selectionChange"
        >
          <!-- 默认插槽 -->
          <slot />
          <template v-for="item in tableColumns" :key="item">
            <!-- selection || radio || index || expand || sort -->
            <el-table-column
              v-if="item.type && columnTypes.includes(item.type)"
              v-bind="item"
              :align="item.align ?? 'center'"
              :reserve-selection="item.type == 'selection'"
            >
              <template #default="scope">
                <!-- expand -->
                <template v-if="item.type == 'expand'">
                  <component :is="item.render" v-bind="scope" v-if="item.render" />
                  <slot v-else :name="item.type" v-bind="scope" />
                </template>
                <template v-if="item.type == 'index'">
                  <span>{{ (pageable.page - 1) * pageable.page_size + scope.$index + 1 }}</span>
                </template>
                <!-- radio -->
                <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey]">
                  <i></i>
                </el-radio>
                <!-- sort -->
                <el-tag v-if="item.type == 'sort'" class="move">
                  <el-icon>
                    <DCaret />
                  </el-icon>
                </el-tag>
              </template>
            </el-table-column>
            <!-- other -->
            <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
              <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                <slot :name="slot" v-bind="scope" />
              </template>
            </TableColumn>
          </template>
          <!-- 插入表格最后一行之后的插槽 -->
          <template #append>
            <slot name="append" />
          </template>
          <!-- 无数据 -->
          <template #empty>
            <div class="table-empty">
              <ZyfDtEmpty :title="emptytitle" />
            </div>
          </template>
        </el-table>
        <!-- 自定义表格 -->
        <div v-else :style="customStyle">
          <el-scrollbar v-if="data?.length || tableData?.length" height="100%">
            <slot :data="data ?? tableData" />
          </el-scrollbar>
          <div v-else class="wh-full">
            <ZyfDtEmpty />
          </div>
        </div>
        <!-- 分页组件 -->
        <slot name="pagination">
          <Pagination
            v-if="pagination"
            :pageable="pageable"
            :handle-size-change="handleSizeChange"
            :handle-current-change="handleCurrentChange"
          />
        </slot>
      </div>
    </div>
    <!-- 列设置 -->
    <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
  </div>
</template>

<script setup lang="ts" name="ProTable">
import { ref, watch, provide, onMounted, unref, computed } from "vue";
import { ElTable } from "element-plus";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { BreakPoint } from "../ZyfDtGrid/interface";
import { ColumnProps, TypeProps } from "../ZyfDtProTable/interface";
import { cloneDeep, isEqual } from "lodash-es";
import { Refresh, Operation, Search } from "@element-plus/icons-vue";
import { handleProp } from "@/utils";
import ZyfDtSearchForm from "../ZyfDtSearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import ZyfDtEmpty from "../ZyfDtEmpty/index.vue";

export interface ProTableProps {
  useCustomTable?: boolean; // 是否使用表格  如果为true  则使用插槽的方式传入自定义表格渲染方式
  useCardTable?: boolean; // 是否启用卡片样式
  customStyle?: string;
  columns: ColumnProps[]; // 列配置项  ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题 ==> 非必传
  emptytitle?: string; // 表格数据为空标题 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: ("refresh" | "setting" | "search")[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  useCustomTable: false,
  useCardTable: true,
  customStyle: "",
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  toolButton: false,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});

// table 实例
const tableRef = ref<InstanceType<typeof ElTable>>();

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

// 是否显示搜索模块
const isShowSearch = ref(true);

// 控制 ToolButton 显示
const showToolButton = (key: "refresh" | "setting" | "search") => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

// 单选值
const radio = ref("");

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const { tableData, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  props.requestAuto && getTableList();
  props.data && (pageable.value.total = props.data.length);
});

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value;
  if (!props.pagination) return props.data;
  return props.data.slice((pageable.value.page - 1) * pageable.value.page_size, pageable.value.page_size * pageable.value.page);
});

// 监听页面 initParam 改化，重新获取表格数据
let _tempInitParam: any = {};
watch(
  () => props.initParam,
  () => {
    !isEqual(props.initParam, _tempInitParam) && getTableList();
    _tempInitParam = props.initParam;
  },
  { deep: true }
);

// 只有是px或者数字的返回值,其他全部是0
const handlePx = (val: string | number | undefined) => {
  // ts 不是强制类型，所以需要判断一下
  if ((typeof val !== "number" && typeof val !== "string") || !val) return 0;
  if (typeof val === "number") return val;
  if (!val.includes("px")) return 0;
  return Number(val.replace("px", ""));
};
// 处理表格列

// 处理表格的minWidth
const _handleColumnMinWidth = (columns: ColumnProps[]): { minWidth: number; column: ColumnProps[] } => {
  if (props.columns.length === 0) return { minWidth: 0, column: [] };
  let minWidth = 0;
  const column = cloneDeep(columns).map(item => {
    if (item?._children && item?._children?.length > 0) {
      const { minWidth: childMinWidth, column: childColumn } = _handleColumnMinWidth(item._children);
      item.minWidth = item.minWidth || item.width || childMinWidth;
      item._children = childColumn;
    }
    if (item.type === "selection") {
      item.width = item.width || 40;
    }
    let curentMinWidth = 30 + (item?.label?.length || 0) * 15;
    // 优先使用minWidth，其次使用width，最后使用默认值 不干预用户设置的宽度
    item.minWidth = item.minWidth || item.width || curentMinWidth;

    let itemWidth = handlePx(item?.width);
    let itemMinWidth = handlePx(item?.minWidth);
    // element 优先使用width，其次使用minWidth
    // minWidth += Math.max(itemMinWidth, itemWidth, curentMinWidth);
    minWidth += itemWidth || itemMinWidth || curentMinWidth;
    return item;
  });
  return { minWidth, column };
};

// 接收 columns 并设置为响应式
let tableColumns = computed(() => _handleColumnMinWidth(props.columns).column);

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns.value));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") return enumMap.value.set(prop!, unref(enumValue!));

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue();
  enumMap.value.set(prop!, data);
};

// 注入 enumMap
provide("enumMap", enumMap);

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search?.order ?? index + 2;
  const key = column.search?.key ?? handleProp(column.prop!);
  const defaultValue = column.search?.defaultValue;
  if (defaultValue !== undefined && defaultValue !== null) {
    searchInitParam.value[key] = defaultValue;
    searchParam.value[key] = defaultValue;
  }
});

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns!.value.filter(item => {
  const { type, prop, isShow } = item;
  return !columnTypes.includes(type!) && prop !== "operation" && isShow;
});
const openColSetting = () => colRef.value.openColSetting();

// 定义 emit 事件
const emit = defineEmits<{
  search: [];
  reset: [];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
}>();

const _search = () => {
  search();
  emit("search");
};

const _reset = () => {
  reset();
  emit("reset");
};

// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: processTableData,
  radio,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds
});
</script>

<style scoped lang="scss">
.pro-table-warp {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  .tree-table-wrap {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
