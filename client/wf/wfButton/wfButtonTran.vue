<template>
  <!-- 选择用户 -->
  <el-dialog
    :title="$t(dg.title)"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[500, 200]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col
          v-model="form.tranUserId"
          label="用户"
          showHelp
          @help="szdSh({ a: 'CORE_USER', b: form, c: ['tranUserId-userId', 'tranUserName-userName'] })"
          :span="24"
          readonly
          :descSpan="12"
          :desc="form.tranUserName" />
      </el-row>
    </el-form>

    <template #footer>
      <szd-button label="确定" type="primary" @click="okayForm" />
      <szd-button label="取消" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineExpose, ref } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  //更新数据对象
  const emit = defineEmits(["okaySubmit"]);
  //功能参数
  const dg = ref({
    title: "用户选择",
    open: false
  });
  //表单参数
  const form = ref({
    operate: "", //操作事件
    tranUserId: "", //转办和前加签
    tranUserName: "", //转办和前加姓名
    addUserId: "", //前加签ID
    addUserName: "" //前加签姓名
  });

  //接受并处理
  const acceptData = operate => {
    initData();
    dg.value.open = true;
    form.value.operate = operate;
  };

  //确定
  const okayForm = () => {
    if (checkOkayForm()) {
      if (form.value.operate === "btn_transfer") {
        form.value.addUserId = "";
        form.value.addUserName = "";
      } else {
        form.value.addUserId = form.value.tranUserId;
        form.value.addUserName = form.value.tranUserName;
        form.value.tranUserId = "";
        form.value.tranUserName = "";
      }
      emit("okaySubmit", form.value);
      dg.value.open = false;
    }
  };

  // 检查提交数据
  const checkOkayForm = () => {
    if (form.value.tranUserId === "" || form.value.tranUserId.trim() === "") {
      $m("CORE_CLIENT.E108"); //用户不能为空
      return false;
    }
    return true;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //初始化数据
  const initData = () => {
    form.value = {
      operate: "", //操作事件
      tranUserId: "", //转办和前加签
      tranUserName: "", //转办和前加姓名
      addUserId: "", //前加签ID
      addUserName: "" //前加签姓名
    };
  };

  //定义父组件可用方法
  defineExpose({
    acceptData
  });
</script>
