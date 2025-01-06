<template>
  <el-sub-menu :key="item.menuId" v-if="item.children && item.children.length > 0" :index="item.menuId">
    <template #title>
      <div v-if="item.icon" style="height: 16px; line-height: 16px">
        <szd-svg :name="item.icon" />
      </div>
      <span>{{ item.menuName }}</span>
    </template>
    <sidebar-item v-for="child in item.children" :key="child.menuId" :item="child" class="nest-menu" />
  </el-sub-menu>
  <template v-else>
    <el-menu-item :key="item.menuId" :index="item.menuId" @click="nav(item)" v-bind="$attrs">
      <template #title>
        <div v-if="item.icon" style="height: 16px; line-height: 16px">
          <szd-svg :name="item.icon" />
        </div>
        <span>{{ item.menuName }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
  import { defineProps } from "vue";
  import szdRouter from "../../../../client/common/utils/goRouter";

  const props = defineProps({
    //路由信息
    item: {
      type: Object,
      required: true
    }
  });

  //打开路由
  const nav = obj => {
    szdRouter.goNav(obj.routerCode);
  };
</script>
