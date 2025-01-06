import { createVNode, render } from "vue";
import { $m } from "../../common/utils/globalConfig";
import wfNextUser from "../wfNextUser/wfNextUser.vue";
import wfConsume from "../wfConsume/wfConsume.vue";
import szdRouter from "../../common/utils/goRouter";
import { ElMessage } from "element-plus";
import { wfInit } from "../api/wfApi.js";
import { szdShShow } from "../../components/searchHelp/serchHelp";
import { szdMsgBox } from "../../components/msgBox/msgBox";

let ctx;

const const_wfOper = {
  userId: "", //处理人
  bussId: "",
  bussDocId: "", //单据号
  routerCode: "", //业务路由
  bstp: "", //业务类型
  option: "C", //C创建 U更改 V显示
  //工作流按钮
  wfBtn: {
    btn_check: "U",
    btn_save: "U",
    btn_commit: "U",
    btn_approve: "",
    btn_reject: "",
    btn_print: "",
    btn_atta: "",
    btn_image: "",
    btn_record: "",
    btn_transfer: "",
    btn_meeting: "",
    btn_preAddSign: "",
    btn_postAddSign: "",
    btn_delete: "",
    btn_dyWfId: "",
    btn_consume: ""
  },
  wfFst: {}, //屏幕字段状态
  wfDef: {} //缺省值
};

/**
 * 工作流初始化
 * @param {String} routerCode 路由代码
 * @param {String} bstp 业务类型
 * @return {Promise} 返回工作流初始对象
 */
export function init(routerCode, bstp = "") {
  return new Promise(resolve => {
    let wfOper;
    //获取路由代码,关闭标签
    const routerObj = szdRouter.getRouterObj(routerCode);
    if (!routerObj) {
      szdRouter.closeFrameTag();
      resolve(const_wfOper);
      return;
    }
    if (routerObj.bstpCount === 0) {
      $m("CORE_CLIENT.E103", routerCode); //业务路由 & 未配置业务类型
      szdRouter.closeFrameTag();
      resolve(const_wfOper);
      return;
    }
    let _bstp = bstp ? bstp : routerObj.bstp;
    //选择业务类型
    if (_bstp) {
      wfInit(_bstp).then(res => {
        if (res.code === 200) {
          wfOper = res.data;
        } else {
          wfOper = const_wfOper;
        }
        wfOper.routerCode = routerCode;
        wfOper.bstp = _bstp;
        //关闭窗口
        if (wfOper.option === "V") {
          $m("CORE_CLIENT.E104"); //无操作此业务权限
          szdRouter.closeFrameTag();
        }
        resolve(wfOper);
      });
    } else {
      szdShShow({ a: "CORE_BSTP", d: [["routerCode", routerCode]] }).then(resSh => {
        if (resSh && resSh.data.length > 0) {
          wfInit(resSh.data[0].bstp).then(resDb => {
            if (resDb.code === 200) {
              wfOper = resDb.data;
            } else {
              wfOper = const_wfOper;
            }
            wfOper.routerCode = routerCode;
            wfOper.bstp = resSh.data[0].bstp;
            //关闭窗口
            if (wfOper.option === "V") {
              $m("CORE_CLIENT.E104"); //无操作此业务权限
              szdRouter.closeFrameTag();
            }
            resolve(wfOper);
          });
        } else {
          szdRouter.closeFrameTag();
          resolve(const_wfOper);
        }
      });
    }
  });
}

/**
 * 无需检查的按钮 提交数据不需要检查的按钮 //删除、拒绝、撤回可以直接提交
 * @param {Object} wfEvt 工作流事件按钮
 * @return {Boolean} true 不需要调用检查 false需要检查
 */
export function btnCheck(wfEvt) {
  return ["btn_delete", "btn_reject", "btn_revoke"].includes(wfEvt.operate);
}

/**
 * 工作流审批信息
 * @param {String} bussId 业务ID
 */
export function wfInfo(bussId) {
  szdRouter.goNavDg("CORE_WF_11A", { bussId: bussId });
}

/**
 * 返回结果处理
 * @param {Object} wfParam
 * {
 *  1. retCodeF: Q.不启用工作流 C缺少审批人 B审批成功 S保存成功 E审批失败
 *  2. retMsg:提示消息
 *  3. retMsgBox：消息列表
 *  4. wfResult:  流程处理结果
 *  {
 *   4.1 retCode:返回代码
 *     B000-处理成功(流程结束);B001-处理成功;B002-处理成功,驳回到发起人;B005-审批通过,请等待其他人审批;B006-处理成功(无审批流程);B007-已作废;B008-单据已删除;B009-单据已作废
 *     C001-未找到审批人；C002-存在多个审批人;C003-审批人不存在或冻结;
 *     E001-节点不存在;E002-节点配置错误;E003-流程已更新，请刷新待办;E004-待办不存在;E005-系统错误;E006-当前节点不允许加签;
 *     E007-节点已处理，不允许撤回;E008-单据已审批，不允许重复操作;E009-选择用户不存在;E010-@用户不存在;E011-任务池不支持转办业务;
 *     E012-转办用户不能设置为处理人;E013-超过允许时间，不允许撤回;E014-动态流程未配置或未激活(请提交人处理);E015-号码段未配置;E016-会签节点不允许作废
 *     E017-单据状态不支持撤回;E018-固化流程未配置(请联系技术人员);E019-固化流程未分配到公司(请联系技术人员);E020-动态流程未分配公司和绩效组(请联系技术人员)
 *     E021-业务单据不存在;E022-业务不支持批量处理;E023-业务单据已提交，不允许重复提交;E024-业务单据被锁定
 *     E101-业务单据bussId未赋值(请联系技术人员);E102-业务单据保存失败(请联系技术人员);
 *     S000-处理成功;
 *   4.2 retCodeDesc:返回代码描述
 *   4.3 retDetailDesc:返回详情描述
 *   4.4 nextWfInst:下一节点实例信息
 *   {
 *     4.4.1 nodeId:下一节点编码
 *     4.4.2 nodeName:下一节点名称
 *   }
 *  }
 *  5.wfParamEvt:操作参数
 * }
 *
 *  @return {Promise} 返回Boolean或对象，返回false不需要处理、返回true刷新数据、返回其它对象重新提交
 */
export function retInfo(wfParam) {
  return new Promise(resolve => {
    //消息弹框
    szdMsgBox(wfParam.retMsgBox).then(() => {
      wfParam.retMsg = wfParam.retMsg || $m("CORE_CLIENT.E105", "", false, true); //技术错误，未返回任何信息
      if (wfParam.retCodeF === "Q") {
        resolve(true);
      } else if (wfParam.retCodeF === "C") {
        ElMessage.warning(wfParam.retMsg);
        nextUser(wfParam).then(resNext => {
          resolve(resNext);
        });
      } else if (wfParam.retCodeF === "B" || wfParam.retCodeF === "S") {
        ElMessage.success(wfParam.retMsg);
        //关闭窗口
        if (wfParam.wfResult && wfParam.wfResult.retCode === "B008") {
          szdRouter.closeFrameTag();
        } else {
          resolve(true);
        }
      } else {
        ElMessage.error(wfParam.retMsg);
        resolve(false);
      }
    });
  });
}

/**
 * 选择下一审批用户
 * @param {Object} wfParam
 * @return {Promise} 返回对象是选择的用户
 */
export function nextUser(wfParam) {
  return new Promise((resolve, reject) => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(wfNextUser, {
      wfParam: wfParam,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
        if (!resolveFlag) {
          reject(false);
        }
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

/**
 * 消费记录
 * @param {Object} bussBase 业务主体
 * @param {Array} invList 已选发票清单
 * @return {Promise} 返回数组是选择的消费记录
 */
export function consume(bussBase, invList) {
  return new Promise((resolve, reject) => {
    let resolveFlag = false;
    const div = document.createElement("div");
    const vNode = createVNode(wfConsume, {
      bussBase: bussBase,
      invList: invList,
      onOkay: retObj => {
        resolve(retObj);
        resolveFlag = true;
      },
      onCloseForm: () => {
        if (!resolveFlag) {
          reject(false);
        }
        document.body.removeChild(div);
      }
    });
    vNode.appContext = ctx;
    document.body.appendChild(div);
    render(vNode, div);
  });
}

/**
 * 设置上下文
 */
export function setWfAppTool(app) {
  ctx = app._context;
}
