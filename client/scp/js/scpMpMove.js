import { setMoveC4 } from "./scpMpMoveC4";
import { setMoveC5 } from "./scpMpMoveC5";

/***
 * 功能 C4赋值 C5汇总
 * @param {Array} moveCat 赋值规则
 *  {
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
 * @param {String} option 操作 C创建 U更新 V显示
 * @param {String} preSubTable 子项目数据在行项目存储的规则，row[preSubTable+tableCode]
 *
 * */
export function setMove(moveCat, dataObj, option, preSubTable = "") {
  //赋值规则检查
  if (!moveCat || moveCat.length === 0) return;
  //数据赋值
  for (let i = 0; i < moveCat.length; i++) {
    const move = moveCat[i];
    //显示状态不更新数据库字段值
    if (option === "V" && move.fieldCodeDb) continue;
    if (!move.to || !move.to.tableCode || !move.to.fieldCode) continue;
    if (!move.from || move.from.length === 0) continue;
    //表类型分别处理
    if (move.to.tableType === "A") {
      //------------------抬头赋值
      if (move.type === "C4") {
        dataObj.header[move.to.tableCode][move.to.fieldCode] = setMoveC4(move, dataObj, undefined, undefined, preSubTable);
      } else if (move.type === "C5") {
        dataObj.header[move.to.tableCode][move.to.fieldCode] = setMoveC5(move, dataObj, undefined, undefined, preSubTable);
      }
    } else if (move.to.tableType === "B") {
      //------------------行表赋值
      let rows = dataObj.item[move.to.tableCode];
      //检查行表
      if (!rows || rows.length === 0) continue;
      //行表赋值
      for (let j = 0; j < rows.length; j++) {
        let row = rows[j];
        if (move.type === "C4") {
          row[move.to.fieldCode] = setMoveC4(move, dataObj, row, undefined, preSubTable);
        } else if (move.type === "C5") {
          row[move.to.fieldCode] = setMoveC5(move, dataObj, row, undefined, preSubTable);
        }
      }
    } else if (move.to.tableType === "C" && move.to.tableItem) {
      //------------------子表赋值
      let rows = dataObj.item[move.to.tableItem];
      //检查行表
      if (!rows || rows.length === 0) continue;
      //行表循环
      for (let j = 0; j < rows.length; j++) {
        let row = rows[j];
        let rowSubs = row[preSubTable + move.to.tableCode];
        //检查子表
        if (!rowSubs || rowSubs.length === 0) continue;
        //子表赋值
        for (let k = 0; k < rowSubs.length; k++) {
          let rowSub = rowSubs[k];
          if (move.type === "C4") {
            rowSub[move.to.fieldCode] = setMoveC4(move, dataObj, row, rowSub, preSubTable);
          } else if (move.type === "C5") {
            rowSub[move.to.fieldCode] = setMoveC5(move, dataObj, row, rowSub, preSubTable);
          }
        }
      }
    }
  }
}

// /***
//  * 报表 C4赋值 C5汇总
//  * @param {Array} moveCat 赋值规则
//  *  {
//  *  赋值类型
//  *    type: 枚举 C4.赋值 C5.汇总
//  *  赋值目标
//  *    to: {
//  *      tableCode: 数据结构
//  *      tableType: 表类型： B.行项目 C.子项目
//  *      tableItem: 行项目表，子项目表对应的行项目表
//  *      fieldCode: 数据结构字段
//  *    },
//  *  赋值来源
//  *    from: [{
//  *      tableCode: 数据结构
//  *      tableType: 表类型：A.抬头表 B.行项目 C.子项目
//  *      tableItem: 行项目表，子项目表对应的行项目表
//  *      fieldCode: 数据结构字段
//  *      fixValue：固定值，fieldCode 字段为空时，取固定值，C5此字段不适用
//  *      moveRule：赋值规则，C4：枚举 A.直接赋值 B.下行为空不赋值 C5枚举：+相加 -相减
//  *    }]
//  *  }
//  * @param {Array} rows 数据对象
//  * @param {String} preSubTable 子项目数据在行项目存储的规则，row[preSubTable+tableCode]
//  *
//  * */
// export function setMoveReport(moveCat, rows, preSubTable = "") {
//   //赋值规则检查
//   if (!moveCat || moveCat.length === 0) return;
//   //检查行表
//   if (!rows || rows.length === 0) return;
//   //数据赋值
//   for (let i = 0; i < moveCat.length; i++) {
//     const move = moveCat[i];
//     //检查数据
//     if (!move.to.fieldCode || !move.from || move.from.length === 0) continue;
//     //表类型分别处理
//     if (move.to.tableType === "B") {
//       //------------------行表赋值
//       for (let j = 0; j < rows.length; j++) {
//         let row = rows[j];
//         if (move.type === "C4") {
//           row[move.to.fieldCode] = setMoveC4Report(move, row, undefined, preSubTable);
//         } else if (move.type === "C5") {
//           row[move.to.fieldCode] = setMoveC5Report(move, row, undefined, preSubTable);
//         }
//       }
//     } else if (move.to.tableType === "C" && move.to.tableItem) {
//       //------------------子表赋值
//       //行表循环
//       for (let j = 0; j < rows.length; j++) {
//         let row = rows[j];
//         let rowSubs = row[preSubTable + move.to.tableCode];
//         //检查子表
//         if (!rowSubs || rowSubs.length === 0) continue;
//         //子表赋值
//         for (let k = 0; k < rowSubs.length; k++) {
//           let rowSub = rowSubs[k];
//           if (move.type === "C4") {
//             rowSub[move.to.fieldCode] = setMoveC4Report(move, row, rowSub, preSubTable);
//           } else if (move.type === "C5") {
//             rowSub[move.to.fieldCode] = setMoveC5Report(move, row, rowSub, preSubTable);
//           }
//         }
//       }
//     }
//   }
// }
