import _ from "lodash";
import { szdSh } from "../../searchHelp/serchHelp";
import { addThousandSeparator } from "pixiu-number-toolkit";
import { $m } from "../../../common/utils/globalConfig";

//新增数据行
export function dataAdd(dataObj, fCatUse) {
  let _row = {};
  let rowIndex = dataObj.value.length;
  const catKeys = Object.keys(fCatUse);
  for (let i = 0; i < catKeys.length; i++) {
    const item = fCatUse[catKeys[i]];
    if (item.$SZDCol && ["string", "number", "boolean", "date", "datetime", "time", "year", "month"].includes(item.type)) {
      if (item.type === "number") {
        _row[item.field] = 0;
      } else {
        _row[item.field] = "";
      }
    }
  }
  dataObj.value.push(_row);
  //返回回调参数
  return { rowIndex: rowIndex };
}

//赋值行
export function dataCopy(dataObj, refTable) {
  const _listSel = refTable.value.getSelectionRows();
  if (_listSel.length === 0) {
    $m("CORE_CLIENT.E047"); //请至少选择一行需要复制的行
    return false;
  }
  let rowIndex = dataObj.value.length;
  for (let i = 0; i < _listSel.length; i++) {
    let _row = _.cloneDeep(_listSel[i]);
    dataObj.value.push(_row);
  }
  //返回回调参数
  return { rowIndex: rowIndex };
}

//删除行
export function dataDel(dataObj, refTable) {
  const _listSel = refTable.value.getSelectionRows();
  if (_listSel.length === 0) {
    $m("CORE_CLIENT.E048"); //请至少选择一行需要删除的行
    return false;
  }
  let _rows = _.cloneDeep(_listSel);
  dataObj.value = dataObj.value.filter(item => !_listSel.some(ele => ele === item));
  //返回回调参数
  return { rows: _rows };
}

//数据行合计
export function dataSum(obj, fCatCol) {
  //需要汇总的列
  let sum_cats = {};
  dataSumField(fCatCol, sum_cats);
  if (Object.keys(sum_cats).length === 0) {
    return [];
  }
  //数据行
  let l_row_len = obj.data.length;
  if (l_row_len === 0) {
    return [];
  }
  //数据列
  let l_col_len = obj.columns.length;
  if (l_col_len === 0) {
    return [];
  }
  //汇总数据
  let sums = [];
  for (let i = 0; i < l_col_len; i++) {
    sums[i] = "";
    let l_prop = obj.columns[i].property;
    let l_sum_cat = {};
    if (l_prop) {
      l_sum_cat = sum_cats[l_prop];
      if (!l_sum_cat) l_sum_cat = {};
    }
    if (i === 0 && !l_sum_cat.doSum) {
      sums[i] = "总计";
      continue;
    }
    if (!l_sum_cat.doSum) continue;
    //5.统计行数
    if (l_sum_cat.doSum === "5") {
      sums[i] = l_row_len;
      continue;
    }
    sums[i] = 0;
    //汇总列值
    for (let j = 0; j < l_row_len; j++) {
      let l_val = obj.data[j][l_prop];
      //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
      if (l_sum_cat.doSum === "1" || l_sum_cat.doSum === "2") {
        if (l_val === "" || l_val === null || l_val === undefined) {
          l_val = 0;
        } else if (_.isNaN(l_val)) {
          sums[i] = "N/A";
          break;
        } else {
          l_val = Number(l_val);
        }
        if (j === 0) {
          sums[i] = l_val;
        } else {
          sums[i] = sums[i] + l_val;
        }
      } else if (l_sum_cat.doSum === "3" || l_sum_cat.doSum === "4") {
        if (l_val === null || l_val === undefined) {
          l_val = "";
        }
        if (j === 0) {
          sums[i] = l_val;
        } else {
          if (l_sum_cat.doSum === "3" && l_val < sums[i]) {
            sums[i] = l_val;
          } else if (l_sum_cat.doSum === "4" && l_val > sums[i]) {
            sums[i] = l_val;
          }
        }
      }
    }
    //平均值
    if (l_sum_cat.doSum === "2" && sums[i] !== "N/A" && l_row_len > 0) {
      sums[i] = sums[i] / l_row_len;
    }
    //设置小数位和千分位符
    if (!isNaN(sums[i])) {
      if (!isNaN(l_sum_cat.numDec) && l_sum_cat.numDec >= 0) {
        sums[i] = Number(sums[i]).toFixed(l_sum_cat.numDec);
      }
      if (l_sum_cat.numDot) {
        sums[i] = addThousandSeparator(sums[i]);
      }
    }
  }
  return sums;
}

//统计需要汇总的字段
export function dataSumField(fCatCol, sum_cats) {
  for (let i = 0; i < fCatCol.length; i++) {
    const item = fCatCol[i];
    if (_.isArray(item.children) && item.children.length > 0) {
      //多表头处理
      dataSumField(item.children, sum_cats);
    } else if (["1", "2", "3", "4", "5"].includes(item.doSum)) {
      //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
      sum_cats[item.field] = {
        type: item.type, //数据类型
        numDot: item.numDot, //千分位符
        numDec: item.numDec, //小数位位数
        doSum: item.doSum //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
      };
    }
  }
}

//搜索帮助
export function setRowHelp(layout, fCat, row) {
  return new Promise(resolve => {
    //检查查询条件是否为变量
    let l_select = [];
    if (fCat.ctrlParam.baseSelect && Array.isArray(fCat.ctrlParam.baseSelect)) {
      fCat.ctrlParam.baseSelect.forEach(item => {
        let l_arr = [];
        l_arr[0] = item[0];
        if (_.isString(item[1]) && item[1].startsWith("row.")) {
          l_arr[1] = row[item[1].substring(4)];
        } else {
          l_arr[1] = item[1];
        }
        l_select.push(l_arr);
      });
    }
    //检查是否允许赋值
    let l_disabled = fCat.ctrlParam.disabled;
    if (layout.optionCell && row[layout.optionCell] && row[layout.optionCell][fCat.field]) {
      if (_.isBoolean(row[layout.optionCell][fCat.field].disabled)) {
        l_disabled = row[layout.optionCell][fCat.field].disabled;
      }
    }
    //调用搜索帮助
    szdSh({
      a: fCat.ctrlParam.baseField,
      b: row,
      c: fCat.ctrlParam.baseMapping ? fCat.ctrlParam.baseMapping : [fCat.field + "-*"],
      d: l_select,
      e: l_disabled
    }).then(res => {
      resolve(res.chgFlag);
    });
  });
}
