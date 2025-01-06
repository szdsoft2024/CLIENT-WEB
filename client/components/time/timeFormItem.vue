<template>
  <el-form-item v-if="!_fst.hide" :label="_label" :label-width="labelWidth" :prop="prop" :required="_fst.required">
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
        <szd-time v-bind="$attrs" v-model="_modelValue" @change="handleChange" @focus="handleFocus" @blur="handleBlur" :szdfst="szdfst" />
      </el-col>
    </template>
    <template v-else>
      <szd-time v-bind="$attrs" v-model="_modelValue" @change="handleChange" @focus="handleFocus" @blur="handleBlur" :szdfst="szdfst" />
    </template>
  </el-form-item>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import szdTool from "../../common/tools/tool";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: [String, Number, Date, Array]
    },
    szdfst: {
      type: String
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
    descSpan: {
      type: Number,
      default: 0
    },
    helpTip: {
      type: String
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);
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
