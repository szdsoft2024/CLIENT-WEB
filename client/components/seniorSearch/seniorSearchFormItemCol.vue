<template>
  <el-col :span="span">
    <el-form-item :label="_label" :label-width="labelWidth" :prop="prop" :required="required">
      <template v-if="helpTip" #label>
        <div>
          <span>{{ _label }}</span>
          <el-icon class="main-help-tip">
            <QuestionFilled @click.prevent.stop="handleHelpTip" />
          </el-icon>
        </div>
      </template>
      <szd-sch v-bind="$attrs" v-model="_modelValue" @keydownEnter="emit('keydownEnter')" />
    </el-form-item>
  </el-col>
</template>
<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdTool from "../../common/tools/tool";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: Array,
      default: () => []
    },
    //form-item所需的参数
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String
    },
    labelWidth: {
      type: [Number, String]
    },
    required: {
      type: Boolean,
      default: false
    },
    helpTip: {
      type: String
    },
    //col所需的参数
    span: {
      type: Number,
      default: 12
    }
  });
  const emit = defineEmits(["update:modelValue", "keydownEnter"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  const _label = computed(() => {
    return $t(props.label);
  });
  //显示文字帮助事件
  const handleHelpTip = () => {
    szdTool.helpDoc(props.helpTip);
  };
</script>
