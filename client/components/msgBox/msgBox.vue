<template>
  <el-dialog
    :title="$t('消息提示')"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[700, 450]" />
    <el-table border stripe :data="msg" class="flex-1">
      <el-table-column :label="$t('标识')" prop="light" min-width="50" align="center">
        <template #default="scope">
          <szd-svg v-if="scope.row.light == 1" name="circle" style="font-size: 14px; color: #f54f4f"></szd-svg>
          <szd-svg v-else-if="scope.row.light == 2" name="circle" style="font-size: 14px; color: #ffd70b"></szd-svg>
          <szd-svg v-else-if="scope.row.light == 3" name="circle" style="font-size: 14px; color: #5cc22d"></szd-svg>
          <szd-svg v-else name="circle" style="font-size: 14px; color: #909399"></szd-svg>
        </template>
      </el-table-column>
      <el-table-column prop="retCode" :label="$t('消息码')" width="100" />
      <el-table-column prop="retMsg" :label="$t('消息内容')" min-width="400" />
    </el-table>

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
    msg: {
      type: Array,
      default: []
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
