<template>
  <template v-if="!_ctrl.hide">
    <template v-if="_ctrl.descSpan > 0 && _ctrl.descSpan < 24">
      <el-row style="width: 100%">
        <el-col :span="24 - _ctrl.descSpan">
          <szd-input
            v-model="_modelValue"
            :type="_ctrl.type"
            :numDot="_ctrl.numDot"
            :numDec="_ctrl.numDec"
            :numMax="_ctrl.numMax"
            :numMin="_ctrl.numMin"
            :placeholder="_ctrl.placeholder"
            :maxlength="_ctrl.maxlength"
            :showHelp="_ctrl.showHelp"
            @help="emit('help')"
            :help="_ctrl.help"
            :readonly="_ctrl.readonly"
            :disabled="_ctrl.disabled"
            :clearable="_ctrl.clearable"
            :dblclick="_ctrl.dblclick"
            @dblclick="emit('dblclick')"
            :align="_ctrl.align"
            :noZero="_ctrl.noZero"
            :format="_ctrl.format"
            :szdfst="_ctrl.szdfst"
            :szdopt="_ctrl.szdopt"
            @input="handleInput"
            @change="handleChange"
            @focus="handleFocus"
            @blur="handleBlur" />
        </el-col>
        <el-col :span="_ctrl.descSpan">
          <szd-desc v-model="_desc" />
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <szd-input
        v-model="_modelValue"
        :type="_ctrl.type"
        :numDot="_ctrl.numDot"
        :numDec="_ctrl.numDec"
        :numMax="_ctrl.numMax"
        :numMin="_ctrl.numMin"
        :placeholder="_ctrl.placeholder"
        :maxlength="_ctrl.maxlength"
        :showHelp="_ctrl.showHelp"
        @help="emit('help')"
        :help="_ctrl.help"
        :readonly="_ctrl.readonly"
        :disabled="_ctrl.disabled"
        :clearable="_ctrl.clearable"
        :dblclick="_ctrl.dblclick"
        @dblclick="emit('dblclick')"
        :align="_ctrl.align"
        :noZero="_ctrl.noZero"
        :format="_ctrl.format"
        :szdfst="_ctrl.szdfst"
        :szdopt="_ctrl.szdopt"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur" />
    </template>
  </template>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: [String, Number]
    },
    //控件参数
    ctrl: {
      type: Object
    },
    //描述
    desc: {
      type: String,
      default: ""
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "help", "dblclick"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //控件参数
  const _ctrl = computed(() => {
    let ctrl = {
      type: props.ctrl.type, //类型支持string,number
      numDot: props.ctrl.numDot, //千分位符
      numDec: props.ctrl.numDec, //小数位位数
      numMax: props.ctrl.numMax, //最大值
      numMin: props.ctrl.numMin, //最小值
      placeholder: props.ctrl.placeholder, //占位符
      maxlength: props.ctrl.maxlength, //最大长度
      showHelp: props.ctrl.showHelp, //显示搜索帮助
      help: props.ctrl.help, //搜索帮助
      readonly: props.ctrl.readonly, //仅显示
      disabled: props.ctrl.disabled, //不可用
      hide: props.ctrl.hide || ["4", "5"].includes(props.ctrl.szdfst), //隐藏
      clearable: props.ctrl.clearable, //清空按钮
      dblclick: props.ctrl.dblclick, //双击事件
      align: props.ctrl.align, //对齐方式
      noZero: props.ctrl.noZero, //不输出0
      format: props.ctrl.format, //数据格式化
      descSpan: props.ctrl.descSpan, //描述宽度
      szdfst: props.ctrl.szdfst, //字段状态
      szdopt: props.ctrl.szdopt //显示状态
    };
    return ctrl;
  });
  //描述
  const _desc = computed(() => {
    return props.desc;
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
