<template>
  <el-col v-if="!_fst.hide" :span="span">
    <div class="main-textarea">
      <div class="main-textarea-label" :style="{ width: labelWidth }">
        <span v-if="_fst.required" class="main-required">*</span>
        <span>{{ _label }}</span>
        <el-icon v-if="helpTip" class="main-help-tip">
          <QuestionFilled @click.prevent.stop="handleHelpTip" />
        </el-icon>
      </div>
      <div class="main-textarea-content">
        <szd-textarea
          v-bind="$attrs"
          v-model="_modelValue"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
          :szdfst="szdfst" />
      </div>
    </div>
  </el-col>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdTool from "../../common/tools/tool";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: String
    },
    szdfst: {
      type: String,
      default: ""
    },
    //form-item所需的参数
    label: {
      type: String,
      default: ""
    },
    labelWidth: {
      type: String,
      default: "25%"
    },
    required: {
      type: Boolean,
      default: false
    },
    helpTip: {
      type: String
    },
    //col列宽
    span: {
      type: Number,
      default: 12
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFstForm(props.szdfst, props.required);
  });
  const _label = computed(() => {
    return $t(props.label);
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
  //显示文字帮助事件
  const handleHelpTip = () => {
    szdTool.helpDoc(props.helpTip);
  };
</script>
