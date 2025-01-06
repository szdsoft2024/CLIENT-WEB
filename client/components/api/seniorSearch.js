import request from "../../common/utils/request";

//保存变式
export function saveVariant(data) {
  return request({
    url: "/core/dev/variant/seniorSearch/save",
    method: "put",
    data: data
  });
}

//获取变式清单
export function getVarList(report) {
  return request({
    url: "/core/dev/variant/seniorSearch/list/" + report,
    method: "get"
  });
}

//删除变式
export function delVariant(data) {
  return request({
    url: "/core/dev/variant/seniorSearch/delete",
    method: "delete",
    data: data
  });
}
