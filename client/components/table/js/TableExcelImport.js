import _ from "lodash";
import { $m } from "../../../common/utils/globalConfig";
import { getExcelHeader } from "./TableExcelHeader";
import { szdMsgBox } from "../../msgBox/msgBox";

export function excelUploadProc(lay, objData, uplData) {
  //表头设置
  const colHead = getExcelHeader(lay.value.fCatCol, true);
  //数据列字段
  let colFCat = Object.keys(lay.value.fCatUse);
  //检查是否有上传数据
  if (uplData.length < colHead.header.length + 1) {
    $m("CORE_CLIENT.W014"); //无需要导入的数据
    return false;
  }
  //检查列头是否正确
  const uplKeys = Object.keys(uplData[0]);
  for (let i = 0; i < uplKeys.length; i++) {
    if (!colFCat.includes(uplKeys[i])) {
      $m("CORE_CLIENT.E030"); //请先下载正确的模板，下载后表头行不要发生改变（列可删除）
      return false;
    }
  }
  //添加数据
  let rowData = [];
  let errorMsg = [];
  for (let i = colHead.header.length; i < uplData.length; i++) {
    const item = uplData[i];
    let rowObj = {};
    for (let j = 0; j < colFCat.length; j++) {
      const fCat = lay.value.fCatUse[colFCat[j]];
      if (!fCat.$SZDCol) continue;
      //对象添加字段
      if (fCat.type === "number") {
        rowObj[fCat.field] = 0;
      } else {
        rowObj[fCat.field] = "";
      }
      //检查和赋值数据
      excelUploadCheck(item, rowObj, fCat, errorMsg, i + 2);
    }
    rowData.push(rowObj);
  }
  //存在报错，弹出窗口提醒
  if (errorMsg.length === 0) {
    objData.value.push(...rowData);
    return true;
  } else {
    szdMsgBox(errorMsg).then(() => {
      return false;
    });
  }
}

//导入数据
function excelUploadCheck(item, rowObj, fCat, errorMsg, rowNum) {
  let l_val = item[fCat.field];
  if (l_val) {
    //存在分割符，数据自动分割
    if (fCat.importSplit) {
      l_val = l_val.split(fCat.importSplit)[0];
    }
    //检查数据类型 ["string", "number", "boolean", "date", "datetime", "time", "year", "month", "button", "sub-table"]; //数据类型
    switch (fCat.type) {
      case "string":
        rowObj[fCat.field] = l_val;
        break;
      case "number":
        //替换千分位符
        if (!_.isNumber(l_val)) {
          l_val = l_val.replaceAll(",", "");
        }
        if (_.isNumber(l_val)) {
          if (!isNaN(fCat.numDec) && fCat.numDec >= 0 && new RegExp("\\.\\d{" + (fCat.numDec + 1) + ",}$").test(l_val)) {
            errorMsgAdd(errorMsg, $m("CORE_CLIENT.E031", [rowNum, l_val, fCat.numDec], false, true)); //第 & 行数据的值：& 维护错误，小数位超过 & 位
          } else {
            rowObj[fCat.field] = Number(l_val);
          }
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E032", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是数值类型
        }
        break;
      case "boolean":
        if (["false", false, "否", "No", "N"].includes(l_val)) {
          rowObj[fCat.field] = false;
        } else if (["true", true, "是", "Yes", "Y"].includes(l_val)) {
          rowObj[fCat.field] = true;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E033", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，只能维护：false、否、No、N、true、是、Yes、Y其中之一
        }
        break;
      case "date":
        const regexDate = /^\d{4}\d{2}\d{2}$/;
        if (l_val.length === 8 && regexDate.test(l_val)) {
          l_val = l_val.slice(0, 4) + "-" + l_val.slice(4, 6) + "-" + l_val.slice(6, 8);
        }
        const _date = new Date(l_val);
        if (!isNaN(_date.getTime())) {
          rowObj[fCat.field] = l_val;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E034", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是日期类型
        }
        break;
      case "datetime":
        const _datetime = new Date(l_val);
        if (!isNaN(_datetime.getTime())) {
          rowObj[fCat.field] = l_val;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E035", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是日期时间格式
        }
        break;
      case "time":
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (regex.test(l_val)) {
          rowObj[fCat.field] = l_val;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E036", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是时间格式
        }
        break;
      case "year":
        if (l_val >= 1000 && l_val <= 9999) {
          rowObj[fCat.field] = l_val;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E037", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是年
        }
        break;
      case "month":
        let _month = { year: "", month: "" };
        if (l_val.length === 6) {
          _month.year = l_val.toString().substring(0, 4);
          _month.month = l_val.toString().substring(4, 6);
        } else if (l_val.length === 7) {
          _month.year = l_val.toString().substring(0, 4);
          _month.month = l_val.toString().substring(5, 7);
        }
        if (_month.year >= "1000" && _month.year <= "9999" && _month.month >= "01" && _month.month >= "12") {
          rowObj[fCat.field] = _month.year + _month.month;
        } else {
          errorMsgAdd(errorMsg, $m("CORE_CLIENT.E038", [rowNum, l_val], false, true)); //第 & 行数据的值：& 维护错误，不是年月格式
        }
        break;
      default:
        break;
    }
  } else {
    //检查必输
    if (fCat.required) {
      errorMsgAdd(errorMsg, $m("CORE_CLIENT.E039", [rowNum, l_val], false, true)); //第 & 行数据对应的字段  & 不能为空
    }
  }
}

function errorMsgAdd(errorMsg, msg) {
  errorMsg.push({ light: 1, retCode: "E", retMsg: msg });
}
