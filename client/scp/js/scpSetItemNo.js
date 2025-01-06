/***
 * 设置行号
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
 *    }]
 *    subTable:[{ 子表结构
 *      tableCode：数据结构代码
 *      tableName:数据结构名称
 *      rowKey: 子表健值字段
 *      rowKeyAuto:子表健值自动流水
 *      cols:[{ //必输检查的字段
 *        fieldCode:字段代码
 *        fieldName:字段名称
 *      }]
 *    }]
 *  }]
 * @param {Object} dataObj 数据对象 {header:{},item:{}}
 * @param {String} preSubTable 子表在行项目存储前缀，row[preSubTable+tableCode]
 * */
export function setItemNo(ruleCat, dataObj, preSubTable = "") {
  //设置行号检查
  if (!ruleCat || ruleCat.length === 0) return;
  //数据赋值
  for (let i = 0; i < ruleCat.length; i++) {
    const rule = ruleCat[i];
    //检查设置数据
    if (!rule.tableCode || rule.tableType !== "B" || !rule.rowKey) continue;
    //检查是否存在自动流水设置
    if (!rule.subTable) rule.subTable = [];
    if (!rule.rowKeyAuto && !rule.subTable.find(r => r.rowKeyAuto === true)) continue;

    //行数据
    let rows = dataObj.item[rule.tableCode];
    if (!rows || rows.length === 0) continue;

    //查找最大行号
    let itemNoMax = 0;
    if (rule.rowKeyAuto) {
      for (let j = 0; j < rows.length; j++) {
        if (rows[j][rule.rowKey] && rows[j][rule.rowKey] > itemNoMax) {
          itemNoMax = rows[j][rule.rowKey];
        }
      }
    }

    //设置行号
    for (let j = 0; j < rows.length; j++) {
      if (rule.rowKeyAuto && !rows[j][rule.rowKey]) {
        itemNoMax = itemNoMax + 1;
        rows[j][rule.rowKey] = itemNoMax;
      }

      //设置子号
      if (rule.subTable && rule.subTable.length > 0) {
        setItemSubNo(rule.subTable, rows[j], rule.rowKey, preSubTable);
      }
    }
  }
}

function setItemSubNo(subRuleCat, row, bRowKey, preSubTable) {
  for (let i = 0; i < subRuleCat.length; i++) {
    const subRule = subRuleCat[i];

    //检查设置数据
    if (!subRule.tableCode || !subRule.rowKey || !subRule.rowKeyAuto) continue;

    //检查子表数据
    let rowSubs = row[preSubTable + subRule.tableCode];
    if (!rowSubs || rowSubs.length === 0) continue;

    //查找最大子号
    let itemSubNoMax = 0;
    for (let j = 0; j < rowSubs.length; j++) {
      if (rowSubs[j][subRule.rowKey] && rowSubs[j][subRule.rowKey] > itemSubNoMax) {
        itemSubNoMax = rowSubs[j][subRule.rowKey];
      }
    }

    //设置行号、子号
    for (let j = 0; j < rowSubs.length; j++) {
      //设置行号
      rowSubs[j][bRowKey] = row[bRowKey];
      //设置子号
      if (!rowSubs[j][subRule.rowKey]) {
        itemSubNoMax = itemSubNoMax + 1;
        rowSubs[j][subRule.rowKey] = itemSubNoMax;
      }
    }
  }
}
