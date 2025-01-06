<template>
  <div v-if="!_ctrl.hide" class="main-textarea">
    <div class="main-textarea-content">
      <szd-textarea
        v-model="_modelValue"
        :placeholder="_ctrl.placeholder"
        :maxlength="_ctrl.maxlength"
        :rows="_ctrl.rows"
        :show-word-limit="_ctrl.showWordLimit"
        :readonly="_ctrl.readonly"
        :disabled="_ctrl.disabled"
        :szdfst="_ctrl.szdfst"
        :szdopt="_ctrl.szdopt"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur" />
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: String
    },
    //控件参数
    ctrl: {
      type: Object
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      placeholder: props.ctrl.placeholder, //占位符
      maxlength: props.ctrl.maxlength, //最大长度
      rows: props.ctrl.rows, //显示行数
      showWordLimit: props.ctrl.showWordLimit, //显示限制
      readonly: props.ctrl.readonly, //仅显示
      disabled: props.ctrl.disabled, //不可用
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //文本输入事件
  const handleInput = v => {
    emit("input", v);
  };
  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
  //在 Input 获得焦点时触发
  const handleFocus = e => {
    emit("focus", e);
  };
  //在 Input 失去焦点时触发
  const handleBlur = e => {
    emit("blur", e);
  };
</script>
