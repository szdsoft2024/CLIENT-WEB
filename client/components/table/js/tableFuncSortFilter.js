import _ from "lodash";
import szdTool from "../../../common/tools/tool";

//调用方法
export function dataSortFilter(dataObj, lay, tParObj) {
  //过滤数据
  dataFilter(dataObj, lay, tParObj);
  //数据排序
  dataSort(dataObj, lay);
  //合并单元格
  dataSortMerge(dataObj, lay, tParObj);
}

//数据排序
function dataSort(dataObj, lay) {
  if (lay.value.layout.sort === "0") return;
  const rule = lay.value.sortRule;
  const l_ruleLen = rule.length;
  const l_rowsLen = dataObj.value.length;
  if (l_ruleLen === 0 && l_rowsLen === 0) return;
  //排序字段设置
  let sortCat = [];
  for (let j = 0; j < rule.length; j++) {
    sortCat.push({ field: rule[j].field, order: rule[j].order, type: lay.value.fCatUse[rule[j].field].type });
  }
  //是否存在隐藏行排序
  const l_rowHide = Object.keys(lay.value.fRanges).length > 0;
  //数据排序
  dataObj.value.sort((a, b) => {
    //隐藏行排序
    if (l_rowHide) {
      if (a["$SZDRowHide"] < b["$SZDRowHide"]) {
        return 1;
      } else if (a["$SZDRowHide"] > b["$SZDRowHide"]) {
        return -1;
      }
    }
    //正常行排序
    let l_res = 0;
    for (let i = 0; i < l_ruleLen; i++) {
      let _a = a[sortCat[i].field];
      let _b = b[sortCat[i].field];
      if (_a === undefined || _a === null) _a = sortCat[i].type === "number" ? 0 : "";
      if (_b === undefined || _b === null) _b = sortCat[i].type === "number" ? 0 : "";

      if (_a < _b) {
        l_res = -1;
      } else if (_a > _b) {
        l_res = 1;
      }
      if (l_res !== 0) {
        if (sortCat[i].order === "descending") {
          l_res = l_res * -1;
          // 统计功能汇总小计使用
          if (b["$SZDStyleRow"] && b[sortCat[i].field].startsWith(String(a[sortCat[i].field]))) {
            l_res = -1;
          } else if (a["$SZDStyleRow"] && a[sortCat[i].field].startsWith(String(b[sortCat[i].field]))) {
            l_res = 1;
          }
        }
        return l_res;
      }
    }
    return l_res;
  });
}

//排序-相同行数据合并-编辑数据不能合并
function dataSortMerge(dataObj, lay, tParObj) {
  //重置合并规则
  tParObj.value.merge = {};
  if (lay.value.layout.merge === "0") return;
  //排序规则、长度、数据长度
  const l_ruleLen = lay.value.sortRule.length;
  const l_rowsLen = dataObj.value.length;
  if (l_ruleLen === 0 || l_rowsLen === 0) return;
  const rule = lay.value.sortRule;
  //设置相同行数据合并
  for (let i = 0; i < l_ruleLen; i++) {
    if (!lay.value.fCatUse[rule[i].field] || !lay.value.fCatUse[rule[i].field].merge) continue;

    let merge = [];
    let valTemp1 = ""; //相同行变量
    let rowCount = 0; //相同行计数器
    //循环行数据
    for (let j = 0; j < l_rowsLen; j++) {
      const row = dataObj.value[j];
      //合并规则值设置
      let valTemp2 = "";
      if (lay.value.layout.merge === "1") {
        valTemp2 = row[rule[i].field];
      } else {
        for (let k = 0; k <= i; k++) {
          valTemp2 = valTemp2 + "_" + row[rule[k].field];
        }
      }
      //如果存在过滤,合并单元格处理
      if (row["$SZDRowHide"]) valTemp2 = valTemp2 + "_hide";
      //合并规则比对
      if (j === 0) {
        valTemp1 = valTemp2;
        rowCount = 1;
      } else {
        if (valTemp1 === valTemp2) {
          //相同是表示合并
          merge.push({ rowIndex: j, rowspan: 0, colspan: 0 });
          rowCount = rowCount + 1;
        } else {
          //不同值 如果计数器是1，表示不存在合并，如果计数器大于1，说明上一行是需要合并的，当前行计数器重置1
          if (rowCount !== 1) {
            merge.push({ rowIndex: j - rowCount, rowspan: rowCount, colspan: 1 });
          }
          //重置比对内容
          valTemp1 = valTemp2;
          rowCount = 1;
        }
      }
    }
    //最尾行处理，计数器大于1，需要进行合并
    if (rowCount > 1) {
      merge.push({ rowIndex: l_rowsLen - rowCount, rowspan: rowCount, colspan: 1 });
    }
    if (merge.length > 0) {
      tParObj.value.merge[rule[i].field] = _.cloneDeep(merge);
    }
  }
}

//数据过滤
function dataFilter(dataObj, lay, tParObj) {
  if (!lay.value.layout.filter) return;
  //过滤的字段
  const schCats = Object.keys(lay.value.fRanges);
  //未执行过滤且无过滤参数
  if (!tParObj.value.fliter && schCats.length === 0) return;
  //行字段确认
  const l_len = dataObj.value.length;
  if (l_len === 0) return;
  //过滤字段设置
  let filterCat = [];
  for (let j = 0; j < schCats.length; j++) {
    filterCat.push(schCats[j]);
  }
  //过滤字段个数
  const filterLen = filterCat.length;
  //设置是否执行过滤
  tParObj.value.fliter = filterLen > 0;
  //循环表数据
  for (let i = 0; i < dataObj.value.length; i++) {
    let row = dataObj.value[i];
    if (row.$SZDRowHide) row.$SZDRowHide = false;
    if (filterLen === 0) continue;
    //检查是否属于隐藏数据
    for (let j = 0; j < filterLen; j++) {
      row["$SZDRowHide"] = !szdTool.range(row[filterCat[j]], lay.value.fRanges[filterCat[j]]);
      if (row.$SZDRowHide) break;
    }
  }
}
