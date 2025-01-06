import request from "../../common/utils/request";

//下拉框请求-基础字段配置SQL语句
export function selectBaseView(data) {
  return request({
    url: "/core/common/selectOpt/baseField/list",
    method: "post",
    data: data
  });
}
