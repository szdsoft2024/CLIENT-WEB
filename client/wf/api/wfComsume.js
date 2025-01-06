import request from "../../../client/common/utils/request";

/**
 * 消费记录-本单发票
 * @param bussId 业务Id
 * @returns {*} 消费记录清单
 */
export function wfEisConsumeImg(bussId) {
  return request({
    url: "/core/wf/service/eis/consume/img/" + bussId,
    method: "get"
  });
}

/**
 * 消费记录-个人票夹
 * @param bussId 业务Id
 * @param data
 * @returns {*} 消费记录清单
 */
export function wfEisConsumeFol(bussId, data) {
  return request({
    url: "/core/wf/service/eis/consume/fol/" + bussId,
    method: "post",
    data: data
  });
}

/**
 * 消费记录-票夹到影像
 * @param data 业务Id
 */
export function wfEisConsumeFolToImg(data) {
  return request({
    url: "/core/wf/service/eis/consume/fol/moveToImg",
    method: "post",
    data: data
  });
}
