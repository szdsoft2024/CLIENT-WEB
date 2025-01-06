<template>
  <!-- 业务主体信息 -->
  <el-dialog
    :title="$t('业务主体')"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[1000, 600]" />
    <el-form class="app-el-form">
      <el-row>
        <szd-input-form-item-col v-model="bussBaseObj.routerCode" label="业务路由" disabled :span="12" />
        <szd-input-form-item-col v-model="bussBaseObj.pkVal" label="业务单号" disabled :span="12" />
        <szd-input-form-item-col v-model="bussBaseObj.bussId" label="业务ID" disabled :span="12" />
        <szd-input-form-item-col v-model="bussBaseObj.program" label="程序代码" disabled :span="12" />
        <szd-input-form-item-col v-model="bussBaseObj.version" label="版本" disabled :span="12" />
        <szd-checkbox-form-item-col v-model="bussBaseObj.delFlag" label="删除" disabled :span="12" />
      </el-row>
      <el-row>
        <szd-input-form-item-col v-model="bussBaseObj.createBy" label="制单人" disabled :span="12" :desc="bussBaseObj.createByName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.createTime" label="制单时间" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.updateBy" label="更改人" disabled :span="12" :desc="bussBaseObj.updateByName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.updateTime" label="更改时间" disabled :span="12" :descSpan="12" />
      </el-row>
    </el-form>
    <template #footer>
      <div>
        <szd-button label="修改日志" type="primary" @click="logInfo" v-if="bussBaseObj.bussId" />
        <szd-button label="关闭" type="primary" @click="closeForm" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineExpose, ref } from "vue";
  import { useRoute } from "vue-router";
  import szdRouter from "../../common/utils/goRouter";
  import { $t } from "../../common/utils/globalConfig";
  //当前路由
  const route = useRoute();
  //功能参数
  const dg = ref({
    open: false
  });
  //表单参数
  const bussBaseObj = ref({});

  //接受并处理
  const acceptData = bussBase => {
    bussBaseObj.value = bussBase;
    dg.value.open = true;
  };

  //关闭
  const closeForm = () => {
    dg.value.open = false;
  };

  //日志信息
  const logInfo = () => {
    szdRouter.goNavDg("CORE_MON_25A", { bussId: bussBaseObj.value.bussId });
  };

  //定义父组件可用方法
  defineExpose({
    acceptData
  });
</script>
