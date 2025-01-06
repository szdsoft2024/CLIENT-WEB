import szdTool from "../../common/tools/tool";

/***
 * 获取字段状态
 * @param {Object} szdfst 结构字段状态(结构层面)
 *  { 字段: 值 }
 * @param {Object} szddst 数据字段状态(根据数据动态控制)
 * { "字段":
 *   [{
 *     sel: [{ 数据条件
 *            tableCode: 数据结构代码
 *            tableType:数据结构类型 A抬头 B行表 C子表
 *            fieldCode:字段代码
 *            ranges: [{数据范围 option: 操作符, low: 低值, high: 高值 }]
 *          }]
 *     val: 状态值
 *   }]
 * }
 * @param {String} fieldCode 获取字段
 * @param {Object} dataObj 数据对象
 * {
 *   header:{ 结构1:{}, 结构2:{} },
 *   item:{ 表1:[], 表2:[] }
 * }
 * @return  {String} 字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
 * */
export function getFst(szdfst, szddst, fieldCode, dataObj) {
  if (!szdfst && !szddst) return "";
  //字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
  let fstVal = "";
  //数据设置状态
  if (szddst && szddst[fieldCode]) {
    fstVal = getFstDst(szddst[fieldCode], dataObj);
  }
  //直接设置状态
  if (!fstVal && szdfst && szdfst[fieldCode]) {
    fstVal = szdfst[fieldCode];
  }
  return fstVal;
}

/***
 * 获取数据字段状态
 * @param {Array} dstArr 数据状态数组
 *  [{
 *     sel: [{ 数据条件
 *            tableCode: 数据结构代码
 *            tableType:数据结构类型 A抬头 B行表 C子表
 *            fieldCode:字段代码
 *            ranges: [{数据范围 option: 操作符, low: 低值, high: 高值 }]
 *          }]
 *     val: 状态值
 *  }]
 * @param {Object} dataObj 数据对象
 * {
 *   header:{ 结构1:{}, 结构2:{} },
 *   item:{ 表1:[], 表2:[] }
 * }
 * @param {Object} row 行数据
 * @param {Object} rowSub 子表数据
 * */
export function getFstDst(dstArr, dataObj, row = undefined, rowSub = undefined) {
  if (dstArr.length === 0) return "";
  for (let i = 0; i < dstArr.length; i++) {
    const gItem = dstArr[i];
    if (!gItem.val || !gItem.sel || gItem.sel.length === 0) continue;
    //检查条件
    let ck = true;
    for (let j = 0; j < gItem.sel.length; j++) {
      const rItem = gItem.sel[j];
      if (rItem.tableCode && rItem.fieldCode) {
        if (rItem.tableType === "A") {
          if (dataObj && dataObj.header && dataObj.header[rItem.tableCode]) {
            ck = szdTool.range(dataObj.header[rItem.tableCode][rItem.fieldCode], rItem.ranges);
          } else {
            ck = false;
          }
        } else if (rItem.tableType === "B") {
          ck = row ? szdTool.range(row[rItem.fieldCode], rItem.ranges) : false;
        } else if (rItem.tableType === "C") {
          ck = rowSub ? szdTool.range(rowSub[rItem.fieldCode], rItem.ranges) : false;
        }
      } else {
        ck = false;
      }
      if (!ck) break;
    }
    //检查通过，返回状态
    if (ck) return gItem.val;
  }
  return "";
}

/***
 * 获取按钮状态
 * @param {Object} szdbtn 按照状态(结构层面)
 *  { 按钮Key: 值(1.可选 3.仅显示、4.隐藏) }
 * @param {String} fCode 按钮Key
 * @return  {String} 字段状态： ""或1.可选 3.仅显示、4.隐藏
 * */
export function getFstBtn(szdbtn, fCode) {
  if (!szdbtn || !fCode) return "";
  let fstVal = szdbtn[fCode] ? szdbtn[fCode] : "";
  if (fstVal === "2") {
    fstVal = "1";
  } else if (fstVal === "5") {
    fstVal = "4";
  }
  return fstVal;
}

/***
 * 获取需要检查的表清单
 * @param {Object} structAB 数据结构
 * {
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
 *  }
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
 * @return {Array} 需要按照数据状态检查的表清单
 * [{
 *   tableCode: 数据结构代码
 *   key:[字段1，字段2]  对应 szddst 数据字段状态 表的字段
 * }]
 * */
export function getCheckDstArr(structAB, szddst) {
  let ckArr = [];
  if (szddst[structAB.tableCode]) {
    const keys = Object.keys(szddst[structAB.tableCode]);
    if (keys.length > 0) ckArr.push({ tableCode: structAB.tableCode, keys: keys });
  }
  //数据状态的对象是否存在子表
  if (structAB.tableType === "B") {
    for (let j = 0; j < structAB.subTable.length; j++) {
      const structC = structAB.subTable[j];
      if (structC.tableCode && szddst[structC.tableCode]) {
        const keys = Object.keys(szddst[structC.tableCode]);
        if (keys.length > 0) ckArr.push({ tableCode: structC.tableCode, keys: keys });
      }
    }
  }
  return ckArr;
}

/***
 * 设置表单单元格状态
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
 * @param {String} fOptionCell 行和子表上 单元格样式字段，与layout.optionCell一致
 * */
export function setFstCellData(struct, szddst, dataObj, preSubTable = "", fOptionCell = "") {
  if (!struct || struct.length === 0 || !szddst || !fOptionCell || !dataObj.item) return;
  if (Object.keys(szddst).length === 0) return;
  //数据字段状态
  for (let i = 0; i < struct.length; i++) {
    const structB = struct[i];
    if (structB.tableType !== "B") continue;
    //检查行数据
    if (!dataObj.item[structB.tableCode] && dataObj.item[structB.tableCode].length === 0) continue;

    //需要处理的数据结构
    const ckArr = getCheckDstArr(structB, szddst);
    if (ckArr.length === 0) continue;

    //设置单元格
    for (let k = 0; k < dataObj.item[structB.tableCode].length; k++) {
      let row = dataObj.item[structB.tableCode][k];
      setFstCellDataRow(ckArr, szddst, structB, dataObj, row, preSubTable, fOptionCell);
    }
  }
}

/***
 * 设置表单的单元格-状态
 * @param {Array} ckArr 需要检查结构的字段
 *  [{
 *    tableCode: 数据结构代码
 *    keys: [字段1,字段2]
 *  }]
 * @param {Object} szddst 数据字段状态
 * @param {Object} structB 数据结构-行结构参数
 * @param {Object} dataObj 数据对象
 * @param {Object} row 行数据
 * @param {String} preSubTable 子表在行项目存储前缀，row[preSubTable+tableCode]
 * @param {String} fOptionCell 行和子表上 单元格样式字段，与layout.optionCell一致
 * */
function setFstCellDataRow(ckArr, szddst, structB, dataObj, row, preSubTable, fOptionCell) {
  for (let i = 0; i < ckArr.length; i++) {
    const item = ckArr[i];
    //设置行表数据字段状态
    if (item.tableCode === structB.tableCode) {
      if (!row[fOptionCell]) row[fOptionCell] = {};
      //设置数据字段状态-行表
      for (let k = 0; k < item.keys.length; k++) {
        const key = item.keys[k];
        setFstCellDataFst(szddst[item.tableCode][key], row[fOptionCell], key, dataObj, row);
      }
    } else {
      //设置子表状态
      let rowSubs = row[preSubTable + item.tableCode];
      //检查子表数据
      if (!rowSubs || rowSubs.length === 0) continue;
      //循环子表
      for (let j = 0; j < rowSubs.length; j++) {
        let rowSub = rowSubs[i];
        if (!rowSub[fOptionCell]) rowSub[fOptionCell] = {};
        //设置数据字段状态-子表
        for (let k = 0; k < item.keys.length; k++) {
          const key = item.keys[k];
          setFstCellDataFst(szddst[item.tableCode][key], rowSub[fOptionCell], key, dataObj, row, rowSub);
        }
      }
    }
  }
}

/***
 * 设置表单的单元格-状态
 * @param {Array} dstArr 数据状态数组
 *  [{
 *     sel: [{ 数据条件
 *            tableCode: 数据结构代码
 *            tableType:数据结构类型 A抬头 B行表 C子表
 *            fieldCode:字段代码
 *            ranges: [{数据范围 option: 操作符, low: 低值, high: 高值 }]
 *          }]
 *     val: 状态值
 *  }]
 * @param {Object} optionCell 程序对象 {header:{},item:{}}
 * @param {Object} key 建值 optionCell中对应的键值
 * @param {Object} dataObj 数据对象
 * @param {Object} row 行数据
 * @param {Object} rowSub 子表数据
 * */
function setFstCellDataFst(dstArr, optionCell, key, dataObj, row, rowSub = undefined) {
  let fstVal = getFstDst(dstArr, dataObj, row, rowSub);
  let optSt;
  //字段状态： 1.可选  2.必输  3.仅显示、4.隐藏、5.隐藏-清空
  if (fstVal === "1") {
    optSt = { disabled: false, readonly: false, hide: false };
  } else if (fstVal === "2") {
    optSt = { disabled: false, readonly: false, hide: false };
  } else if (fstVal === "3") {
    optSt = { disabled: true, readonly: true, hide: false };
  } else if (fstVal === "4" || fstVal === "5") {
    optSt = { disabled: true, readonly: true, hide: true };
  } else {
    optSt = false;
  }
  if (optSt) {
    if (!optionCell[key]) optionCell[key] = {};
    optionCell[key]["disabled"] = optSt.disabled;
    optionCell[key]["readonly"] = optSt.readonly;
    optionCell[key]["hide"] = optSt.hide;
  } else if (optionCell[key]) {
    delete optionCell[key];
  }
}

/***
 * 设置报表单元格状态
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
 * @param {Array} rows 数据对象
 * @param {String} preSubTable 子表在行项目存储前缀，row[preSubTable+tableCode]
 * @param {String} fOptionCell 行和子表上 单元格样式字段，与layout.optionCell一致
 * */
export function setFstCellRows(struct, szddst, rows, preSubTable = "", fOptionCell = "") {
  if (!struct || struct.length === 0 || !szddst || !fOptionCell || !rows || rows.length === 0) return;
  if (Object.keys(szddst).length === 0) return;
  //数据字段状态
  const structB = struct[0];
  if (structB.tableType !== "B") return;

  //需要处理的数据结构
  const ckArr = getCheckDstArr(structB, szddst);
  if (ckArr.length === 0) return;

  //设置单元格
  for (let k = 0; k < rows.length; k++) {
    let row = rows[k];
    setFstCellDataRow(ckArr, szddst, structB, undefined, row, preSubTable, fOptionCell);
  }
}
