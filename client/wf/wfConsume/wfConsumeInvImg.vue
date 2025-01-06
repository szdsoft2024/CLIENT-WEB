<template>
  <!-- 表格输出 -->
  <el-table border stripe :data="objData.invImg" class="flex-1" @selection-change="handleSelRow">
    <el-table-column align="center" type="selection" width="40" fixed="left" />
    <wfConsumeInvColCat :bussBase="bussBase" />
  </el-table>
</template>

<script setup>
  import { defineProps } from "vue";
  import wfConsumeInvColCat from "./wfConsumeInvColCat.vue";

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object
    },
    //业务主体
    objData: {
      type: Object,
      default: {}
    }
  });

  const handleSelRow = selection => {
    props.objData.invImgSel = selection;
  };
</script>
