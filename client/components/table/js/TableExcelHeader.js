import _ from "lodash";
import { utils } from "xlsx-js-style";

//设置抬头样式
export function setExcelHeaderStyle(workSheet, colHead, sumFlag, rowSum) {
  //合并单元格
  workSheet["!merges"] = colHead.merges;
  //设置单元格颜色
  const styleHeader = {
    fill: {
      fgColor: { rgb: "E5E5E5" }
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" }
    },
    alignment: {
      horizontal: "center", //水平对齐方式
      vertical: "center", //垂直对齐方式
      wrapText: "true" //是否换行
    }
  };
  for (let r = 0; r < colHead.outData.length; r++) {
    for (let c = 0; c < colHead.fields.length; c++) {
      workSheet[utils.encode_cell({ r: r, c: c })].s = styleHeader;
    }
  }
  //汇总行
  const styleFoot = _.cloneDeep(styleHeader);
  styleFoot.alignment.horizontal = "right";
  if (sumFlag) {
    for (let c = 0; c < colHead.fields.length; c++) {
      workSheet[utils.encode_cell({ r: rowSum - 1, c: c })].s = styleFoot;
    }
  }
}

//获取Excel列头
export function getExcelHeader(fCatCol, fieldFlag) {
  //表头设置
  let colHead = {
    count: 0,
    header: [], //表头行数组
    fields: [],
    merges: [], //合并单元格
    outData: [] //输出表头
  };
  //输出数据数组
  getExcelHeaderColField(fCatCol, colHead, 0);
  //行合并统计
  getExcelHeaderMergesRows(colHead, colHead.merges);
  //列合并统计
  getExcelHeaderMergesCols(colHead, colHead.merges);
  //输出列头字段补充
  getExcelHeaderData(colHead, fieldFlag);

  return colHead;
}

//生成输出的表头
function getExcelHeaderColField(fCatCol, colHead, level) {
  if (!colHead.header[level]) {
    colHead.header.push({});
  }
  let header = colHead.header[level];
  for (let i = 0; i < fCatCol.length; i++) {
    const item = fCatCol[i];
    if (item.hide || ["button", "sub-table"].includes(item.type)) continue;
    colHead.count = colHead.count + 1;
    //设置列头
    let l_pos = colHead.count - 1;
    header["col_" + l_pos] = item.label;
    if (item.children) {
      colHead.count = colHead.count - 1; //对齐父级列
      getExcelHeaderColField(item.children, colHead, level + 1);
    } else {
      colHead.fields.push(item.field);
    }
  }
}

//添加行合并
function getExcelHeaderMergesRows(colHead) {
  const level = colHead.header.length;
  const colLen = colHead.fields.length;
  let merges = colHead.merges;

  for (let i = 0; i < level; i++) {
    let m = {
      sr: i,
      sc: 0, //开始单元格坐标
      er: i,
      ec: 0 //结束坐标
    };
    for (let j = 0; j < colLen; j++) {
      if (colHead.header[i]["col_" + j]) {
        if (j !== m.ec && m.sc !== j - 1) {
          m.ec = j - 1;
          if (i === 0) {
            merges.push(_.cloneDeep(m)); //添加合并
          } else {
            //检查是否在上级合并内
            const temp = merges.find(item => item.sr === i - 1 && item.sc <= m.sc && item.ec >= m.ec);
            if (temp) {
              merges.push(_.cloneDeep(m)); //添加合并
            }
          }
        }
        m.sc = j;
        m.ec = j + 1;
      }
    }
    if (m.ec <= colLen && m.sc + 1 < colLen) {
      m.ec = colLen - 1;
      if (i === 0) {
        merges.push(_.cloneDeep(m)); //添加合并
      } else {
        //检查是否在上级合并内
        const temp = merges.find(item => item.sr === i - 1 && item.sc <= m.sc && item.ec >= m.ec);
        if (temp) {
          merges.push(_.cloneDeep(m)); //添加合并
        }
      }
    }
  }
}

//添加列合并
function getExcelHeaderMergesCols(colHead) {
  const level = colHead.header.length;
  const colLen = colHead.fields.length;
  let merges = colHead.merges;

  for (let i = 0; i < colLen; i++) {
    let m = {
      sr: 0,
      sc: i, //开始单元格坐标
      er: 0,
      ec: i //结束坐标
    };
    for (let j = 0; j < level; j++) {
      if (colHead.header[j]["col_" + i]) {
        if (j !== m.er && m.sr !== j - 1) {
          m.er = j - 1;
          //检查是否在上级合并内
          const temp = merges.find(item => item.er >= m.sr && item.sr <= m.er && item.sc <= m.ec && item.ec >= m.sc);
          if (!temp) {
            merges.push(_.cloneDeep(m)); //添加合并
          }
        }
        m.sr = j;
        m.er = j + 1;
      }
    }
    if (m.er <= level && m.sr + 1 < level) {
      m.er = level - 1;
      //检查是否在上级合并内
      const temp = merges.find(item => item.er >= m.sr && item.sr <= m.er && item.sc <= m.ec && item.ec >= m.sc);
      if (!temp) {
        merges.push(_.cloneDeep(m)); //添加合并
      }
    }
  }
}

//获取表头数据
function getExcelHeaderData(colHead, fieldFlag) {
  //设置输出列数据
  const level = colHead.header.length;
  const colLen = colHead.fields.length;

  //输出带字段
  if (fieldFlag) {
    colHead.outData.push(_.cloneDeep(colHead.fields));
  }
  //表头设置
  for (let i = 0; i < level; i++) {
    let l_arr = [];
    for (let j = 0; j < colLen; j++) {
      if (colHead.header[i]["col_" + j]) {
        l_arr.push(colHead.header[i]["col_" + j]);
      } else {
        l_arr.push("");
      }
    }
    colHead.outData.push(l_arr);
  }

  //转换成合并单元格数据
  const l_merges = _.cloneDeep(colHead.merges);
  const l_sr = fieldFlag ? 1 : 0;
  colHead.merges = [];
  l_merges.forEach(item => {
    colHead.merges.push({ s: { r: item.sr + l_sr, c: item.sc }, e: { r: item.er + l_sr, c: item.ec } });
  });
}

//获取导出的文件名
export function downloadFilename(lay) {
  let date = new Date();
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  if (lay.value.layout.impTmpName) {
    return lay.value.layout.impTmpName + "_" + year + month + day + ".xlsx";
  } else if (lay.value.layout.report) {
    return lay.value.layout.report.toLowerCase() + "_" + year + month + day + ".xlsx";
  } else {
    return year + month + day + ".xlsx";
  }
}
