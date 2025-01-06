<template>
  <!-- 同意和后加签页面 -->
  <el-dialog
    :title="$t(dg.title)"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[600, 350]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-textarea-form-item-col label="审批意见" v-model="form.comments" :maxlength="150" :rows="5" show-word-limit :span="24" />
        <szd-select-form-item-col
          label="常用语"
          v-model="form.dailyItem"
          baseField="CORE_WF_DALY"
          @change="changeComments"
          :span="24"
          helpTip="CORE_WF_APPR.CORE_WF_DALY" />
      </el-row>
      <el-row v-if="form.operate === 'btn_reject'">
        <szd-select-form-item-col label="操作原因" v-model="form.operateReason" baseField="CORE_WF_OPRE" :span="24" />
      </el-row>
      <el-row v-if="form.operate === 'btn_postAddSign'">
        <szd-input-form-item-col
          v-model="form.addUserId"
          label="加签"
          showHelp
          @help="szdSh({ a: 'CORE_USER', b: form, c: ['addUserId-userId', 'addUserName-userName'] })"
          :span="24"
          readonly
          :descSpan="16"
          :desc="form.addUserName" />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          label="@用户ID"
          v-model="form.noticeUserIds"
          showHelp
          @help="szdSh({ a: 'CORE_USER', b: form, c: ['noticeUserIds-userId', 'noticeUserNames-userName'] })"
          :span="24" />
      </el-row>
      <el-row>
        <szd-input-form-item-col label="@用户姓名" v-model="form.noticeUserNames" disabled :span="24" />
      </el-row>
    </el-form>

    <template #footer>
      <szd-button label="确定" type="primary" @click="okayForm"></szd-button>
      <szd-button label="取消" type="primary" @click="closeForm"></szd-button>
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
    title: "审批意见",
    open: false
  });
  //表单参数
  const form = ref({
    operate: "", //操作事件
    comments: "", //审批意见
    noticeUserIds: "", //@用户ID
    noticeUserNames: "", //@用户姓名
    addUserId: "", //加签ID
    addUserName: "", //加签姓名
    dailyItem: "", //日常用语
    operateReason: "", //操作原因
    operateReasonName: ""
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
      emit("okaySubmit", form.value);
      dg.value.open = false;
    }
  };

  // 检查提交数据
  const checkOkayForm = () => {
    if (form.value.comments === "" || form.value.comments.trim() === "") {
      $m("CORE_CLIENT.E106"); //审批意见不能为空
      return false;
    }
    if (form.value.operate === "btn_postAddSign") {
      if (form.value.addUserId === "" || form.value.addUserId.trim() === "") {
        $m("CORE_CLIENT.E107"); //加签用户不能为空
        return false;
      }
    }
    return true;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //常用语赋值审批意见
  const changeComments = (v, res) => {
    if (res.sname) {
      form.value.comments = form.value.comments + res.sname;
    }
    form.value.dailyItem = "";
  };

  //初始化数据
  const initData = () => {
    form.value = {
      operate: "", //操作事件
      comments: "", //审批意见
      noticeUserIds: "", //@用户ID
      noticeUserNames: "", //@用户姓名
      addUserId: "", //加签ID
      addUserName: "", //加签姓名
      dailyItem: "", //日常用语
      operateReason: "", //操作原因
      operateReasonName: ""
    };
  };

  //定义父组件可用方法
  defineExpose({
    acceptData
  });
</script>
