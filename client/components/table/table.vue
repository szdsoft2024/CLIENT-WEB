<template>
  <div v-if="dg.open" class="app-sub-container app-sub-sub flex-y flex-1">
    <!--  工具栏  -->
    <tableToolbar v-if="!_lay.tBar.hide" ref="refToolbar" v-model:lay="_lay" :dataObj="_dataObj" @clickToolbar="handleClickToolbar" />
    <!--  输出表格  -->
    <div class="flex-1 ovh">
      <tableComp
        ref="refTableComp"
        v-model:lay="_lay"
        v-model:dataObj="_dataObj"
        v-model:tParObj="_tParObj"
        :oper="_oper"
        @handleRequest="handleRequestImp"
        @handleEvent="handleEventImp"
        @handleRowEvent="handleRowEventImp"
        v-bind="$attrs" />
    </div>
    <szd-pagination
      v-if="_lay.layout.pagination !== '0'"
      :total="_page.total"
      v-model:page="_page.pageNum"
      v-model:limit="_page.pageSize"
      :pageSizes="_page.pageSizes"
      :position="_page.position"
      @pagination="handleRequestImp" />
  </div>
</template>

<script setup>
  import { computed, ref, defineProps, defineEmits, watch, defineExpose, onBeforeMount, nextTick } from "vue";
  import { initTableLay, initLayVarDef } from "./js/tableParam";
  import { initLayAuth, initOper } from "./js/tableParamAuth";
  import { dataSortFilter } from "./js/tableFuncSortFilter";
  import { getVarDef } from "../api/table";
  import tableToolbar from "./tableToolbar.vue";
  import tableComp from "./tableComp.vue";

  const props = defineProps({
    //表格样式
    layout: {
      type: Object,
      default: {}
    },
    //字段目录
    fieldCat: {
      type: Array,
      default: []
    },
    //工具类按钮
    toolbar: {
      type: Object,
      default: {}
    },
    //排序规则 数组[{field,order}]
    sortRule: {
      type: Array,
      default: []
    },
    //输出数据
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    //分页
    page: {
      type: Object,
      default: {}
    },
    //权限对象 {szdopt:操作权限字符,szdkey:主表key字符,szdfst:字段状态对象,szdbtn:按钮状态对象}
    oper: {
      type: Object
    }
  });
  //定义事件
  const emit = defineEmits(["handleRequest", "handleEvent", "handleRowEvent", "update:data", "update:page"]);
  //子屏幕
  const refToolbar = ref();
  const refTableComp = ref();
  //表格布局
  const _lay = ref();
  //表格数据
  const _dataObj = computed({
    get: () => props.data,
    set: val => {
      emit("update:data", val);
    }
  });
  //分页
  const _page = computed({
    get: () => props.page,
    set: val => {
      emit("update:page", val);
    }
  });
  //获取权限对象
  const _oper = computed(() => {
    return initOper(props.oper, _lay);
  });
  //功能参数
  const dg = ref({
    open: false
  });
  //表格处理参数
  const _tParObj = ref({
    filter: false, //执行过过滤
    merge: {} //合并行规则
  });

  //初始化渲染参数
  onBeforeMount(() => {
    _lay.value = initTableLay(props.layout, props.fieldCat, props.toolbar, props.sortRule);
    if (_lay.value.layout.report) {
      initLayDefault();
    } else {
      dg.value.open = true;
    }
  });

  //初始化缺省值
  const initLayDefault = () => {
    getVarDef(_lay.value.layout.report).then(res => {
      if (res.code === 200 && res.data.varJson) {
        initLayVarDef(_lay, res.data);
        //触发后端排序接口
        if (_lay.value.layout.sort === "2" && _lay.value.sortRule.length > 0) {
          handleRequestImp();
        }
      }
      dg.value.open = true;
    });
  };

  //回调数据查询 $request 分页和排序触发请求数据
  const handleRequestImp = () => {
    let obj = { sort: _lay.value.layout.sort === "2" ? _lay.value.sortRule : [] };
    //回调父级
    emit("handleRequest", obj);
  };

  //按钮回调事件
  const handleEventImp = obj => {
    obj["selection"] = refTableComp.value.getRef().getSelectionRows();
    emit("handleEvent", obj);
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };

  //点击工具栏按钮
  const handleClickToolbar = obj => {
    switch (obj.fCode) {
      case "$filter": //过滤事件
        dataSortFilter(_dataObj, _lay, _tParObj);
        break;
      case "$layout":
        if (_lay.value.layout.sort === "2") {
          handleRequestImp();
        } else {
          dataSortFilter(_dataObj, _lay, _tParObj);
        }
        break;
      default:
        if (!obj.fCode.startsWith("$") || obj.fCode === "$upload") {
          handleEventImp(obj);
        }
        break;
    }
    //触发表格页面
    refTableComp.value.handleClickToolbar(obj);
  };

  //数据改变
  watch(
    () => [props.sortRule, props.data],
    () => {
      nextTick(() => {
        dataSortFilter(_dataObj, _lay, _tParObj);
      });
    }
  );

  //权限设置
  watch(
    () => [_lay.value, _oper.value],
    () => {
      nextTick(() => {
        initLayAuth(_lay, _oper);
      });
    }
  );

  //定义父组件可用方法
  const getRef = () => {
    return refTableComp.value.getRef();
  };

  //关闭详情
  const closeView = () => {
    refTableComp.value.closeView();
  };

  //刷新表格
  const refreshTable = () => {
    _lay.value = initTableLay(props.layout, props.fieldCat, props.toolbar, props.sortRule);
  };

  //定义父组件可用方法
  defineExpose({
    getRef,
    closeView,
    refreshTable
  });
</script>
