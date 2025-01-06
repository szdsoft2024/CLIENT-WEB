<template>
  <el-dialog :title="title" v-model="dgOpen" :before-close="close" align-center destroy-on-close append-to-body draggable>
    <!-- :z-index="zIndex" -->
    <div v-szd-dialog="[width, height]"></div>
    <szd-ifr :routerCode="routerCode" :params="params" @close="close"></szd-ifr>
  </el-dialog>
</template>

<script setup>
  import { ref, provide } from "vue";
  import { useStore } from "vuex";
  import { lockTabOff } from "../../common/tools/lock";

  const emits = defineEmits(["closeDialog"]);
  const props = defineProps({
    routerCode: {
      type: String,
      default: ""
    },
    params: {
      type: Object
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "95%"
    },
    height: {
      type: String,
      default: "85%"
    }
    // zIndex: {
    //   type: Number,
    //   default: 0
    // }
  });

  const store = useStore();

  const closeFlag = ref(false);
  provide("closeFlag", closeFlag.value);
  const dgOpen = ref(true);
  const close = () => {
    setTimeout(() => {
      handleLockTabOff();
      emits("closeDialog");
    }, 100);
  };

  //关闭前解锁
  const handleLockTabOff = () => {
    //检查是否存在标签
    if (props.routerCode && store.state.frameTag && !store.state.frameTag.visitedViews.some(r => r.name === props.routerCode)) {
      let _routerCodeArr = [];
      _routerCodeArr.push(props.routerCode);
      lockTabOff(_routerCodeArr);
    }
  };
</script>

<style scoped lang="scss">
  :deep(.el-dialog) {
    width: auto;
    height: auto;

    .el-dialog__header {
      padding: 0;
      margin-right: 0;
    }

    .el-dialog__body {
      padding: 0.8rem 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        color: #000;
        font-size: 0.24rem;
        font-weight: 500;
      }
    }
  }
</style>
