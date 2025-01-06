import _ from "lodash";
import { utils } from "xlsx-js-style";
import { dataSumField } from "./tableFunc";

//生成导出数据
export function getExcelOutData(objData, colHead) {
  //表头
  let outData = _.cloneDeep(colHead.outData);
  //数据行
  let l_row_len = objData.value.length;
  if (l_row_len === 0) return;
  //数据列
  let l_col_len = colHead.fields.length;
  if (l_col_len === 0) return;
  //业务数据
  for (let i = 0; i < l_row_len; i++) {
    let l_arr = [];
    for (let j = 0; j < l_col_len; j++) {
      l_arr.push(objData.value[i][colHead.fields[j]]);
    }
    outData.push(l_arr);
  }
  //最后一行添加空行
  let l_arr = [];
  for (let j = 0; j < l_col_len; j++) {
    l_arr.push("");
  }
  outData.push(l_arr);

  return outData;
}

//输出合计行
export function setExcelSumRow(lay, outData, colHead, workSheet) {
  //汇总数据-列字段
  let sum_cats = {};
  dataSumField(lay.value.fCatCol, sum_cats);
  if (Object.keys(sum_cats).length === 0) return false;
  //数据行
  let l_row_len = outData.length - 1;
  if (l_row_len === 0) return false;
  //数据列
  let l_col_len = colHead.fields.length;
  if (l_col_len === 0) return false;
  //需要合计的列
  let sumData = [];
  let sumFlag = false;
  for (let j = 0; j < l_col_len; j++) {
    const l_sum_cat = sum_cats[colHead.fields[j]];
    if (l_sum_cat) {
      sumData.push(l_sum_cat.doSum);
      sumFlag = true;
    } else {
      sumData.push("");
    }
  }
  if (!sumFlag) return false;
  //导出合计行
  const l_sumSr = colHead.outData.length;
  const l_sumEr = l_row_len - 1;
  for (let i = 0; i < sumData.length; i++) {
    //列汇总 0.不汇总 1.合计 2.平均值 3.最小值 4.最大值 5.统计行数
    if (["1", "2", "3", "4", "5"].includes(sumData[i])) {
      const cellSr = utils.encode_cell({ r: l_sumSr, c: i });
      const cellSe = utils.encode_cell({ r: l_sumEr, c: i });
      const cellSum = utils.encode_cell({ r: l_row_len, c: i });
      switch (sumData[i]) {
        case "1":
          workSheet[cellSum] = { t: "n", f: "SUM(" + cellSr + ":" + cellSe + ")" };
          break;
        case "2":
          workSheet[cellSum] = { t: "n", f: "AVERAGE(" + cellSr + ":" + cellSe + ")" };
          break;
        case "3":
          workSheet[cellSum] = { t: "n", f: "MINA(" + cellSr + ":" + cellSe + ")" };
          break;
        case "4":
          workSheet[cellSum] = { t: "n", f: "MAXA(" + cellSr + ":" + cellSe + ")" };
          break;
        case "5":
          workSheet[cellSum] = { t: "n", f: "COUNTA(" + cellSr + ":" + cellSe + ")" };
          break;
      }
    } else if (i === 0) {
      const cellSum = utils.encode_cell({ r: l_row_len, c: i });
      workSheet[cellSum].v = "总计";
    }
  }
  return true;
}
