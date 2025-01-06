<template>
  <!-- 管理布局 -->
  <el-dialog
    :title="$t('管理布局')"
    v-model="dg.open"
    append-to-body
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1200, 600]" />
    <!-- 页标签信息 -->
    <el-tabs v-model="dg.actTab1" type="border-card">
      <!-- 管理布局 -->
      <el-tab-pane v-if="_lay.layout.report" :label="$t('管理布局')" name="tab1">
        <tableLayoutManger
          ref="refTableLayoutManger"
          :layList="layList"
          @layout-refresh-list="handleLayoutRefreshList"
          @layout-select="handleLayoutSelect" />
      </el-tab-pane>
      <!-- 更改布局 -->
      <el-tab-pane :label="$t('更改布局')" name="tab2">
        <el-tabs v-model="dg.actTab2">
          <!-- 显示的列 -->
          <el-tab-pane :label="$t('显示的列')" name="tab21">
            <tableLayoutColumn ref="refTableLayoutColumn" :lay="_lay" v-model:colCat="colCat" />
          </el-tab-pane>
          <!-- 排序小计 -->
          <el-tab-pane :label="$t('排序规则')" name="tab22" v-if="_lay.layout.sort !== '0'">
            <tableLayoutSort ref="refTableLayoutSort" v-model:sortObj="sortObj" />
          </el-tab-pane>
          <!-- 数据过滤 -->
          <el-tab-pane :label="$t('数据过滤')" name="tab23" v-if="_lay.layout.filter">
            <tableLayoutFilter ref="refTableLayoutFilter" v-model:filterObj="filterObj" />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button v-if="dg.actTab1 === 'tab2' && (dg.actTab2 === 'tab22' || dg.actTab2 === 'tab23')" type="primary" @click="handleReset">
        {{ $t("重置") }}
      </el-button>
      <el-button v-if="dg.actTab1 === 'tab2'" type="primary" @click="handleConfirm">
        {{ $t("应用布局") }}
      </el-button>
      <el-button v-if="dg.actTab1 === 'tab2' && _lay.layout.report" type="primary" @click="handleSavaVar">
        {{ $t("保存布局") }}
      </el-button>
      <el-button type="primary" @click="handleClose">
        {{ $t("关闭") }}
      </el-button>
    </template>
    <!-- 保存布局 -->
    <tableLayoutVar ref="refTableLayoutVar" :lay="_lay" @layout-var="handleLayoutVar" />
  </el-dialog>
</template>

<script setup>
  import { computed, defineEmits, defineExpose, defineProps, ref } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";
  import tableLayoutManger from "./tableLayoutManger.vue";
  import tableLayoutColumn from "./tableLayoutColumn.vue";
  import tableLayoutSort from "./tableLayoutSort.vue";
  import tableLayoutFilter from "./tableLayoutFilter.vue";
  import tableLayoutVar from "./tableLayoutVar.vue";
  import { initDataLayout, setLayVar, setSelData } from "../js/tableLayout";
  import { getVarList, saveVariant } from "../../api/table";
  //回调事件
  const emit = defineEmits(["update:lay", "layout-ok"]);
  const props = defineProps({
    lay: {
      type: Object
    }
  });
  //子屏幕ref
  const refTableLayoutVar = ref(); //保存布局
  //窗口对象
  const dg = ref({
    open: false,
    actTab1: "tab1",
    actTab2: "tab21"
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
    //获取管理布局
    getLayList();
    //初始化数据-Layout
    initDataLayout(_lay, colCat, sortObj, filterObj);
    //打开窗口
    dg.value.open = true;
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
  const handleLayoutRefreshList = () => {
    getLayList();
  };

  //选择表格布局
  const handleLayoutSelect = obj => {
    setLayVar(_lay, obj);
    emit("layout-ok");
    handleClose();
  };

  //重置布局
  const handleReset = () => {
    if (dg.value.actTab2 === "tab22") {
      sortObj.value.rule = [];
      sortObj.value.cats.forEach(item => {
        item.show = true;
      });
    } else if (dg.value.actTab2 === "tab23") {
      filterObj.value.catsSel = [];
      filterObj.value.fRanges = {};
      filterObj.value.catsAll.forEach(item => {
        item.show = true;
      });
    }
  };

  //应用布局
  const handleConfirm = () => {
    //选择数据赋值
    setSelData(_lay, colCat.value, sortObj.value.rule, filterObj.value.fRanges);
    //回调
    emit("layout-ok");
    handleClose();
  };

  //布局保存窗口打开
  const handleSavaVar = () => {
    refTableLayoutVar.value.callInitData();
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
    //选择数据赋值
    setSelData(_lay, colCat.value, sortObj.value.rule, filterObj.value.fRanges);
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
        fCatCol: colCat.value, //列目录数组
        sortRule: sortObj.value.rule, //排序规则
        fRanges: filterObj.value.fRanges //过滤数据
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
