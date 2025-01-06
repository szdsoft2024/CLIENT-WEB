<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViews">
        <component :is="wrap(route, Component)" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script setup>
  import { computed, defineProps } from "vue";
  import store from "~store";

  const props = defineProps({
    isLayout: {
      type: Boolean
    }
  });

  //缓存信息
  const cachedViews = computed(() => {
    return store.state.frameTag.cachedViews;
  });

  // keepAlive组件添加name
  const wrap = (route, component) => {
    if (component) {
      component.type["name"] = route.name;
    }
    return component;
  };
</script>

<style lang="scss" scoped>
  .app-main {
    height: calc(100vh - 84px);
    width: 100%;
    position: relative;
    overflow: auto;

    &.isNotLayout {
      min-height: 100vh;
    }
  }
</style>
