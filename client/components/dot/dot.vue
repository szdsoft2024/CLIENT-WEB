<template>
  <!-- 小数位和千分位符号 -->
  <div class="div-dot">{{ _modelValue }}</div>
</template>

<script setup>
  import { computed, defineProps } from "vue";
  import { addThousandSeparator } from "pixiu-number-toolkit";

  const props = defineProps({
    modelValue: {
      type: [Number, String]
    },
    text: {
      type: [Number, String]
    },
    numDot: {
      type: Boolean,
      default: false
    },
    numDec: {
      type: [Number, String]
    },
    noZero: {
      type: Boolean,
      default: false
    }
  });
  //值数据
  const _modelValue = computed(() => {
    let val = props.text ? props.text : props.modelValue;
    if (!val) {
      val = 0;
    } else if (isNaN(val)) {
      return val;
    }
    //如果数值初始化，返回空
    if (props.noZero && Number(val) === 0) {
      return "";
    }
    //设置添加小数位，与千分位符顺序不能错
    if (!isNaN(props.numDec) && props.numDec >= 0 && props.numDec !== null && props.numDec !== undefined) {
      val = Number(val).toFixed(props.numDec);
    }
    //千分位符
    if (props.numDot) {
      val = addThousandSeparator(val);
    }
    return val;
  });
</script>
<style lang="scss" scoped>
  .div-dot {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
</style>
