<template>
  <div v-text="_label" class="l-code" @click="handleClick" />
  <hltDialog ref="refHltDialog" />
</template>

<script setup>
  import { computed, defineProps, ref } from "vue";
  import hltDialog from "./hltDialog.vue";
  //子屏幕
  const refHltDialog = ref();

  const props = defineProps({
    code: {
      type: [String, Object],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ""
    }
  });

  //值数据
  const _label = computed(() => {
    if (props.label) return props.label;
    let _codeStr = props.code ? (typeof props.code === "string" ? props.code : JSON.stringify(props.code)) : "";
    if (props.length > 0 && _codeStr) {
      return _codeStr.length > props.length ? _codeStr.substring(0, props.length) : _codeStr;
    } else {
      return _codeStr;
    }
  });

  //显示代码
  const handleClick = () => {
    refHltDialog.value.showContent({ code: props.code, title: props.title });
  };
</script>
<style scoped>
  .l-code {
    color: #409eff;
    cursor: pointer;

    &:hover {
      color: #a0cfff;
    }
  }
</style>
