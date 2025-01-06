<template>
  <el-dialog
    :title="$t('查看文件')"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1200, 600]" />

    <szd-file-view :src="src" :srcBlob="srcBlob" :fileName="fileName" :isBlob="isBlob" />

    <template #footer>
      <szd-button label="关闭" type="primary" @click="handleCloseForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, defineEmits, ref, onMounted } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  //定义事件
  const emit = defineEmits(["closeForm"]);

  const props = defineProps({
    src: {
      type: String,
      default: ""
    },
    srcBlob: {
      type: String,
      default: ""
    },
    fileName: {
      type: String,
      default: ""
    },
    isBlob: {
      type: Boolean,
      default: false
    }
  });

  //功能参数
  const dg = ref({
    open: false
  });

  onMounted(() => {
    dg.value.open = true;
  });

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emit("closeForm");
  };
</script>
<style lang="scss" scoped>
  .excel-view-container {
    width: 100%;
    margin: auto;
    height: 100%;

    .el-tabs {
      height: 100%;
      position: relative;

      .el-tabs__header {
        position: absolute;
        width: 100%;
        bottom: 0;

        .el-tabs__item.is-active {
          border-top: 1px solid;
        }
      }

      .el-tabs__content {
        height: 100%;
        overflow: auto;
        padding: 0;
      }
    }
  }

  :deep(#xlsView) {
    table {
      border-collapse: collapse;
      table-layout: fixed;

      .classTitle {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #eee;
      }

      td {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #ddd;
        width: 50px;
        height: 20px;
      }
    }
  }
</style>
