<template>
  <div>
    <sidebarFold :sidebarOpened="frameLayout.sidebar.opened" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="!frameLayout.sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="frameLayout.theme"
        :collapse-transition="false"
        mode="vertical">
        <!-- 菜单首层输出 -->
        <sidebar-item v-for="(route, index) in loginUser.menus" :key="index" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import store from "~store";
  import sidebarFold from "./sidebar/sidebarFold";
  import sidebarItem from "./sidebar/sidebarItem";
  import variables from "../../../client/assets/styles/sidebar-variables.module.scss";

  //用户登录信息
  const loginUser = ref(store.state.loginUser);
  //侧边栏打开
  const frameLayout = computed(() => {
    return store.state.frameLayout;
  });
</script>

<style lang="scss">
  .scrollbar-wrapper {
    height: 90% !important;
  }
</style>
