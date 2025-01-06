import store from "~store";
import { $m } from "../../common/utils/globalConfig";
import { szdSh } from "../../components/searchHelp/serchHelp";

/**
 * 业务类型搜索帮助
 * @param {String} routerCode 业务路由
 * @param {Object} objData 数据对象
 */
export function shBT(routerCode, objData) {
  if (routerCode) {
    szdSh({
      a: "CORE_BSTP",
      b: objData,
      c: ["bstp", "bstpName"],
      d: [["routerCode", routerCode]]
    }).then();
  }
}

/**
 * 业务小类搜索帮助
 * @param {String} bussType 业务类型
 * @param {String} structCode 数据结构代码
 * @param {Object} objData 数据对象
 */
export function shBTS(bussType, structCode, objData) {
  if (!bussType) {
    $m("CORE_CLIENT.W007"); //请先维护业务类型
    return;
  }
  szdSh({
    a: "CORE_BSUB01",
    b: objData,
    c: ["bsub", "bsubName"],
    d: [
      ["bstp", bussType],
      ["structCode", structCode]
    ]
  }).then();
}

/**
 * 动态工作流搜索帮助
 * @param {String} bussType 业务类型
 * @param {Object} objData 数据对象
 */
export function shDyId(bussType, objData) {
  if (!bussType) {
    $m("CORE_CLIENT.W007"); //请先维护业务类型
    return;
  }
  let _userId = store.state.loginUser.user.userId;
  szdSh({
    a: "CORE_WFDY",
    b: objData,
    c: ["wfDyId", "wfDyName"],
    d: [
      ["bstp", bussType],
      ["userId", _userId]
    ]
  }).then();
}
