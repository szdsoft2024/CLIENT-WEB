//初始化数据 C1  模式 A-A:A可以应用所有A B-A:B可以应用所有A C-BA:C可以应用父级B和C也可应用所有A
export function initBaseArrC1(baseArr) {
  let _arr = { table: [], cols: {} };
  const tableObj = baseArr.table[0];
  for (let i = 0; i < baseArr.table.length; i++) {
    const item = baseArr.table[i];
    _arr.cols[item.tableCode] = [];
    if (
      item.tableCode === tableObj.tableCode ||
      item.tableType === "A" ||
      (tableObj.tableType === "C" && item.tableType === "B" && tableObj.tableItem === item.tableCode)
    ) {
      for (let j = 0; j < baseArr.cols[item.tableCode].length; j++) {
        const col = baseArr.cols[item.tableCode][j];
        _arr.cols[item.tableCode].push({ svalue: col.fieldCode, sname: col.fieldName });
      }
    }
    if (_arr.cols[item.tableCode].length > 0) {
      _arr.table.push({ svalue: item.tableCode, sname: item.tableName });
    }
  }
  return _arr;
}

//初始化数据 C2和C3  模式 仅能使用自己
export function initBaseArrC2(baseArr) {
  let _arr = { table: [], cols: {} };
  const item = baseArr.table[0];
  _arr.cols[item.tableCode] = [];
  for (let j = 0; j < baseArr.cols[item.tableCode].length; j++) {
    const col = baseArr.cols[item.tableCode][j];
    _arr.cols[item.tableCode].push({ svalue: col.fieldCode, sname: col.fieldName });
  }
  if (_arr.cols[item.tableCode].length > 0) {
    _arr.table.push({ svalue: item.tableCode, sname: item.tableName });
  }
  return _arr;
}

//初始化数据 C4 不限制 下对上，上对下，表头之间 相互赋值 A-A B-A C-B/A A-B/C
export function initBaseArrC4(baseArr, baseMap) {
  let _arr = { table: [], cols: {} };
  for (let i = 0; i < baseArr.table.length; i++) {
    const item = baseArr.table[i];
    _arr.cols[item.tableCode] = [];
    for (let j = 0; j < baseArr.cols[item.tableCode].length; j++) {
      const col = baseArr.cols[item.tableCode][j];
      if (item.tableCode !== baseMap.header.consTable || col.fieldCode !== baseMap.header.consField) {
        _arr.cols[item.tableCode].push({ svalue: col.fieldCode, sname: col.fieldName });
      }
    }
    if (_arr.cols[item.tableCode].length > 0) {
      _arr.table.push({ svalue: item.tableCode, sname: item.tableName });
    }
  }
  return _arr;
}

//初始化数据 C5  上级汇总下级，表头之间、本结构汇总 A-A/B/C B/C
export function initBaseArrC5(baseArr, baseMap) {
  let _arr = { table: [], cols: {} };
  const tableObj = baseArr.table[0];
  for (let i = 0; i < baseArr.table.length; i++) {
    const item = baseArr.table[i];
    _arr.cols[item.tableCode] = [];
    if (
      item.tableCode === tableObj.tableCode ||
      tableObj.tableType === "A" ||
      (tableObj.tableType === "B" && item.tableType === "C" && item.tableItem === tableObj.tableCode)
    ) {
      for (let j = 0; j < baseArr.cols[item.tableCode].length; j++) {
        const col = baseArr.cols[item.tableCode][j];
        if (col.fieldType === "number") {
          if (item.tableCode !== baseMap.header.consTable || col.fieldCode !== baseMap.header.consField) {
            _arr.cols[item.tableCode].push({ svalue: col.fieldCode, sname: col.fieldName });
          }
        }
      }
    }
    if (_arr.cols[item.tableCode].length > 0) {
      _arr.table.push({ svalue: item.tableCode, sname: item.tableName });
    }
  }
  return _arr;
}
