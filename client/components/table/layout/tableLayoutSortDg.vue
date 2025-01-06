<template>
  <!-- 管理布局 -->
  <el-dialog
    :title="$t('排序')"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1000, 600]" />
    <!--  排序  -->
    <tableLayoutSort ref="refTableLayoutSort" v-model:sortObj="sortObj" />
    <template #footer>
      <el-button type="primary" @click="handleReset"> {{ $t("重置") }}</el-button>
      <el-button type="primary" @click="handleConfirm"> {{ $t("应用布局") }}</el-button>
      <el-button type="primary" @click="handleClose"> {{ $t("关闭") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $t } from "../../../common/utils/globalConfig";
  import tableLayoutSort from "./tableLayoutSort.vue";
  import { initDataLayout, setSelData } from "../js/tableLayout";
  //回调事件
  const emit = defineEmits(["update:lay", "layout-ok"]);
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
  const _lay = computed({
    get: () => props.lay,
    set: val => {
      emit("update:lay", val);
    }
  });
  //列字段
  const colCat = ref([]);
  //排序规则
  const sortObj = ref({
    cats: [], //排序字段
    rule: [] //排序规则
  });
  //过滤规则
  const filterObj = ref({
    catsAll: [], //全部字段
    catsSel: [], //已选字段
    fRanges: {}
  });

  //初始化数据
  const callInitData = () => {
    //初始化数据-Layout
    initDataLayout(_lay, colCat, sortObj, filterObj);
    //打开窗口
    dg.value.open = true;
  };

  //重置布局
  const handleReset = () => {
    sortObj.value.rule = [];
    sortObj.value.cats.forEach(item => {
      item.show = true;
    });
  };

  //应用布局
  const handleConfirm = () => {
    //选择数据赋值
    setSelData(_lay, colCat.value, sortObj.value.rule, filterObj.value.fRanges);
    //回调
    emit("layout-ok");
    handleClose();
  };

  //关闭窗口
  const handleClose = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>
