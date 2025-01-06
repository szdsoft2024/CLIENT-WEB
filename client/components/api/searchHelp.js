import request from "../../common/utils/request";

//搜索帮助-配置
export function searchHelpParams(baseField) {
  return request({
    url: "/core/dev/baseField/sh/" + baseField + "/pc",
    method: "get"
  });
}

//搜索帮助-数据列表
export function searchHelpList(query, url) {
  return request({
    url: url,
    method: "post",
    data: query
  });
}

//添加常用值
export function addCommonValues(data) {
  return request({
    url: "/core/common/sh/com/add",
    method: "post",
    data: data
  });
}

//删除常用值
export function delCommonValues(data) {
  return request({
    url: "/core/common/sh/com/del",
    method: "post",
    data: data
  });
}

//搜索帮助-数据同步
export function syncMdm(baseField) {
  return request({
    url: "/core/common/sh/sync/" + baseField + "/" + "PC",
    method: "get"
  });
}
