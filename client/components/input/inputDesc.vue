<template>
  <div v-if="!_fst.hide">
    <template v-if="descSpan > 0 && descSpan < 24">
      <el-row style="width: 100%">
        <el-col :span="24 - descSpan">
          <szd-input
            v-bind="$attrs"
            v-model="_modelValue"
            @input="handleInput"
            @change="handleChange"
            @focus="handleFocus"
            @blur="handleBlur"
            @dblclick="emit('dblclick')"
            :szdfst="szdfst" />
        </el-col>
        <el-col :span="descSpan">
          <szd-desc v-model="_desc" />
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <szd-input
        v-bind="$attrs"
        v-model="_modelValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @dblclick="emit('dblclick')"
        :szdfst="szdfst" />
    </template>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import szdComp from "../../common/utils/component";

  const props = defineProps({
    //输入框所需的参数
    modelValue: {
      type: [String, Number]
    },
    szdfst: {
      type: String
    },
    desc: {
      type: String,
      default: ""
    },
    descSpan: {
      type: Number,
      default: 0
    }
  });
  const emit = defineEmits(["update:modelValue", "change", "input", "focus", "blur", "dblclick"]);
  const _modelValue = computed({
    get: () => props.modelValue,
    set: val => {
      emit("update:modelValue", val);
    }
  });
  //编辑状态
  const _fst = computed(() => {
    return szdComp.getCompFstForm(props.szdfst);
  });
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
