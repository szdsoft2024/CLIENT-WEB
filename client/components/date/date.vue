<template>
  <el-date-picker
    v-if="!_fst.hide"
    v-model="_modelValue"
    :type="type"
    :value-format="formatVal[type]"
    :format="formatVal[type]"
    range-separator="-"
    :placeholder="$t(placeholder)"
    :start-placeholder="$t(startPlaceholder)"
    :end-placeholder="$t(endPlaceholder)"
    :disabled="_fst.disabled"
    :readonly="_fst.readonly"
    :clearable="clearable"
    :unlink-panels="unlinkPanels"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur" />
</template>
<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    type: {
      type: String,
      default: "date"
    },
    modelValue: {
      type: [String, Date, Array]
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
    unlinkPanels: {
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
  const formatVal = {
    date: "YYYY-MM-DD",
    dates: "YYYY-MM-DD",
    daterange: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD HH:mm:ss",
    datetimerange: "YYYY-MM-DD HH:mm:ss",
    year: "YYYY",
    years: "YYYY",
    month: "YYYY-MM",
    monthrange: "YYYY-MM",
    week: "YYYY第ww周"
  };

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
