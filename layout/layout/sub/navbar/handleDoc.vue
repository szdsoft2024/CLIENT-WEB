<template>
  <div @click="handleClick">
    <szd-svg name="help" />
  </div>
</template>

<script setup>
  import szdRouter from "../../../../client/common/utils/goRouter";
  //显示操作手册
  const handleClick = () => {
    let routerCode = szdRouter.getRouterCode();
    szdRouter.goNav("SKIS_01A", { routerCode: routerCode });
  };
</script>
