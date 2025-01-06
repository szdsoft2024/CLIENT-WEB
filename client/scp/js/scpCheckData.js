import { getCheckDstArr, getFstDst } from "./scpFstField";

/***
 * 必输检查
 * @param {Array} ruleCat 规则目录
 *  [{
 *    tableCode: 数据结构代码
 *    tableName:数据结构名称
 *    tableType:数据结构类型 A抬头 B行表 C子表
 *    rowKey: 行健值字段
 *    rowKeyAuto:行健值自动流水
 *    cols:[{ //必输检查的字段
 *      fieldCode:字段代码
 *      fieldName:字段名称
 *      fieldType:数据类型
 *      ctrlType：控件类型
 *      max:最大值
 *      min:最小值
 *    }]
 *    subTable:[{ 子表结构
 *      tableCode：数据结构代码
 *      tableName:数据结构名称
 *      rowKey: 子表健值字段
 *      rowKeyAuto:子表健值自动流水
 *      cols:[{ //必输检查的字段
 *        fieldCode:字段代码
 *        fieldName:字段名称
 *        fieldType:数据类型
 *        ctrlType：控件类型
 *        max:最大值
 *        min:最小值
 *      }]
 *    }]
 *  }]
 * @param {Object} dataObj 数据对象
 * {
 *   header:{ 结构1:{}, 结构2:{} },
 *   item:{ 表1:[], 表2:[] }
 * }
 * @param {String} preSubTable 子表在行项目存储前缀，row[preSubTable+tableCode]
 *
 * */
export function checkData(ruleCat, dataObj, preSubTable = "") {
  let errMsg = [];
  //配置检查
  if (!ruleCat || ruleCat.length === 0) return [];
  //数据检查
  for (let i = 0; i < ruleCat.length; i++) {
    const rule = ruleCat[i];
    //检查规则
    if (!rule.tableCode || !rule.tableType) continue;

    //检查抬头数据
    if (rule.tableType === "A") {
      checkDataObj(rule, dataObj.header[rule.tableCode], errMsg, "", "");
      continue;
    }

    //检查行数据
    const rows = dataObj.item[rule.tableCode];
    if (!rows || rows.length === 0) continue;
    //检查行数据
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      const itemNo = rule.rowKey && row[rule.rowKey] ? row[rule.rowKey] : j + 1;
      //行数据检查
      checkDataObj(rule, row, errMsg, itemNo, "");
      //子表数据检查
      checkDataSubTable(rule, row, errMsg, preSubTable, itemNo);
    }
  }
  return errMsg;
}

function checkDataSubTable(rule, row, errMsg, preSubTable, itemNo) {
  //检查规则
  if (!rule.subTable || rule.subTable.length === 0) return;
  //循环子表
  for (let i = 0; i < rule.subTable.length; i++) {
    const ruleSub = rule.subTable[i];
    //检查规则
    if (!ruleSub.tableCode) continue;
    //检查子表数据
    const rowSubs = row[preSubTable + ruleSub.tableCode];
    if (!rowSubs || rowSubs.length === 0) continue;
    //子表数据检查
    for (let j = 0; j < rowSubs.length; j++) {
      const rowSub = rowSubs[j];
      const itemSubNo = ruleSub.rowKey && rowSub[ruleSub.rowKey] ? rowSub[ruleSub.rowKey] : j + 1;
      //子表数据检查
      checkDataObj(ruleSub, rowSub, errMsg, itemNo, itemSubNo);
    }
  }
}

function checkDataObj(rule, obj, errMsg, itemNo, itemSubNo) {
  //检查规则
  if (!rule.cols || rule.cols.length === 0) return;
  //消息
  let msg;
  if (rule.tableType === "A") {
    msg = "抬头";
  } else if (rule.tableType === "B") {
    msg = "行项目[第 " + itemNo + " 行]";
  } else {
    msg = "子项目[第 " + itemNo + "," + itemSubNo + " 行]";
  }
  let msgTable = "，表[ " + rule.tableName + " ]";

  if (!obj) {
    errMsg.push({ light: "1", retCode: "E", retMsg: msg + "对象不能为空" + msgTable });
    return;
  }
  //检查必输
  for (let i = 0; i < rule.cols.length; i++) {
    const col = rule.cols[i];
    if (col.fieldCode) {
      if (!obj[col.fieldCode]) {
        errMsg.push({ light: "1", retCode: "E", retMsg: msg + "字段[ " + col.fieldName + " ]不能为空" + msgTable });
        return;
      }
      //多选复选框检查
      if (col.fieldType === "array" && col.ctrlType === "checkbox") {
        const lenArr = obj[col.fieldCode].length;
        if (lenArr === 0) {
          errMsg.push({
            light: "1",
            retCode: "E",
            retMsg: msg + "字段[ " + col.fieldName + " ]不能为空" + msgTable
          });
          return;
        }
        if ((col.min > 0 && lenArr < col.min) || (col.max > 0 && lenArr > col.max)) {
          errMsg.push({
            light: "1",
            retCode: "E",
            retMsg: msg + "字段[ " + col.fieldName + " ]复选框选中数不正确" + msgTable
          });
          return;
        }
      }
    }
  }
}

/***
 * 数据状态检查
 * @param {Array} struct 数据结构
 * [{
 *    tableCode: 数据结构代码
 *    tableName:数据结构名称
 *    tableType:数据结构类型 A抬头 B行表 C子表
 *    rowKey: 行健值字段
 *    cols:[{
 *      fieldCode:字段代码
 *      fieldName:字段名称
 *    }]
 *    subTable:[{ 子表结构
 *      tableCode：数据结构代码
 *      tableName:数据结构名称
 *      rowKey: 子表健值字段
 *      cols:[{
 *        fieldCode:字段代码
 *        fieldName:字段名称
 *      }]
 *    }]
 *  }]
 * @param {Object} szddst 数据字段状态
 * {
 *  表: {  动态对应tableCode
 *    字段1: [{ 动态对应实际字段
 *            sel: [{ 数据条件
 *                   tableCode: 数据结构代码
 *                   tableType:数据结构类型 A抬头 B行表 C子表
 *                   fieldCode:字段代码
 *                   ranges: [{数据范围 option: 操作符, low: 低值, high: 高值 }]
 *                 }]
 *             val: 状态值
 *           }]
 *      }
 * }
 * @param {Object} dataObj 数据对象
 * {
 *   header:{ 结构1:{}, 结构2:{} },
 *   item:{ 表1:[], 表2:[] }
 * }
 * @param {String} preSubTable 子表在行项目存储前缀，row[preSubTable+tableCode]
 * */
export function checkDataDst(struct, szddst, dataObj, preSubTable = "") {
  let errMsg = [];
  //配置检查
  if (!struct || struct.length === 0 || !szddst || !dataObj) return [];
  //数据检查
  for (let i = 0; i < struct.length; i++) {
    const structAB = struct[i];
    //检查规则
    if (!structAB.tableCode || !["A", "B"].includes(structAB.tableType)) continue;

    //需要处理的数据结构
    const ckArr = getCheckDstArr(structAB, szddst);
    if (ckArr.length === 0) continue;

    //检查抬头数据
    if (structAB.tableType === "A") {
      checkDataDstObjA(ckArr[0], szddst, structAB, errMsg, dataObj, dataObj.header[structAB.tableCode]);
      continue;
    }

    //检查行数据
    const rows = dataObj.item[structAB.tableCode];
    if (!rows || rows.length === 0) continue;
    //检查行数据
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j];
      let itemNo = structAB.rowKey && row[structAB.rowKey] ? row[structAB.rowKey] : j + 1;
      //子表数据检查
      for (let k = 0; k < ckArr.length; k++) {
        const ckItem = ckArr[k];
        //行数据检查
        if (ckItem.tableCode === structAB.tableCode) {
          checkDataDstObjB(ckItem, szddst, structAB, errMsg, dataObj, row, itemNo);
        } else {
          //子表数据检查
          checkDataDstSubTable(ckItem, szddst, structAB, errMsg, dataObj, row, itemNo, preSubTable);
        }
      }
    }
  }
  return errMsg;
}

//抬头表检查-字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
function checkDataDstObjA(ckItem, szddst, structAB, errMsg, dataObj, headObj) {
  const msg = "抬头";
  const msgTable = "，表[ " + structAB.tableName + " ]";
  for (let k = 0; k < ckItem.keys.length; k++) {
    const key = ckItem.keys[k];
    const fstVal = getFstDst(szddst[ckItem.tableCode][key], dataObj);
    if (fstVal === "2" && !headObj[key]) {
      const col = structAB.cols.find(r => r.fieldCode === key);
      const msgFName = col ? col.fieldName : key;
      errMsg.push({ light: "1", retCode: "E", retMsg: msg + "字段[" + msgFName + " ]不能为空" + msgTable });
    } else if (fstVal === "5") {
      if (headObj[key]) headObj[key] = undefined;
    }
  }
}

//行表检查
function checkDataDstObjB(ckItem, szddst, structAB, errMsg, dataObj, row, itemNo) {
  const msg = "行项目[第 " + itemNo + " 行]";
  const msgTable = "，表[ " + structAB.tableName + " ]";
  for (let k = 0; k < ckItem.keys.length; k++) {
    const key = ckItem.keys[k];
    const fstVal = getFstDst(szddst[ckItem.tableCode][key], dataObj, row);
    if (fstVal === "2" && !row[key]) {
      const col = structAB.cols.find(r => r.fieldCode === key);
      const msgFName = col ? col.fieldName : key;
      errMsg.push({ light: "1", retCode: "E", retMsg: msg + "字段[" + msgFName + " ]不能为空" + msgTable });
    } else if (fstVal === "5") {
      if (row[key]) row[key] = undefined;
    }
  }
}

//子表检查
function checkDataDstSubTable(ckItem, szddst, structAB, errMsg, dataObj, row, itemNo, preSubTable) {
  //检查子表数据
  const rowSubs = row[preSubTable + ckItem.tableCode];
  if (!rowSubs || rowSubs.length === 0) return;

  const structC = structAB.subTable.find(r => r.tableCode === ckItem.tableCode);

  //子表数据检查
  for (let i = 0; i < rowSubs.length; i++) {
    const rowSub = rowSubs[i];
    const itemSubNo = structC.rowKey && rowSub[structC.rowKey] ? rowSub[structC.rowKey] : i + 1;
    //子表数据检查
    checkDataDstObjC(ckItem, szddst, structC, errMsg, dataObj, row, rowSub, itemNo, itemSubNo);
  }
}

//子表检查
function checkDataDstObjC(ckItem, szddst, structC, errMsg, dataObj, row, rowSub, itemNo, itemSubNo) {
  const msg = "子项目[第 " + itemNo + "," + itemSubNo + " 行]";
  const msgTable = "，表[ " + structC.tableName + " ]";
  for (let k = 0; k < ckItem.keys.length; k++) {
    const key = ckItem.keys[k];
    const fstVal = getFstDst(szddst[ckItem.tableCode][key], dataObj, row, rowSub);
    if (fstVal === "2" && !rowSub[key]) {
      const col = structC.cols.find(r => r.fieldCode === key);
      const msgFName = col ? col.fieldName : key;
      errMsg.push({ light: "1", retCode: "E", retMsg: msg + "字段[" + msgFName + " ]不能为空" + msgTable });
    } else if (fstVal === "5") {
      if (rowSub[key]) rowSub[key] = undefined;
    }
  }
}
