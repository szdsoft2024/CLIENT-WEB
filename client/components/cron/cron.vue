<template>
  <el-dialog :title="$t('设置表达式')" v-model="dg.open" append-to-body :close-on-click-modal="false" draggable align-center destroy-on-close>
    <div v-szd-dialog="[1000, 600]"></div>
    <cron-inner v-model="cronVal"></cron-inner>
    <template #footer>
      <szd-button :label="$t('重置')" type="primary" @click="resetForm" />
      <szd-button :label="$t('确定')" type="primary" @click="submitForm" />
      <szd-button :label="$t('取消')" type="primary" @click="closeForm" />
    </template>
  </el-dialog>
</template>
<script>
  import cronInner from "./cronInner";
  import { $t } from "../../common/utils/globalConfig";

  export default {
    components: {
      cronInner
    },
    data() {
      return {
        dg: {
          open: false,
          fieldName: undefined
        },
        cronVal: "",
        objData: {}
      };
    },
    methods: {
      $t,
      //接受参数
      acceptData(infoParam, fieldName) {
        this.objData = {};
        this.dg.open = true;
        this.dg.fieldName = fieldName;
        this.objData = infoParam;
        this.cronVal = infoParam[fieldName];
        if (!this.cronVal) {
          this.resetForm();
        }
      },
      //保存数据
      submitForm() {
        let arrays = this.cronVal.split(" ");
        let dVal = arrays[3];
        let weekVal = arrays[5];
        if (dVal === "?" && weekVal === "?") {
          return this.$m("CORE_CLIENT.E084");
        }
        this.objData[this.dg.fieldName] = this.cronVal;
        this.closeForm();
      },
      //关闭窗口
      closeForm() {
        this.dg.open = false;
      },
      resetForm() {
        //   this.cronVal = "00 00 00 * * ? *";
        let dateTime = this.szdDate.getDay();
        let year = dateTime.substring(0, 4);
        let month = dateTime.substring(5, 7);
        if (month.substring(0, 1) == "0") {
          month = month.substring(1, 2);
        }
        var day = dateTime.substring(8, 10);

        this.cronVal = "00 00 00 " + day + " " + month + " ? " + year + "-" + year;
      }
    }
  };
</script>
