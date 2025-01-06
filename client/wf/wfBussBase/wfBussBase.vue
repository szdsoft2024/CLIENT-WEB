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
        <szd-input-form-item-col v-model="bussBaseObj.bussDocId" label="业务单号" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.bussId" label="业务ID" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.cmpy" label="公司代码" disabled :span="12" :desc="bussBaseObj.cmpyName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.cstc" label="成本中心" disabled :span="12" :desc="bussBaseObj.cstcName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.bstp" label="业务类型" disabled :span="12" :desc="bussBaseObj.bstpName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.wfDyId" label="动态流程" disabled :span="12" :desc="bussBaseObj.wfDyName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.title" label="业务标题" disabled :span="12" />
        <szd-input-form-item-col v-model="bussBaseObj.routerCode" label="业务路由" disabled :span="12" :descSpan="12" />
        <szd-select-form-item-col v-model="bussBaseObj.status" label="单据状态" baseField="CORE_WF_DOST" disabled :span="12" :descSpan="12" />
        <szd-select-form-item-col v-model="bussBaseObj.rejectStatus" label="驳回" baseField="CORE_SYS_YENO" disabled :span="12" :descSpan="12" />
      </el-row>
      <el-row>
        <szd-input-form-item-col
          v-model="bussBaseObj.amtApply"
          label="申请金额"
          disabled
          :span="12"
          type="number"
          :numDec="2"
          numDot
          :descSpan="12" />
        <szd-input-form-item-col
          v-model="bussBaseObj.amtApplyTax"
          label="申请税额"
          disabled
          :span="12"
          type="number"
          :numDec="2"
          numDot
          :descSpan="12" />
        <szd-input-form-item-col
          v-model="bussBaseObj.amtActual"
          label="实际金额"
          disabled
          :span="12"
          type="number"
          :numDec="2"
          numDot
          :descSpan="12" />
        <szd-input-form-item-col
          v-model="bussBaseObj.amtActualTax"
          label="实际税额"
          disabled
          :span="12"
          type="number"
          :numDec="2"
          numDot
          :descSpan="12" />
      </el-row>
      <el-row>
        <szd-input-form-item-col v-model="bussBaseObj.sapPayDoc" label="付款单号" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.sapOtherDoc" label="辅助单号" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.sapAccDoc" label="会计凭证" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.sapAccYear" label="财年" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.sapAccDocOff" label="冲销凭证" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.sapAccYearOff" label="冲销财年" disabled :span="12" :descSpan="12" />
      </el-row>
      <el-row>
        <szd-input-form-item-col v-model="bussBaseObj.createBy" label="制单人" disabled :span="12" :desc="bussBaseObj.createByName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.createTime" label="制单时间" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.commitBy" label="提交人" disabled :span="12" :desc="bussBaseObj.commitByName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.commitTime" label="提交时间" disabled :span="12" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.updateBy" label="更改人" disabled :span="12" :desc="bussBaseObj.updateByName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.updateTime" label="更改时间" disabled :span="12" :descSpan="12" />
      </el-row>
      <el-row>
        <szd-input-form-item-col v-model="bussBaseObj.program" label="程序代码" disabled :span="12" :desc="bussBaseObj.programName" :descSpan="12" />
        <szd-input-form-item-col v-model="bussBaseObj.programVersion" label="程序版本" disabled :span="12" :descSpan="12" />
      </el-row>
      <el-row>
        <szd-textarea-form-item-col v-model="bussBaseObj.remark" label="备注" disabled :rows="2" :span="24" labelWidth="12.5%" />
      </el-row>
    </el-form>
    <template #footer>
      <szd-button label="修改日志" type="primary" @click="logInfo" v-if="bussBaseObj.bussId" />
      <szd-button label="关闭" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineExpose, ref } from "vue";
  import szdRouter from "../../common/utils/goRouter";
  //功能参数
  const dg = ref({
    open: false
  });
  //表单参数
  const bussBaseObj = ref({});

  //接受并处理
  const acceptData = bussBase => {
    dg.value.open = true;
    bussBaseObj.value = bussBase;
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
