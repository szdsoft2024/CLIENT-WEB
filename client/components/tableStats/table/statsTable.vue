<template>
  <el-dialog
    :title="$t('统计分析')"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container dialog-table"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1200, 650]" />
    <!-- 输出数据 -->
    <szd-table
      :layout="_lay.layout"
      :toolbar="_lay.toolbar"
      :fieldCat="_lay.fieldCat"
      :sortRule="_lay.sortRule"
      v-model:data="dataObj"
      border
      stripe
      @handleEvent="handleEvent" />
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $t } from "../../../common/utils/globalConfig";
  import { initStatsTableLay } from "../js/statsTable";
  //回调事件
  const emit = defineEmits(["table-layout"]);
  const props = defineProps({
    lay: {
      type: Object
    }
  });
  //窗口对象
  const dg = ref({
    open: false
  });
  //同步更改的参数-布局
  const _lay = computed(() => {
    return initStatsTableLay(props.lay);
  });
  //数据对象
  const dataObj = ref([]);
  //初始化数据
  const callInitData = statsObj => {
    //数据赋值
    dataObj.value = statsObj;
    //打开窗口
    dg.value.open = true;
  };

  const handleClose = () => {
    dg.value.open = false;
  };

  //表单回调事件
  const handleEvent = obj => {
    if (obj.fCode === "statistics") {
      emit("table-layout");
    }
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>
