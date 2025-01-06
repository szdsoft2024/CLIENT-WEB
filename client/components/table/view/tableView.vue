<template>
  <!-- 详情 -->
  <el-dialog
    :title="dg.title"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1200, 600]" />
    <!-- 详情信息 -->
    <template v-if="_layView.tabCount === 1">
      <tableViewScr
        v-model:scope="scope"
        :layout="_layView.layout"
        :viewCat="_layView.tabGroup[0].children"
        :oper="oper"
        @handleRowEvent="handleRowEventImp"
        class="app-tabs-sub" />
    </template>
    <template v-else>
      <!-- 页标签 -->
      <el-tabs v-model="dg.actTab">
        <el-tab-pane v-for="viewCat in _layView.tabGroup" :label="$t(viewCat.label)" :name="viewCat.$SZDTabName">
          <tableViewScr
            v-model:scope="scope"
            :layout="_layView.layout"
            :viewCat="viewCat.children"
            :oper="oper"
            @handleRowEvent="handleRowEventImp"
            class="app-tabs-sub" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <template #footer>
      <el-button :disabled="scope.$index === 0" type="primary" icon="ArrowLeft" @click="handleNextPage(-1)">
        {{ $t("上一详情") }}
      </el-button>
      <el-button :disabled="scope.$index >= dg.totalPage - 1" type="primary" icon="ArrowRight" @click="handleNextPage(1)">
        {{ $t("下一详情") }}
      </el-button>
      <el-button type="primary" @click="handleClose">
        {{ $t("关闭") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $t } from "../../../common/utils/globalConfig";
  import { initDataView, initDataViewSubTable } from "../js/tableView";
  import tableViewScr from "./tableViewScr.vue";
  //回调事件
  const emit = defineEmits(["handleRowEvent", "handleNextPage"]);

  const props = defineProps({
    oper: {
      type: Object
    }
  });
  //窗口对象
  const dg = ref({
    open: false,
    title: "详情",
    actTab: "tab0",
    totalPage: 0
  });
  const scope = ref({ row: {}, $index: 0 });
  //获取View布局
  const _layView = ref({});
  //初始化数据
  const callInitData = (lay, row, rowIndex, totalPage) => {
    //初始化数据
    initDataViewSubTable(row, lay);
    scope.value.row = row;
    scope.value.$index = rowIndex;
    dg.value.totalPage = totalPage;
    //初始化
    _layView.value = initDataView(lay, props.oper);
    //打开窗口
    dg.value.open = true;
    if (lay.layout.viewTitle && row[lay.layout.viewTitle]) {
      dg.value.title = $t("详情") + ": " + row[lay.layout.viewTitle];
    } else {
      dg.value.title = $t("详情");
    }
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //关闭窗口
  const handleClose = () => {
    dg.value.open = false;
  };

  //下一页
  const handleNextPage = next => {
    emit("handleNextPage", scope.value.$index + next);
  };

  //关闭详情
  const closeView = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData,
    closeView
  });
</script>
