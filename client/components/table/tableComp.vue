<template>
  <div class="app-sub-container app-sub-sub szd__tb__wrapper drag-area">
    <!--  输出表格  -->
    <el-table
      ref="refTable"
      :data="_dataObj"
      :row-style="handleRowStyle"
      :cell-style="handleCellStyle"
      :header-cell-class-name="handleHeaderCellClassName"
      :show-summary="_lay.layout.showSummary"
      :summary-method="handleSummaryMethod"
      :span-method="handleSpanMethod"
      @sort-change="handleSortChange"
      v-bind="$attrs"
      :row-key="_lay.layout.rowKey"
      :key="tableKey"
      height="100%"
      class="flex-1">
      <!-- 拖动手柄 -->
      <el-table-column v-if="_lay.layout.dragRow" label="" align="center" width="36" fixed="left">
        <template #default="scope">
          <div class="main-drag-handle">
            <el-icon>
              <Sort />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <!-- 指示灯 -->
      <el-table-column v-if="_lay.layout.light" label="" align="center" width="36" fixed="left">
        <template #default="scope">
          <szd-svg name="circle" v-if="scope.row[_lay.layout.light] == '1'" style="font-size: 14px; color: #f54f4f" />
          <szd-svg name="circle" v-else-if="scope.row[_lay.layout.light] == '2'" style="font-size: 14px; color: #ffd70b" />
          <szd-svg name="circle" v-else-if="scope.row[_lay.layout.light] == '3'" style="font-size: 14px; color: #5cc22d" />
          <szd-svg name="circle" v-else style="font-size: 14px; color: #909399" />
        </template>
      </el-table-column>
      <!-- 详情 -->
      <el-table-column v-if="_lay.layout.viewMode !== '0'" label="" align="center" width="36" fixed="left">
        <template #default="scope">
          <el-button type="primary" link icon="View" @click="handleRowView(scope.row, scope.$index)" />
        </template>
      </el-table-column>
      <!-- 复选框 -->
      <el-table-column
        v-if="_lay.layout.selection !== '0'"
        type="selection"
        align="center"
        width="50"
        :fixed="_lay.layout.selection === '2' ? 'left' : false" />
      <!-- 输出列 -->
      <template v-for="fCat in _lay.fCatCol">
        <tableCompColumn :layout="_lay.layout" :layFCat="fCat" @handleRowEvent="handleRowEventImp" />
      </template>
    </el-table>
    <!--  详情  -->
    <tableView ref="refTableView" :oper="oper" @handleRowEvent="handleRowEventImp" @handleNextPage="handleNextPageImp" />
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, ref, defineExpose, computed, getCurrentInstance, onMounted, nextTick, watch } from "vue";
  import { dataAdd, dataCopy, dataDel, dataSum } from "./js/tableFunc";
  import { dataSortFilter } from "./js/tableFuncSortFilter";
  import Sortable from "sortablejs";
  import tableCompColumn from "./tableCompColumn.vue";
  import tableView from "./view/tableView.vue";

  const { proxy } = getCurrentInstance();
  //回调事件
  const emit = defineEmits([
    "update:lay",
    "update:dataObj",
    "update:tParObj",
    "handleRequest",
    "handleEvent",
    "handleRowEvent",
    "row-style",
    "cell-style"
  ]);

  const props = defineProps({
    lay: {
      type: Object
    },
    dataObj: {
      type: Array
    },
    tParObj: {
      type: Object
    },
    oper: {
      type: Object
    }
  });
  //表格
  const refTable = ref();
  const refTableView = ref();
  const tableKey = ref("1");
  //表格布局
  const _lay = computed({
    get: () => props.lay,
    set: val => {
      emit("update:lay", val);
    }
  });
  //表格数据
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });
  //表格参数
  const _tParObj = computed({
    get: () => props.tParObj,
    set: val => {
      emit("update:tParObj", val);
    }
  });

  //加载数据
  onMounted(() => {
    dragRow();
  });
  watch(
    () => tableKey.value,
    () => {
      dragRow();
    }
  );

  //table事件-样式事件-设置行样式，与斑马线冲突stripe
  const handleRowStyle = obj => {
    const layout = _lay.value.layout;
    if (obj.row.$SZDRowHide) {
      return { display: "none" };
    }
    if (layout.styleRow) {
      if (obj.row[layout.styleRow]) {
        return obj.row[layout.styleRow];
      } else {
        emit("row-style", obj);
      }
    }
  };
  //table事件-样式事件-设置单元格
  const handleCellStyle = obj => {
    const layout = _lay.value.layout;
    if (layout.styleCell) {
      if (obj.row[layout.styleCell]) {
        if (obj.column.property && obj.row[layout.styleCell][obj.column.property]) {
          return obj.row[layout.styleCell][obj.column.property];
        }
      } else {
        emit("cell-style", obj);
      }
    }
  };
  //table事件-列头排序图标
  const handleHeaderCellClassName = ({ column }) => {
    if (column.sortable !== "custom") return;
    const l_rule = _lay.value.sortRule.find(item => item.field === column.property);
    if (l_rule && l_rule.order !== null) {
      column.order = l_rule.order;
    } else {
      column.order = null;
    }
  };
  //table事件-排序事件
  const handleSortChange = ({ order, prop }) => {
    const l_index = _lay.value.sortRule.findIndex(item => item.field === prop);
    if (l_index !== -1) {
      _lay.value.sortRule.splice(l_index, 1);
    }
    if (order === "ascending" || order === "descending") {
      _lay.value.sortRule.push({ field: prop, order: order });
    }
    //排序方法调用 2.后端请求
    if (_lay.value.layout.sort === "2") {
      emit("handleRequest");
    } else {
      dataSortFilter(_dataObj, _lay, _tParObj);
    }
    tableKey.value = tableKey.value + 1;
  };

  //table事件-汇总合计行
  const handleSummaryMethod = obj => {
    return dataSum(obj, _lay.value.fCatCol);
  };

  //合并行
  const handleSpanMethod = ({ rowIndex, column }) => {
    if (_lay.value.layout.merge !== "1" && _lay.value.layout.merge !== "2" && _lay.value.sortRule.length === 0) return;
    if (_tParObj.value.merge[column.property] && _tParObj.value.merge[column.property].length > 0) {
      const merge = _tParObj.value.merge[column.property].find(item => item.rowIndex === rowIndex);
      if (merge) {
        return {
          rowspan: merge.rowspan,
          colspan: merge.colspan
        };
      }
    }
  };

  //详情信息
  const handleRowView = (row, rowIndex) => {
    refTableView.value.callInitData(_lay.value, row, rowIndex, _dataObj.value.length);
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //上一页 下一页
  const handleNextPageImp = rowIndex => {
    handleRowView(_dataObj.value[rowIndex], rowIndex);
  };

  //行拖拽
  const dragRow = () => {
    if (_lay.value.layout.dragRow) {
      nextTick(() => {
        const tbody = document.querySelector(".drag-area .el-table__body-wrapper tbody");
        Sortable.create(tbody, {
          animation: 300,
          draggable: ".el-table__row",
          handle: ".main-drag-handle",
          onEnd: ({ newIndex, oldIndex }) => {
            if (newIndex !== oldIndex) {
              const movedItem = _dataObj.value.splice(oldIndex, 1)[0];
              _dataObj.value.splice(newIndex, 0, movedItem);
            }
          }
        });
      });
    }
  };

  //工具栏按钮-点击事件
  const handleClickToolbar = obj => {
    switch (obj.fCode) {
      case "$add":
        handleEventImp("$add", dataAdd(_dataObj, _lay.value.fCatUse));
        break;
      case "$copy":
        handleEventImp("$copy", dataCopy(_dataObj, refTable));
        break;
      case "$del":
        handleEventImp("$del", dataDel(_dataObj, refTable));
        break;
      case "$layout":
        tableKey.value = tableKey.value + 1;
        break;
      case "$filter":
        tableKey.value = tableKey.value + 1;
        break;
    }
  };

  //按钮回调事件
  const handleEventImp = (fCode, obj) => {
    if (obj) {
      obj["fCode"] = fCode;
      emit("handleEvent", obj);
    }
  };

  //定义父组件可用方法
  const getRef = () => {
    return refTable.value;
  };

  //关闭详情
  const closeView = () => {
    refTableView.value.closeView();
  };

  //定义父组件可用方法
  defineExpose({
    handleClickToolbar,
    getRef,
    closeView
  });
</script>
<style scoped>
  :deep(.el-table__header) {
    width: 100% !important;
  }

  :deep(.el-table__body) {
    width: 100% !important;
  }
</style>
