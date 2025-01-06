import request from "../../../client/common/utils/request";

//新增初始化
export function wfInit(routerCode) {
  return request({
    url: "/core/wf/service/init/" + routerCode,
    method: "get"
  });
}

//电子影像
export function wfEisImg(params) {
  return request({
    url: "/core/wf/service/eis/img",
    method: "post",
    data: params
  });
}

//评审
export function wfAddMeeting(bussId) {
  return request({
    url: "/core/wf/per/meet/send/add/" + bussId,
    method: "post"
  });
}

//接口调用流程审批
export function wfApproveRemote(wfEvt) {
  return request({
    url: "/core/wf/service/approveRemote",
    method: "post",
    data: wfEvt
  });
}

//审批信息
export function wfApprInfo(bussId) {
  return request({
    url: "/core/wf/service/apprInfo/" + bussId,
    method: "get"
  });
}

//评审消息详情
export function wfMsgList(bussId, nodeDoc) {
  return request({
    url: "/core/wf/per/meet/msg/list/" + bussId + "/" + nodeDoc,
    method: "get"
  });
}
