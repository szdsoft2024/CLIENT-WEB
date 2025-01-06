import sDate from "./date";
import szdStoreSession from "../store/storeSession";
import szdRouter from "../utils/goRouter";
import { range } from "./range";
import { lockOff, lockOn } from "./lock";
import { $m, $t } from "../utils/globalConfig";

/**
 * 下载文件(字节流方式)
 * @param {Blob} fileStream 文件流
 * @param {String} fileType 文件类型
 * @param {String} fileName 下载的文件名称
 */
function downloadFile(fileStream, fileType, fileName) {
  // 利用a标签自定义下载文件名
  const link = document.createElement("a");
  // 创建Blob对象，设置文件类型
  let blob = new Blob([fileStream], { type: `application/${fileType}` });
  let objectUrl = URL.createObjectURL(blob); // 创建URL
  link.href = objectUrl;
  link.download = fileName || sDate.format(undefined, "YYYYMMDDHHmmss"); // 自定义文件名
  link.click(); // 下载文件
  URL.revokeObjectURL(objectUrl); // 释放内存
  $m("CORE_CLIENT.S010"); //导出文件成功
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 空
 */
function getTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId = rootId || "";
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

/**
 * 获取联动最终值
 * @param {*} menuIds 联动选择的值
 * @return {String} 返回周后一个节点
 * */
function getCascader(menuIds) {
  if (menuIds && Array.isArray(menuIds)) {
    if (menuIds.length === 0) {
      return "";
    } else {
      return menuIds[menuIds.length - 1];
    }
  } else {
    return menuIds;
  }
}

/**
 * 复制数据转化可粘贴表数据
 */
async function getPaste() {
  const res = await navigator.clipboard.readText();
  return res
    .replace(/"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm, function (match, p1) {
      return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
    })
    .split(/\r\n|\n\r|\n|\r/g);
}

/**
 * 标题文本处理
 * @param option 操作类型
 */
function getTitle(option) {
  if (option === "C") return $t("新增");
  if (option === "U") return $t("更改");
  if (option === "V") return $t("显示");
  return "";
}

/**
 * 转驼峰
 * @param {String} str
 */
function toCamelCase(str) {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

/**
 * 帮助文档
 * @param {String} docId 帮助文档id
 */
function helpDoc(docId) {
  szdRouter.goNavDg("SKIS_05B", { docId: docId });
}

/**
 * 打开SAP事务代码
 * @param {String} tCode 事务代码
 * @param {Object} params 地址参数
 * @param {String} okCode 功能码
 */
function goSapTCode(tCode, params = {}, okCode = " ") {
  if (!tCode) return;
  const sapWebguiUrl = szdStoreSession.getWebParams("sap_webgui_url");
  if (sapWebguiUrl) {
    let _par = "";
    for (let key in params) {
      if (_par) {
        _par = _par + ";";
      } else {
        _par = _par + encodeURIComponent(" ");
      }
      _par = _par + key + "=" + encodeURIComponent(params[key]);
    }
    let url = sapWebguiUrl + tCode + _par + "&~OKCODE=" + encodeURIComponent(okCode);
    window.open(url, "_blank");
  }
}

const szdTool = {
  range,
  downloadFile,
  getTree,
  getCascader,
  getPaste,
  getTitle,
  toCamelCase,
  helpDoc,
  goSapTCode,
  lockOn,
  lockOff
};

export default szdTool;
