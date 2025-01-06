<template>
  <div class="app-container" style="height: calc(100vh - 90px);" v-if="!isInQiankun">
    <div class="home-font">{{ SYS_NAME }}系统</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        SYS_NAME: process.env.VUE_APP_SYS_NAME,
        isInQiankun: window.__POWERED_BY_QIANKUN__
      };
    }
  };
</script>

<style scoped lang="scss">
  .home-font {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70%;
    font-size: 48px;
    color: #1890FF;
    font-weight: 600;
  }
</style>
