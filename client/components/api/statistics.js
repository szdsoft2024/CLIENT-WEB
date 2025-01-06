import request from "../../common/utils/request";

//保存变式
export function saveVariant(data) {
  return request({
    url: "/core/dev/variant/statistics/save",
    method: "put",
    data: data
  });
}

//获取默认变式
export function getVarDef(report) {
  return request({
    url: "/core/dev/variant/statistics/default/" + report,
    method: "get"
  });
}

//获取变式清单
export function getVarList(report) {
  return request({
    url: "/core/dev/variant/statistics/list/" + report,
    method: "get"
  });
}

//设置默认变式
export function setVarDef(data) {
  return request({
    url: "/core/dev/variant/statistics/default",
    method: "post",
    data: data
  });
}

//取消默认变式
export function removeVarDef(data) {
  return request({
    url: "/core/dev/variant/statistics/default/remove",
    method: "post",
    data: data
  });
}

//删除变式
export function delVariant(data) {
  return request({
    url: "/core/dev/variant/statistics/delete",
    method: "delete",
    data: data
  });
}
