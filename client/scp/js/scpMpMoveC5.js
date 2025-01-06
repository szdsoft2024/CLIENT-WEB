/**
 * C5汇总 汇总仅能上级对下级、或本对象内汇总，表头客户相互汇总
 * @param {Object} move 赋值规则
 * {
 *  赋值类型
 *    type: 枚举 C4.赋值 C5.汇总
 *  赋值目标
 *    to: {
 *      tableCode: 数据结构
 *      tableType: 表类型：A.抬头表 B.行项目 C.子项目
 *      tableItem: 行项目表，子项目表对应的行项目表
 *      fieldCode: 数据结构字段
 *      fieldCodeDb: fieldCode是否数据库字段，数据库字段显示状态不运算
 *    },
 *  赋值来源
 *    from: [{
 *      tableCode: 数据结构
 *      tableType: 表类型：A.抬头表 B.行项目 C.子项目
 *      tableItem: 行项目表，子项目表对应的行项目表
 *      fieldCode: 数据结构字段
 *      fixValue：固定值，fieldCode 字段为空时，取固定值，C5此字段不适用
 *      moveRule：赋值规则，C4：枚举 A.直接赋值 B.下行为空不赋值 C5枚举：+相加 -相减
 *    }]
 *  }
 * @param {Object} dataObj 数据对象 {header:{},item:{}}
 * @param {Object} row 行项目数据 {}
 * @param {Object} rowSub 子项目数据 {}
 * @param {String} preSubTable 子项目数据在行项目存储的规则，row[preSubTable+tableCode]
 *
 * */
export function setMoveC5(move, dataObj, row, rowSub, preSubTable = "") {
  let val = 0;
  for (let j = 0; j < move.from.length; j++) {
    const item = move.from[j];
    let temp = 0;
    if (move.to.tableType === "A") {
      temp = setMoveC5ValA(item, dataObj, preSubTable);
    } else if (move.to.tableType === "B") {
      temp = setMoveC5ValB(item, dataObj, row, preSubTable);
    } else if (move.to.tableType === "C") {
      temp = setMoveC5ValC(item, dataObj, row, rowSub);
    }
    //数据汇总
    if (item.moveRule === "-") {
      val = Number(val) - Number(temp);
    } else {
      val = Number(val) + Number(temp);
    }
  }
  return val;
}

//C5汇总-表类型A
function setMoveC5ValA(item, dataObj, preSubTable) {
  let val = 0;
  if (item.tableType === "A" && item.tableCode && item.fieldCode) {
    if (!isNaN(dataObj.header[item.tableCode][item.fieldCode])) val = Number(dataObj.header[item.tableCode][item.fieldCode]);
  } else if (item.tableType === "B" && item.tableCode && item.fieldCode) {
    let rows = dataObj.item[item.tableCode];
    //检查行表
    if (!rows || rows.length === 0) return 0;
    //行表取值
    for (let j = 0; j < rows.length; j++) {
      let row = rows[j];
      if (!isNaN(row[item.fieldCode])) val = val + Number(row[item.fieldCode]);
    }
  } else if (item.tableType === "C" && item.tableCode && item.fieldCode && item.tableItem) {
    let rows = dataObj.item[item.tableItem];
    //检查行表
    if (!rows || rows.length === 0) return 0;
    //行表循环
    for (let j = 0; j < rows.length; j++) {
      let rowSubs = rows[j][preSubTable + item.tableCode];
      //检查子表
      if (!rowSubs || rowSubs.length === 0) continue;
      //子表取值
      for (let k = 0; k < rowSubs.length; k++) {
        let rowSub = rowSubs[k];
        if (!isNaN(rowSub[item.fieldCode])) val = val + Number(rowSub[item.fieldCode]);
      }
    }
  }
  return val;
}

//C5汇总-表类型B
function setMoveC5ValB(item, dataObj, row, preSubTable) {
  let val = 0;
  if (item.tableType === "B" && item.fieldCode) {
    if (row && !isNaN(row[item.fieldCode])) val = Number(row[item.fieldCode]);
  } else if (item.tableType === "C" && item.tableCode && item.fieldCode) {
    let rowSubs = row[preSubTable + item.tableCode];
    //检查子表
    if (!rowSubs || rowSubs.length === 0) return 0;
    //子表取值
    for (let k = 0; k < rowSubs.length; k++) {
      let rowSub = rowSubs[k];
      if (!isNaN(rowSub[item.fieldCode])) val = val + Number(rowSub[item.fieldCode]);
    }
  }
  return val;
}

//C5汇总-表类型C
function setMoveC5ValC(item, dataObj, row, rowSub) {
  let val = 0;
  if (item.tableType === "C" && item.fieldCode) {
    if (rowSub && !isNaN(rowSub[item.fieldCode])) val = Number(rowSub[item.fieldCode]);
  }
  return val;
}

/************* 报表数据赋值 ************/
//
// export function setMoveC5Report(move, row, rowSub, preSubTable = "") {
//   let val = 0;
//   for (let j = 0; j < move.from.length; j++) {
//     const item = move.from[j];
//     let temp = 0;
//     if (move.to.tableType === "B") {
//       temp = setMoveC5ReportB(item, row, preSubTable);
//     } else if (move.to.tableType === "C") {
//       temp = setMoveC5ReportC(item, row, rowSub);
//     }
//     //数据汇总
//     if (item.moveRule === "-") {
//       val = Number(val) - Number(temp);
//     } else {
//       val = Number(val) + Number(temp);
//     }
//   }
//   return val;
// }
//
// //C5汇总-表类型B
// function setMoveC5ReportB(item, row, preSubTable) {
//   let val = 0;
//   if (item.tableType === "B" && item.fieldCode) {
//     if (row && !isNaN(row[item.fieldCode])) val = Number(row[item.fieldCode]);
//   } else if (item.tableType === "C" && item.tableCode && item.fieldCode) {
//     let rowSubs = row[preSubTable + item.tableCode];
//     //检查子表
//     if (!rowSubs || rowSubs.length === 0) return 0;
//     //子表取值
//     for (let k = 0; k < rowSubs.length; k++) {
//       let rowSub = rowSubs[k];
//       if (!isNaN(rowSub[item.fieldCode])) val = val + Number(rowSub[item.fieldCode]);
//     }
//   }
//   return val;
// }
//
// //C5汇总-表类型C
// function setMoveC5ReportC(item, row, rowSub) {
//   let val = 0;
//   if (item.tableType === "C" && item.fieldCode) {
//     if (rowSub && !isNaN(rowSub[item.fieldCode])) val = Number(rowSub[item.fieldCode]);
//   }
//   return val;
// }
