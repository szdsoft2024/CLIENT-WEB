<template>
  <template v-if="!_ctrl.hide">
    <template v-if="_ctrl.descSpan > 0 && _ctrl.descSpan < 24">
      <el-col :span="24 - _ctrl.descSpan">
        <szd-select
          v-model="_modelValue"
          :baseField="_ctrl.baseField"
          :baseArr="_ctrl.baseArr"
          :baseSelect="_ctrl.baseSelect"
          :disabled="_ctrl.disabled"
          :clearable="_ctrl.clearable"
          :placeholder="_ctrl.placeholder"
          :first="_ctrl.first"
          :szdfst="_ctrl.szdfst"
          :szdopt="_ctrl.szdopt"
          @change="handleChange" />
      </el-col>
    </template>
    <template v-else>
      <szd-select
        v-model="_modelValue"
        :baseField="_ctrl.baseField"
        :baseArr="_ctrl.baseArr"
        :baseSelect="_ctrl.baseSelect"
        :disabled="_ctrl.disabled"
        :clearable="_ctrl.clearable"
        :placeholder="_ctrl.placeholder"
        :first="_ctrl.first"
        :szdfst="_ctrl.szdfst"
        :szdopt="_ctrl.szdopt"
        @change="handleChange" />
    </template>
  </template>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: [String, Number, Boolean]
    },
    //控件参数
    ctrl: {
      type: Object
    }
  });
  const emit = defineEmits(["update:modelValue", "change"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      baseField: props.ctrl.baseField, //基础字段
      baseArr: props.ctrl.baseArr, //数组
      baseSelect: props.ctrl.baseSelect, //查询条件
      disabled: props.ctrl.disabled, //不可用
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      clearable: props.ctrl.clearable, //清空
      placeholder: props.ctrl.placeholder, //占位符
      first: props.ctrl.first, //值为空默认第一个
      descSpan: props.ctrl.descSpan, //描述宽度
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //更改事件
  const handleChange = (v, res) => {
    emit("change", v, res);
  };
</script>
