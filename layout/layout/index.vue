<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 左侧边菜单 -->
    <sidebar v-if="!isInQiankun" class="sidebar-container" />
    <!-- 右面板 -->
    <div class="main-container" :style="{'margin-left': !isInQiankun ? '' : 0}">
      <!-- 右面板抬头导航栏和页标签 -->
      <div v-if="!isInQiankun">
        <!-- 右面板抬头导航栏 -->
        <navbar />
        <!-- 右面板页标签 -->
        <navtab />
      </div>
      <!-- 主功能区 -->
      <mainpanel />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import store from "~store";
  import sidebar from "./sub/sidebar.vue";
  import navbar from "./sub/navbar.vue";
  import navtab from "./sub/navtab.vue";
  import mainpanel from "./sub/mainpanel.vue";
  //是否乾坤
  const isInQiankun = ref(window.__POWERED_BY_QIANKUN__);

  //设置左侧边栏打开关闭
  const classObj = computed(() => {
    return { hideSidebar: !store.state.frameLayout.sidebar.opened };
  });
</script>

<style scoped lang="scss">
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
