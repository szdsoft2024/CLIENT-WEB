<template>
  <div class="app-sub-container app-sub-sub flex-y">
    <!-- 查询条件 -->
    <el-form :model="_modelValue" ref="queryForm" class="app-el-form">
      <el-row>
        <template v-for="(fCat, index) in _lay.schCat">
          <szd-sch-form-item-col
            v-show="_more || _lay.layout.more === 0 || _lay.layout.more > index"
            v-model="_modelValue[fCat.field]"
            :type="fCat.type"
            :numDot="fCat.numDot"
            :numDec="fCat.numDec"
            :help="fCat.help"
            :noTo="fCat.noTo"
            :noExt="fCat.noExt"
            :disabled="fCat.disabled"
            :readonly="fCat.readonly"
            :clearable="fCat.clearable"
            :selectOpt="fCat.selectOpt"
            :label="fCat.label"
            :prop="fCat.prop"
            :labelWidth="fCat.labelWidth"
            :required="fCat.required"
            :helpTip="fCat.helpTip"
            :span="fCat.span"
            @keydownEnter="handleKeydownEnter" />
        </template>
      </el-row>
    </el-form>
    <!-- 功能按钮 -->
    <div class="main-button-position">
      <div class="right" :style="_lay.layout.styleBtn">
        <template v-for="but in _lay.schBtn">
          <szd-button-ctrl :ctrl="but" @click="handleEventImp(but.fCode)" />
        </template>
      </div>
    </div>
    <!-- 变式管理 -->
    <schLayout ref="refSchLayout" v-model="_modelValue" v-model:lay="_lay" />
  </div>
</template>

<script setup>
  import { computed, ref, defineProps, defineEmits, watch, onMounted } from "vue";
  import { $m } from "../../common/utils/globalConfig";
  import { initSchLay } from "./js/schParam";
  import schLayout from "./layout/schLayout.vue";
  import { useRoute } from "vue-router";

  const props = defineProps({
    //高级搜索数据
    modelValue: {
      type: Object,
      required: true,
      default: {}
    },
    //高级搜索字段
    schLay: {
      type: Object,
      default: {}
    }
  });
  const emit = defineEmits(["handleEvent", "update:modelValue"]);
  const refSchLayout = ref(); //保存变式
  const queryForm = ref();
  //表格布局
  const _lay = ref();
  watch(
    () => props.schLay,
    () => {
      _lay.value = initSchLay(props.schLay);
    },
    { deep: true, immediate: true }
  );
  //更多选择
  const _more = ref(false);
  //表格数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //当前路由
  const route = useRoute();

  //解析url参数
  onMounted(() => {
    initData();
  });

  const initData = () => {
    const queryKey = Object.keys(route.query);
    if (queryKey.length > 0) {
      for (let i = 0; i < _lay.value.schCat.length; i++) {
        const item = _lay.value.schCat[i];
        if (!queryKey.includes(item.field)) continue;
        if (!_modelValue.value[item.field]) _modelValue.value[item.field] = [];
        _modelValue.value[item.field].push({
          type: item.type,
          option: "EQ",
          low: route.query[item.field],
          high: undefined
        });
      }
    }
  };

  //按钮回调事件
  const handleEventImp = fCode => {
    switch (fCode) {
      case "$more":
        _more.value = !_more.value;
        const temp = _lay.value.schBtn.find(item => item.fCode === "$more");
        if (temp) temp.icon = _more.value ? "ArrowUp" : "ArrowDown";
        break;
      case "$layout":
        refSchLayout.value.callInitData();
        break;
      case "$reset":
        queryForm.value.resetFields();
        if (_lay.value.layout.reset) {
          handleEventImp("$search");
        }
        break;
      case "$search":
        //检查数据
        if (checkRanges()) {
          emit("handleEvent", fCode);
        }
        break;
      default:
        emit("handleEvent", fCode);
        break;
    }
  };

  //检查必输
  const checkRanges = () => {
    for (let i = 0; i < _lay.value.schCat.length; i++) {
      const item = _lay.value.schCat[i];
      if (item.required) {
        if (!_modelValue.value[item.field] || _modelValue.value[item.field].length === 0) {
          $m("CORE_CLIENT.E078", item.label); //字段 & 为必输
          return false;
        }
      }
    }
    return true;
  };

  //处理回车事件
  const handleKeydownEnter = () => {
    handleEventImp("$search");
  };
</script>
