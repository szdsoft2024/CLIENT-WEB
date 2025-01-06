import request from "../../common/utils/request";

//下拉框请求-基础字段配置SQL语句
export function getCityList() {
  return request({
    url: "/core/mdm/area/city",
    method: "get"
  });
}
