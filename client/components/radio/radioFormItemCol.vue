<template>
  <el-col v-if="!_fst.hide" :span="span">
    <el-form-item :label="_label" :label-width="labelWidth" :prop="prop" :required="_fst.required">
      <template v-if="helpTip" #label>
        <div>
          <span>{{ _label }}</span>
          <el-icon class="main-help-tip">
            <QuestionFilled @click.prevent.stop="handleHelpTip" />
          </el-icon>
        </div>
      </template>
      <template v-if="descSpan > 0 && descSpan < 24">
        <el-col :span="24 - descSpan">
          <szd-radio v-bind="$attrs" v-model="_modelValue" @change="handleChange" :szdfst="szdfst" />
        </el-col>
      </template>
      <template v-else>
        <szd-radio v-bind="$attrs" v-model="_modelValue" @change="handleChange" :szdfst="szdfst" />
      </template>
    </el-form-item>
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
      type: [String, Number, Boolean]
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
    prop: {
      type: String
    },
    labelWidth: {
      type: [Number, String],
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    descSpan: {
      type: Number,
      default: 0
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
  const emit = defineEmits(["update:modelValue", "change"]);
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
  //更改事件
  const handleChange = v => {
    emit("change", v);
  };
  //显示文字帮助事件
  const handleHelpTip = () => {
    szdTool.helpDoc(props.helpTip);
  };
</script>
