/***
 * C4赋值
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
export function setMoveC4(move, dataObj, row, rowSub, preSubTable = "") {
  let val = "";
  let preVal = "";
  for (let j = 0; j < move.from.length; j++) {
    const item = move.from[j];
    let temp = "";
    if (!item.fieldCode) {
      temp = item.fixValue;
    } else {
      if (move.to.tableType === "A") {
        temp = setMoveC4ValA(item, dataObj, preSubTable);
      } else if (move.to.tableType === "B") {
        temp = setMoveC4ValB(item, dataObj, row, preSubTable);
      } else if (move.to.tableType === "C") {
        temp = setMoveC4ValC(item, dataObj, row, rowSub);
      }
    }
    //数据赋值
    if (item.moveRule === "A") {
      //直接赋值
      if (temp) {
        val = val + preVal;
        preVal = "";
      }
      if (temp) {
        val = val + temp.toString();
      }
    } else if (item.moveRule === "C") {
      //下行为空不赋值
      if (temp) {
        if (preVal) val = val + preVal;
        preVal = temp.toString();
      }
    }
  }
  return val;
}

//C4赋值-表类型A
function setMoveC4ValA(item, dataObj, preSubTable) {
  let val = "";
  if (item.tableType === "A" && item.tableCode && item.fieldCode) {
    if (dataObj.header[item.tableCode][item.fieldCode]) val = dataObj.header[item.tableCode][item.fieldCode];
  } else if (item.tableType === "B" && item.tableCode && item.fieldCode) {
    let rows = dataObj.item[item.tableCode];
    //检查行表
    if (!rows || rows.length === 0) return "";
    //行表取值
    for (let j = 0; j < rows.length; j++) {
      let row = rows[j];
      if (row[item.fieldCode] && !val.includes(row[item.fieldCode].toString())) {
        val = val + row[item.fieldCode].toString();
      }
    }
  } else if (item.tableType === "C" && item.tableCode && item.fieldCode && item.tableItem) {
    let rows = dataObj.item[item.tableItem];
    //检查行表
    if (!rows || rows.length === 0) return "";
    //行表循环
    for (let j = 0; j < rows.length; j++) {
      let rowSubs = rows[j][preSubTable + item.tableCode];
      //检查子表
      if (!rowSubs || rowSubs.length === 0) continue;
      //子表取值
      for (let k = 0; k < rowSubs.length; k++) {
        let rowSub = rowSubs[k];
        if (rowSub[item.fieldCode] && !val.includes(rowSub[item.fieldCode].toString())) {
          val = val + rowSub[item.fieldCode].toString();
        }
      }
    }
  }
  return val;
}

//C4赋值-表类型B
function setMoveC4ValB(item, dataObj, row, preSubTable) {
  let val = "";
  if (item.tableType === "A" && item.tableCode && item.fieldCode) {
    if (dataObj.header[item.tableCode][item.fieldCode]) val = dataObj.header[item.tableCode][item.fieldCode];
  } else if (item.tableType === "B" && item.fieldCode) {
    if (row && row[item.fieldCode]) val = row[item.fieldCode];
  } else if (item.tableType === "C" && item.tableCode && item.fieldCode) {
    let rowSubs = row[preSubTable + item.tableCode];
    //检查子表
    if (!rowSubs || rowSubs.length === 0) return "";
    //子表取值
    for (let k = 0; k < rowSubs.length; k++) {
      let rowSub = rowSubs[k];
      if (rowSub[item.fieldCode] && !val.includes(rowSub[item.fieldCode].toString())) {
        val = val + rowSub[item.fieldCode].toString();
      }
    }
  }
  return val;
}

//C4赋值-表类型C
function setMoveC4ValC(item, dataObj, row, rowSub) {
  let val = "";
  if (item.tableType === "A" && item.tableCode && item.fieldCode) {
    if (dataObj.header[item.tableCode][item.fieldCode]) val = dataObj.header[item.tableCode][item.fieldCode];
  } else if (item.tableType === "B" && item.fieldCode) {
    if (row && row[item.fieldCode]) val = row[item.fieldCode];
  } else if (item.tableType === "C" && item.fieldCode) {
    if (rowSub && rowSub[item.fieldCode]) val = rowSub[item.fieldCode];
  }
  return val;
}

/************* 报表数据赋值 ************/

// export function setMoveC4Report(move, row, rowSub, preSubTable = "") {
//   let val = "";
//   let preVal = "";
//   for (let j = 0; j < move.from.length; j++) {
//     const item = move.from[j];
//     let temp = "";
//     if (!item.fieldCode) {
//       temp = item.fixValue;
//     } else {
//       if (move.to.tableType === "B") {
//         temp = setMoveC4ReportB(item, row, preSubTable);
//       } else if (move.to.tableType === "C") {
//         temp = setMoveC4ReportC(item, row, rowSub);
//       }
//     }
//     //数据赋值
//     if (item.moveRule === "A") {
//       //直接赋值
//       if (temp) {
//         val = val + preVal;
//         preVal = "";
//       }
//       if (temp) {
//         val = val + temp.toString();
//       }
//     } else if (item.moveRule === "C") {
//       //下行为空不赋值
//       if (temp) {
//         if (preVal) val = val + preVal;
//         preVal = temp.toString();
//       }
//     }
//   }
//   return val;
// }
//
// //C4赋值-表类型B
// function setMoveC4ReportB(item, row, preSubTable) {
//   let val = "";
//   if (item.tableType === "B" && item.fieldCode) {
//     if (row && row[item.fieldCode]) val = row[item.fieldCode];
//   } else if (item.tableType === "C" && item.tableCode && item.fieldCode) {
//     let rowSubs = row[preSubTable + item.tableCode];
//     //检查子表
//     if (!rowSubs || rowSubs.length === 0) return "";
//     //子表取值
//     for (let k = 0; k < rowSubs.length; k++) {
//       let rowSub = rowSubs[k];
//       if (rowSub[item.fieldCode] && !val.includes(rowSub[item.fieldCode].toString())) {
//         val = val + rowSub[item.fieldCode].toString();
//       }
//     }
//   }
//   return val;
// }
//
// //C4赋值-表类型C
// function setMoveC4ReportC(item, row, rowSub) {
//   let val = "";
//   if (item.tableType === "B" && item.fieldCode) {
//     if (row && row[item.fieldCode]) val = row[item.fieldCode];
//   } else if (item.tableType === "C" && item.fieldCode) {
//     if (rowSub && rowSub[item.fieldCode]) val = rowSub[item.fieldCode];
//   }
//   return val;
// }
