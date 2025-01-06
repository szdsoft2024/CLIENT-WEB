<template>
  <el-input
    v-if="!_fst.hide"
    type="password"
    :placeholder="placeholder"
    v-model="_modelValue"
    :maxlength="maxlength"
    :readonly="_fst.readonly"
    :disabled="_fst.disabled"
    show-password
    autocomplete="new-password"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur" />
</template>
<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: String
    },
    placeholder: {
      type: String,
      default: ""
    },
    maxlength: {
      type: Number,
      default: 200
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur"]);
  //值数据
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFst(props.szdfst, props.szdopt, props.disabled, props.readonly);
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
