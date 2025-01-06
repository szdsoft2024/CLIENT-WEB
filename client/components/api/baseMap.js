import request from "../../common/utils/request";
//详情
export function getBaseField(fieldCode) {
  return request({
    url: "/core/dev/baseField/" + fieldCode,
    method: "get"
  });
}

//查询表结构
export function getTableColumnList(sysCode, tableCode) {
  return request({
    url: "/core/dev/table/" + sysCode + "/" + tableCode,
    method: "get"
  });
}
