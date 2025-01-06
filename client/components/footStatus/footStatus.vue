<template>
  <!-- 尾部状态栏显示 -->
  <div class="main-wf-foot-status">
    <div v-for="(item, index) in status" :key="index" class="foot-status">
      <div v-if="item.lable && item.label !== ''" class="foot-label">{{ item.label }}:</div>
      <div v-if="item.status === 'E'" class="foot-value-red">{{ item.value }}</div>
      <div v-else-if="item.status === 'W'" class="foot-value-yellow">{{ item.value }}</div>
      <div v-else class="foot-value-blue">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from "vue";

  const props = defineProps({
    //数据示例  [{ label: '超标警告', status: 'W/E/S', value: '30%'}]
    status: {
      type: Array,
      default: []
    }
  });
</script>
