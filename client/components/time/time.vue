<template>
  <el-time-picker
    v-if="!_fst.hide"
    v-model="_modelValue"
    value-format="HH:mm:ss"
    range-separator="-"
    :placeholder="$t(placeholder)"
    :start-placeholder="$t(startPlaceholder)"
    :end-placeholder="$t(endPlaceholder)"
    :is-range="isRange"
    :disabled="_fst.disabled"
    :readonly="_fst.readonly"
    :clearable="clearable"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur" />
</template>
<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    modelValue: {
      type: [String, Number, Date, Array]
    },
    placeholder: {
      type: String
    },
    startPlaceholder: {
      type: String,
      default: "开始时间"
    },
    endPlaceholder: {
      type: String,
      default: "结束时间"
    },
    isRange: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
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
  //更新数据对象返回值
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
