import request from "../../common/utils/request";

//下载模板
export function downloadTemplate(fileName) {
  return request({
    url: "/core/dev/pro/template/download?fileName=" + fileName,
    method: "get",
    responseType: "blob"
  });
}
