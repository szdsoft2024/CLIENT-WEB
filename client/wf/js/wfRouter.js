import store from "~store";
import router from "@/router";
import szdRouter from "../../common/utils/goRouter";
import { $m } from "../../common/utils/globalConfig";
import { wfEisImg } from "../api/wfApi";

/**
 * 获取URL地址参数
 * @param {Object} obj 设置参数 bussId、userId、option
 */
export function getUrlParams(obj) {
  const query = router.currentRoute.value.query;
  if (query.bussId) obj.bussId = query.bussId;
  obj.userId = query.userId ? query.userId : store.state.loginUser.user.userId;
  if (query.option) {
    obj.option = query.option;
  } else {
    if (obj.bussId) {
      obj.option = "V";
    } else {
      obj.option = "C";
    }
  }
}

/**
 * 单据穿透 路由跳转
 * @param {String} routerCode 路由代码
 * @param {String} bussId 业务id
 * @param {String} userId 用户id
 * @param {String} option V显示 U更改 C创建
 * @param {String} program 程序代码-零代码测试使用
 */
export function goDoc(routerCode, bussId, userId = "", option = "V", program = "") {
  let _userId = userId ? userId : store.state.loginUser.user.userId;
  if (routerCode === "CORE_SCP_03B") {
    szdRouter.goNav(routerCode, { bussId: bussId, userId: _userId, option: option, program: program });
  } else {
    szdRouter.goNav(routerCode, { bussId: bussId, userId: _userId, option: option });
  }
}

/**
 * 打印
 * @param {String} routerCode 路由代码
 * @param {String} bussIds  业务id，多个,分割
 */
export function goPrint(routerCode, bussIds) {
  //检查和获取路由对象
  const routerObj = store.state.loginUser.routesObj[routerCode];
  if (routerObj.routerCodePrt) {
    szdRouter.goNav(routerCode, { routerCode: routerCode, bussId: bussIds }, { prt: true });
  } else if (routerObj.programPrt) {
    let printArr = [];
    const bArr = bussIds.split(",");
    for (let i = 0; i < bArr.length; i++) {
      printArr.push({ program: routerObj.programPrt, bussId: bArr[i] });
    }
    szdRouter.goNavPrt(printArr);
  }
}

/**
 * 批量打印
 * @param {Array} paramArr [{routerCode:路由代码,bussId  业务id}]
 */
export function goPrintBatch(paramArr) {
  let routerCode = "";
  let bussIds = "";
  for (let i = 0; i < paramArr.length; i++) {
    if (routerCode === "") {
      routerCode = paramArr[i].routerCode;
      bussIds = paramArr[i].bussId;
    } else {
      if (routerCode !== paramArr[i].routerCode) {
        $m("CORE_CLIENT.E100", [routerCode, paramArr[i].routerCode]); //请选择相同的业务功能 & ≠ &
        return;
      }
      bussIds = bussIds + "," + paramArr[i].bussId;
    }
  }
  if (!store.state.loginUser.routesObj[routerCode].routerCodePrt && !store.state.loginUser.routesObj[routerCode].programPrt) {
    $m("CORE_CLIENT.E101", routerCode); //业务功能 & 不支持批量打印
    return;
  }
  goPrint(routerCode, bussIds);
}

/**
 * 电子影像
 * @param {Object} params 参数对象
 * { bussId: 业务Id, userId: 用户id szdopt: 操作V显示U编辑 }
 *
 */
export function eisImg(params) {
  wfEisImg(params).then(res => {
    if (res.code === 200 && res.data.eisId) {
      szdRouter.goNav("SEIS_MGT_01A", { eisOs: "Y", eisId: res.data.eisId, token: "blank", szdopt: res.data.szdopt });
    } else {
      $m("CORE_CLIENT.E102", res.data.retMsg); //调用电子影像接口失败
    }
  });
}

/**
 * 电子附件
 * @param {Object} params 参数对象
 * { bussId: 业务Id, userId: 用户id szdopt: 操作V显示U编辑 }
 */
export function eisAtt(params) {
  wfEisImg(params).then(res => {
    if (res.code === 200 && res.data.eisId) {
      szdRouter.goNavDg("SEIS_MGT_02A", { eisOs: "Y", eisId: res.data.eisId, token: "blank", szdopt: res.data.szdopt });
    } else {
      $m("CORE_CLIENT.E102", res.data.retMsg); //调用电子影像接口失败
    }
  });
}

/**
 * 查看凭证
 * @param {String} bussId 业务Id
 */
export function goVch(bussId) {
  szdRouter.goNavDg("CORE_VCH_01B", { bussId: bussId });
}
