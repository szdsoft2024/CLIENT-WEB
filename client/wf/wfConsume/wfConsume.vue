<template>
  <el-dialog
    :title="$t(dg.title)"
    v-model="dg.open"
    append-to-body
    :close-on-click-modal="false"
    class="app-dialog-container"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="['95%', '85%']" />

    <el-tabs v-model="dg.actTab" class="szd__tb__wrapper">
      <el-tab-pane :label="$t('本单发票')" name="invImg">
        <wfConsumeInvImg ref="refWfConsumeInvImg" :objData="objData" :bussBase="bussBase" />
      </el-tab-pane>
      <el-tab-pane :label="$t('个人票夹')" name="invFol">
        <wfConsumeInvFol ref="refWfConsumeInvFol" :objData="objData" :bussBase="bussBase" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button type="primary" @click="okayForm">{{ $t("确定") }}</el-button>
      <el-button type="primary" @click="closeForm">{{ $t("关闭") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineProps, onMounted, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import wfConsumeInvImg from "./wfConsumeInvImg.vue";
  import wfConsumeInvFol from "./wfConsumeInvFol";
  import { wfEisConsumeFolToImg } from "../api/wfComsume";

  //更新数据对象
  const emit = defineEmits(["okaySubmit"]);

  //子屏幕
  const refWfConsumeInvImg = ref();
  const refWfConsumeInvFol = ref();

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object,
      default: {
        bussId: "", //业务Id
        bstp: "" //业务类型
      }
    },
    //本单已有的发票代码清单
    invList: {
      type: Array,
      default: []
    }
  });

  //功能参数
  const dg = ref({
    title: "消费记录",
    open: false,
    actTab: "invImg"
  });

  //用户选择
  const objData = ref({
    invImg: [],
    invFol: [],
    folderId: undefined,
    folderName: undefined
  });

  onMounted(() => {
    initData();
  });

  //初始化数据
  const initData = () => {
    objData.value.invImg = props.invList;
    objData.value.invFol = [];

    dg.value.open = true;
  };

  //数据确定
  const okayForm = () => {
    //票夹移动到影像
    let json = {
      bussId: props.bussBase.bussId,
      moveList: objData.value.invFolSel
    };
    if (json.moveList && json.moveList.length > 0) {
      wfEisConsumeFolToImg(json).then(res => {
        emit("okay", objData.value);
        dg.value.open = false;
      });
    } else {
      emit("okay", objData.value);
      dg.value.open = false;
    }
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //取消
  const closeForm = () => {
    dg.value.open = false;
  };
</script>
