<template>
  <el-dialog
    :title="$t(dg.title)"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    class="app-dialog-container szd__tb__wrapper"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[900, 600]" />
    <szd-hlt :code="_code" />
    <template #footer>
      <szd-button label="关闭" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineExpose, ref } from "vue";
  //功能参数
  const dg = ref({
    open: false,
    title: "显示内容"
  });
  //显示代码
  const _code = ref("");

  //接受并处理
  const showContent = obj => {
    dg.value.open = true;
    if (obj.title) dg.value.title = obj.title;
    _code.value = obj.code;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //定义父组件可用方法
  defineExpose({
    showContent
  });
</script>
