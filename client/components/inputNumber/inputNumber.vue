<template>
  <el-input-number
    v-if="!_fst.hide"
    v-model="_modelValue"
    :placeholder="placeholder"
    :max="max"
    :min="min"
    :precision="precision"
    :step="step"
    :readonly="_fst.readonly"
    :disabled="_fst.disabled"
    :controls="controls"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    controls-position="right" />
</template>
<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: Number
    },
    placeholder: {
      type: String
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    precision: {
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    szdfst: {
      type: String
    },
    szdopt: {
      type: String
    }
  });
  //定义事件
  const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);
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
