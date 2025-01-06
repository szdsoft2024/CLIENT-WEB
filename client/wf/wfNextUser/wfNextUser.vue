<template>
  <!-- 审批未找到用户，选择用户 -->
  <el-dialog
    :title="dg.title + dg.nodeName"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[500, 200]" />
    <el-form class="app-el-form">
      <szd-input-form-item-col
        v-model="form.nextUserId"
        label="用户"
        showHelp
        @help="szdSh({ a: 'CORE_USER', b: form, c: ['nextUserId-userId', 'nextUserName-userName'] })"
        :span="24"
        readonly
        :descSpan="12"
        :desc="form.nextUserName" />
    </el-form>
    <template #footer>
      <szd-button label="确定" type="primary" @click="okayForm" />
      <szd-button label="取消" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, defineEmits, ref, onMounted } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";

  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);

  const props = defineProps({
    wfParam: {
      type: Object
    }
  });

  //功能参数
  const dg = ref({
    title: "用户选择 下一审批节点",
    open: false,
    nodeName: ""
  });

  //用户选择
  const form = ref({
    nextUserId: "",
    nextUserName: ""
  });

  onMounted(() => {
    initData();
  });

  //初始化数据
  const initData = () => {
    form.value = {
      nextUserId: "",
      nextUserName: ""
    };
    dg.value.title = $t("用户选择 下一审批节点");
    dg.value.nodeName = "";
    if (props.wfParam.wfResult && props.wfParam.wfResult.nextWfInst) {
      dg.value.nodeName = ":" + props.wfParam.wfResult.nextWfInst.nodeId + "_" + props.wfParam.wfResult.nextWfInst.nodeName;
    }
    dg.value.open = true;
  };

  //数据确定
  const okayForm = () => {
    if (form.value.nextUserId === "" || form.value.nextUserId.trim() === "") {
      $m("CORE_CLIENT.E108"); //用户不能为空
      return;
    }
    emit("okay", { nextUserId: form.value.nextUserId, nextUserName: form.value.nextUserName });
    dg.value.open = false;
  };

  const closeForm = () => {
    dg.value.open = false;
  };

  //取消
  const handleClose = () => {
    emit("closeForm");
  };
</script>
