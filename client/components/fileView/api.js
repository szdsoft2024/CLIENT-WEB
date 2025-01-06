import request from "../../../client/common/utils/request";

//附件流
export function downloadFile(url) {
  return request({
    url: "/core/common/file/view",
    method: "get",
    params: {url},
    responseType: "blob"
  });
}
