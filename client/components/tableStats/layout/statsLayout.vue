<template>
  <el-dialog
    :title="$t('统计分析布局设计')"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1200, 650]" />
    <!-- 页标签信息 -->
    <el-tabs v-model="dg.actTab1" type="border-card">
      <!-- 管理布局 -->
      <el-tab-pane v-if="_lay.layout.report" :label="$t('管理布局')" name="tab1">
        <statsLayoutManger :layList="layList" @stats-refresh-list="handleStatsRefreshList" @stats-select="handleStatsSelect" />
      </el-tab-pane>
      <!-- 更改布局 -->
      <el-tab-pane :label="$t('更改布局')" name="tab2">
        <statsLayoutDes v-model:laySta="laySta" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <szd-button v-if="dg.actTab1 === 'tab2'" label="重置" type="primary" @click="handleReset" />
      <szd-button v-if="dg.actTab1 === 'tab2'" label="应用布局" type="primary" @click="handleConfirm" />
      <szd-button v-if="dg.actTab1 === 'tab2' && _lay.layout.report" label="保存布局" type="primary" @click="handleSavaVar" />
      <szd-button label="关闭" type="primary" @click="handleClose" />
    </template>

    <!-- 保存布局 -->
    <statsLayoutVar ref="refStatsLayoutVar" :lay="_lay" @layout-var="handleLayoutVar" />
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, nextTick, ref } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";
  import { getVarList, saveVariant } from "../../api/statistics";
  import { checkLayData, initDataLayout, setLayVar, setSelData } from "../js/statsLayout";
  import statsLayoutManger from "./statsLayoutManger.vue";
  import statsLayoutDes from "./statsLayoutDes.vue";
  import statsLayoutVar from "./statsLayoutVar.vue";

  //回调事件
  const emit = defineEmits(["update:lay", "layout-ok"]);
  const props = defineProps({
    lay: {
      type: Object
    }
  });
  //子屏幕ref
  const refStatsLayoutVar = ref(); //保存布局
  //窗口对象
  const dg = ref({
    open: false,
    actTab1: "tab1"
  });
  //同步更改的参数-布局
  const _lay = computed({
    get: () => props.lay,
    set: val => {
      emit("update:lay", val);
    }
  });
  //获取后端数据
  const layList = ref([]);
  //过滤规则
  const laySta = ref({
    catsAll: [], //全部字段
    catsDim: [], //维度字段
    catsTar: [] //指标字段
  });

  //初始化数据
  const callInitData = () => {
    nextTick(() => {
      //获取管理布局
      getLayList();
      //设置列的数据
      initDataLayout(_lay, laySta);
      //打开窗口
      dg.value.open = true;
    });
  };

  //获取管理布局清单
  const getLayList = () => {
    layList.value = [];
    if (_lay.value.layout.report) {
      getVarList(_lay.value.layout.report).then(res => {
        if (res.code === 200) {
          layList.value = res.data;
        }
        if (layList.value.length === 0) {
          dg.value.actTab1 = "tab2";
        }
      });
    } else {
      dg.value.actTab1 = "tab2";
    }
  };

  //回调清单刷新
  const handleStatsRefreshList = () => {
    getLayList();
  };

  //选择表格布局
  const handleStatsSelect = obj => {
    setLayVar(_lay, obj);
    emit("layout-ok");
    handleClose();
  };

  //重置布局
  const handleReset = () => {
    laySta.value.catsDim = [];
    laySta.value.catsTar = [];
  };

  //应用布局
  const handleConfirm = () => {
    //检查数据
    if (checkLayData(laySta)) {
      //确认设置
      setSelData(_lay, laySta.value);
      //回调
      emit("layout-ok");
      handleClose();
    }
  };

  //布局保存窗口打开
  const handleSavaVar = () => {
    //检查数据
    if (checkLayData(laySta)) {
      refStatsLayoutVar.value.callInitData();
    }
  };

  //保存和应用布局
  const handleLayoutVar = varObj => {
    //设置变式代码和名称
    _lay.value.layout.$SZDVar = {
      variant: varObj.variant ? varObj.variant : "",
      varName: varObj.varName ? varObj.varName : "",
      varMode: varObj.varMode ? varObj.varMode : "",
      varDefault: varObj.varDefault,
      userId: _lay.value.layout.$SZDUserId
    };
    //确认设置
    setSelData(_lay, laySta.value);
    //保存数据到数据库
    savaLayoutData(varObj);
    //回调
    emit("layout-ok");
    handleClose();
  };

  //保存布局
  const savaLayoutData = varObj => {
    let json = {
      report: _lay.value.layout.report,
      variant: varObj.variant, //变式代码
      varName: varObj.varName, //变式名称
      varMode: varObj.varMode, //变式级别
      varDefault: varObj.varDefault, //默认变式
      //仅存配置信息-不存其它数据
      varJson: JSON.stringify({
        catsDim: laySta.value.catsDim, //维度字段
        catsTar: laySta.value.catsTar //指标字段
      })
    };
    //保存数据
    saveVariant(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S001"); //保存成功
        handleClose();
      }
    });
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
