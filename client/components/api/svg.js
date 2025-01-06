import request from "../../common/utils/request";

// 查询列表
export function listSvg(query) {
  return request({
    url: "/core/dev/svg/read/",
    method: "get",
    params: query
  });
}
