<template>
  <div>
    <!--  统计分析表格  -->
    <statsTable ref="refStatsTable" :lay="_lay" @table-layout="handleTableLayout" />
    <!--  统计分析布局  -->
    <statsLayout ref="refStatsLayout" v-model:lay="_lay" @layout-ok="handleLayoutOk" />
  </div>
</template>

<script setup>
  import { defineExpose, ref } from "vue";
  import _ from "lodash";
  import { initStatsLay, initLayVarDef, initLayStats } from "./js/statsParam";
  import { statsData } from "./js/stats";
  import { getVarDef } from "../api/statistics";
  import statsLayout from "./layout/statsLayout.vue";
  import statsTable from "./table/statsTable.vue";

  //子屏幕ref
  const refStatsTable = ref(); //统计分析表格
  const refStatsLayout = ref(); //统计分析布局
  //同步更改的参数-布局
  const _lay = ref(); //布局
  //数据
  const _dataObj = ref();

  //创建统计分析表
  const create = obj => {
    _lay.value = initStatsLay(obj.layout, obj.fieldCat);
    _dataObj.value = _.cloneDeep(obj.data);
    //初始化默认统计分析表格
    if (_lay.value.layout.report) {
      getVarDef(_lay.value.layout.report).then(res => {
        if (res.code === 200 && res.data.varJson) {
          initLayVarDef(_lay, res.data);
        } else {
          initLayStats(_lay, obj.stats);
        }
        createOpen();
      });
    } else {
      initLayStats(_lay, obj.stats);
      createOpen();
    }
  };

  //打开窗口
  const createOpen = () => {
    if (_lay.value.fCatDim.length === 0 && _lay.value.fCatTar.length === 0) {
      handleTableLayout();
    } else {
      handleLayoutOk();
    }
  };

  //布局样式设置
  const handleTableLayout = () => {
    refStatsLayout.value.callInitData();
  };

  //布局样式应用
  const handleLayoutOk = () => {
    //汇总数据
    let statsObj = statsData(_lay, _dataObj);
    refStatsTable.value.callInitData(statsObj);
  };
  //定义父组件可以调用方法
  defineExpose({
    create
  });
</script>
