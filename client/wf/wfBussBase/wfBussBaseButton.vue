<template>
  <!-- 业务主体信息-通过按钮点击，标签模式  -->
  <div class="btn-buss">
    <szd-button label="其它" class="btn-buss-other" type="primary" @click="handleClick" />
    <wfBussBase ref="refWfBussBase" />
  </div>
</template>

<script setup>
  import { defineProps, ref } from "vue";
  import wfBussBase from "./wfBussBase.vue";
  //子屏幕
  const refWfBussBase = ref();

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    }
  });

  //显示业务主体
  const handleClick = () => {
    refWfBussBase.value.acceptData(props.bussBase);
  };
</script>

<style lang="scss" scoped>
  .btn-buss {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    width: 100%;
  }

  .btn-buss-other {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 24px;
  }
</style>
