<template>
  <!-- 工作流按钮组件 -->
  <div class="btn">
    <el-button type="primary" v-if="checkShow('A')" :disabled="checkAuthBtn('btn_save')" @click="clickButton('btn_check')">
      {{ $t("检查") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('B')" :disabled="checkAuthBtn('btn_save')" @click="clickButton('btn_save')">
      {{ $t("保存") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('C')" :disabled="checkAuthBtn('btn_commit')" @click="clickButton('btn_commit')">
      {{ $t("提交") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('D')" :disabled="checkAuthBtn('btn_approve')" @click="clickButton('btn_approve')">
      {{ $t("同意") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('E')" :disabled="checkAuthBtn('btn_reject')" @click="clickButton('btn_reject')">
      {{ $t("驳回") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('F')" :disabled="checkAuthBtn('btn_print')" @click="clickButton('btn_print')">
      {{ $t("打印") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('G')" :disabled="checkAuthBtn('btn_image')" @click="clickButton('btn_image')">
      {{ $t("影像") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('H')" :disabled="checkAuthBtn('btn_record')" @click="clickButton('btn_record')">
      {{ $t("审批信息") }}
    </el-button>
    <el-button type="primary" v-if="checkShow('S')" :disabled="checkAuthBtn('btn_vch')" @click="clickButton('btn_vch')">
      {{ $t("查看凭证") }}
    </el-button>
    <el-button type="primary" class="btn_more" v-if="checkShow('I')" @click="handleButMore">{{ $t("更多") }} . . . </el-button>
    <div v-show="dg.btnMoreShow" class="btn_more_view" @mouseleave="handleMouseOut">
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('J')" :disabled="checkAuthBtn('btn_atta')" @click="clickButton('btn_atta')">
          {{ $t("附件") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('K')" :disabled="checkAuthBtn('btn_revoke')" @click="clickButton('btn_revoke')">
          {{ $t("撤回") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button
          type="primary"
          class="btn_more"
          v-if="checkShow('L')"
          :disabled="checkAuthBtn('btn_transfer')"
          @click="clickButton('btn_transfer')">
          {{ $t("转办") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('M')" :disabled="checkAuthBtn('btn_meeting')" @click="clickButton('btn_meeting')">
          {{ $t("评审") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button
          type="primary"
          class="btn_more"
          v-if="checkShow('N')"
          :disabled="checkAuthBtn('btn_preAddSign')"
          @click="clickButton('btn_preAddSign')">
          {{ $t("前加签") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button
          type="primary"
          class="btn_more"
          v-if="checkShow('O')"
          :disabled="checkAuthBtn('btn_postAddSign')"
          @click="clickButton('btn_postAddSign')">
          {{ $t("后加签") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('P')" :disabled="checkAuthBtn('btn_delete')" @click="clickButton('btn_delete')">
          {{ $t("作废") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('Q')" :disabled="checkAuthBtn('btn_dyWfId')" @click="clickButton('btn_dyWfId')">
          {{ $t("设置流程") }}
        </el-button>
      </div>
      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="checkShow('R')" :disabled="checkAuthBtn('btn_save')" @click="clickButton('btn_consume')">
          {{ $t("消费记录") }}
        </el-button>
      </div>

      <div class="btn_row">
        <el-button type="primary" class="btn_more" v-if="bussBase" @click="clickButton('btn_bussBase')">
          {{ $t("业务主体") }}
        </el-button>
      </div>
    </div>
    <!-- 子页面 -->
    <wfButtonAppr ref="refWfButtonAppr" @okaySubmit="okaySubmit" />
    <wfButtonTran ref="refWfButtonTran" @okaySubmit="okaySubmit" />
    <wfBussBase ref="refWfBussBase" />
  </div>
</template>

<script setup>
  import "./wfButton.scss";
  import { defineProps, defineEmits, ref } from "vue";
  import { wfAddMeeting } from "../api/wfApi.js";
  import { $t } from "../../common/utils/globalConfig";
  import wfButtonAppr from "./wfButtonAppr.vue";
  import wfButtonTran from "./wfButtonTran.vue";
  import wfBussBase from "../wfBussBase/wfBussBase.vue";
  import { szdWf } from "../indexFunction";
  import { szdPop } from "../../common/message/popup";
  import szdRouter from "../../common/utils/goRouter";

  //更新数据对象
  const emit = defineEmits(["submit", "consume"]);
  //子屏幕
  const refWfButtonAppr = ref();
  const refWfButtonTran = ref();
  const refWfBussBase = ref();

  const props = defineProps({
    //路由代码
    routerCode: {
      type: String
    },
    //按钮权限及参数
    wfOper: {
      type: Object,
      default: {
        userId: "", //处理人
        bussId: "",
        bussDocId: "",
        routerCode: "", //业务路由
        //工作流按钮
        wfBtn: {
          btn_check: "U", //检查  空不能使用，V显示 U
          btn_save: "U", //保存
          btn_commit: "U", //提交
          btn_approve: "", //同意
          btn_reject: "", //驳回
          btn_print: "", //打印
          btn_atta: "", //附件
          btn_image: "", //影像
          btn_record: "", //审批信息
          btn_vch: "", //查看凭证
          btn_revoke: "", //撤回
          btn_transfer: "", //转办
          btn_meeting: "", //评审
          btn_preAddSign: "", //前加签
          btn_postAddSign: "", //后加签
          btn_delete: "", //作废
          btn_dyWfId: "", //动态工作流-显示的是流程ID
          btn_consume: "" //消费记录
        },
        wfOper: {}, //屏幕字段状态
        wfDef: {} //缺省值
      }
    },
    //隐藏按钮
    btnHide: {
      type: String,
      default: ""
    },
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    }
  });
  //功能参数
  const dg = ref({
    btnMoreShow: false
  });
  //隐藏按钮
  const checkShow = key => {
    return !props.btnHide || !props.btnHide.includes(key);
  };
  //检查权限
  const checkAuthBtn = operate => {
    if (!props.wfOper || !props.wfOper.wfBtn || !props.wfOper.wfBtn[operate]) {
      return true;
    }
    if (props.wfOper && props.wfOper.wfOper && props.wfOper.wfOper.szdopt === "V") {
      if (!["btn_print", "btn_atta", "btn_image", "btn_record", "btn_vch", "btn_revoke"].includes(operate)) {
        return true;
      }
    }
    if (!props.wfOper.bussId && !["btn_save", "btn_commit", "btn_dyWfId"].includes(operate)) {
      return true;
    }
    if (!props.routerCode && ["btn_print"].includes(operate)) {
      return true;
    }
    return false;
  };
  //点击更多
  const handleButMore = () => {
    dg.value.btnMoreShow = !dg.value.btnMoreShow;
  };
  //鼠标移出事件
  const handleMouseOut = () => {
    dg.value.btnMoreShow = false;
  };
  //按钮操作
  const clickButton = operate => {
    switch (operate) {
      case "btn_approve": //同意
        refWfButtonAppr.value.acceptData(operate);
        break;
      case "btn_reject": //驳回
        refWfButtonAppr.value.acceptData(operate);
        break;
      case "btn_print": //打印
        szdWf.goPrint(props.routerCode, props.wfOper.bussId);
        break;
      case "btn_image": //影像
        szdWf.eisImg({
          bussId: props.wfOper.bussId,
          userId: props.wfOper.userId,
          szdopt: props.wfOper && props.wfOper.wfOper && props.wfOper.wfOper.szdopt === "V" ? "V" : props.wfOper.wfBtn.btn_image
        });
        break;
      case "btn_record": //审批信息
        szdWf.wfInfo(props.wfOper.bussId);
        break;
      case "btn_atta": //附件
        szdWf.eisAtt({
          bussId: props.wfOper.bussId,
          userId: props.wfOper.userId,
          szdopt: props.wfOper && props.wfOper.wfOper && props.wfOper.wfOper.szdopt === "V" ? "V" : props.wfOper.wfBtn.btn_atta
        });
        break;
      case "btn_revoke": //撤回
        revokeDoc(operate);
        break;
      case "btn_transfer": //转办
        refWfButtonTran.value.acceptData(operate);
        break;
      case "btn_meeting": //评审
        meetingDoc();
        break;
      case "btn_preAddSign": //前加签
        refWfButtonTran.value.acceptData(operate);
        break;
      case "btn_postAddSign": //后加签
        refWfButtonAppr.value.acceptData(operate);
        break;
      case "btn_delete": //作废
        deleteDoc(operate);
        break;
      case "btn_dyWfId": //设置动态工作流
        szdRouter.goNavDg("CORE_WF_10A", { wfId: props.wfOper.wfBtn.btn_dyWfId, userId: props.wfOper.userId });
        break;
      case "btn_consume": //消费记录
        emit("consume");
        break;
      case "btn_vch": //凭证预览
        szdWf.goVch(props.wfOper.bussId);
        break;
      case "btn_bussBase": //业务主体
        refWfBussBase.value.acceptData(props.bussBase);
        break;
      default:
        submitDoc(operate);
        break;
    }
  };
  //撤回单据
  const revokeDoc = operate => {
    szdPop("是否撤回单据,请确认?").then(() => {
      submitDoc(operate);
    });
  };
  //评审单据
  const meetingDoc = () => {
    wfAddMeeting(props.wfOper.bussId).then(() => {
      szdRouter.goNav("CORE_PER_07A", { bussId: props.wfOper.bussId });
    });
  };
  //作废单据
  const deleteDoc = operate => {
    if (props.wfOper.bussDocId) {
      refWfButtonAppr.value.acceptData(operate, props.wfOper);
    } else {
      szdPop("删除的单据不能恢复,请确认?").then(() => {
        submitDoc(operate);
      });
    }
  };
  //提交数据
  const submitDoc = operate => {
    let wfEvt = {
      operate: operate //操作事件
    };
    okaySubmit(wfEvt);
  };
  //工作流事件提交
  const okaySubmit = wfEvt => {
    wfEvt.userId = props.wfOper.userId;
    wfEvt.bussId = props.wfOper.bussId;
    wfEvt.bussDocId = props.wfOper.bussDocId;
    wfEvt.routerCode = props.routerCode;
    emit("submit", wfEvt);
  };
</script>
