<template>
  <div class="g-flex">
    <img src="../../../client/assets/icons/404.png" class="g-left" />
    <div class="g-right">
      <h1>404</h1>
      <div class="u-auth">{{ "抱歉，你访问的页面不存在" }}</div>
      <el-button type="primary" @click="goHome">{{ "返回首页" }}</el-button>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from "vue-router";

  const router = useRouter();
  const goHome = () => {
    router.push({ path: "/", replace: true });
  };
</script>

<style lang="scss" scoped>
  .g-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .g-left {
    width: 30%;
    margin-right: 100px;
  }

  .g-right {
    text-align: left;

    > h1 {
      margin-bottom: 24px;
      color: #515a6e;
      font-weight: 600;
      font-size: 72px;
      line-height: 72px;
    }

    .u-auth {
      margin-bottom: 16px;
      color: #808695;
      font-size: 20px;
      line-height: 28px;
    }
  }
</style>
