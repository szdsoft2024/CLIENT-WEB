import _ from "lodash";

export function statsData(lay, dataObj) {
  let statsObj = [];
  //维度转换为数组,应用于小计场景
  let dimArrArr = statsDataDimArr(lay);
  let tarArr = statsDataTarArr(lay);
  //合计数据
  statsObj = statsDataSum(lay.value.fCatUse, dimArrArr, tarArr, dataObj);
  //统计分析值 TODO

  return statsObj;
}

//维度信息
function statsDataDimArr(lay) {
  let dimArrArr = [];
  let _arrTemp = [];
  for (let i = 0; i < lay.value.fCatDim.length; i++) {
    const fCat = lay.value.fCatDim[i];
    _arrTemp.push(fCat.field);
    if (fCat.order === "2" || fCat.order === "4") {
      dimArrArr.push(_.cloneDeep(_arrTemp));
    }
  }
  dimArrArr.push(_.cloneDeep(_arrTemp));
  return dimArrArr;
}

//指标信息
function statsDataTarArr(lay) {
  let tarArr = [];
  for (let i = 0; i < lay.value.fCatTar.length; i++) {
    if (!tarArr.includes(lay.value.fCatTar[i].field)) {
      tarArr.push(lay.value.fCatTar[i].field);
    }
  }
  return tarArr;
}

//合计数据
function statsDataSum(fCatUse, dimArrArr, tarArr, dataObj) {
  let statsObj = [];
  let dimArrArrLen = dimArrArr.length;
  //维度KEY $SZDDimKey
  for (let i = 0; i < dataObj.value.length; i++) {
    const item = dataObj.value[i];
    //统计汇总数据
    for (let j = 0; j < dimArrArrLen; j++) {
      const _dimArr = dimArrArr[j];
      let _stIns = {
        $SZDDimKey: "",
        $SZDStyleRow: ""
      };
      //填写维度Key
      for (let k = 0; k < _dimArr.length; k++) {
        const _field = _dimArr[k];
        //非最后一行为小计行
        if (dimArrArrLen !== j + 1 && _dimArr.length === k + 1) {
          _stIns[_field] = item[_field] + "_(小计)";
          _stIns.$SZDDimKey = _stIns.$SZDDimKey + "_" + item[_field] + "_(小计)";
          _stIns.$SZDStyleRow = { color: "#DDAA00", fontWeight: 600 };
        } else {
          _stIns[_field] = item[_field];
          _stIns.$SZDDimKey = _stIns.$SZDDimKey + "_" + item[_field];
        }
      }
      //检查维度和指标数据是否已存在
      const _stUpd = statsObj.find(itemObj => itemObj.$SZDDimKey === _stIns.$SZDDimKey);
      if (_stUpd) {
        //汇总指标
        for (let k = 0; k < tarArr.length; k++) {
          const _field = tarArr[k];
          const fCat = fCatUse[_field];
          if (fCat && fCat.type === "number" && !isNaN(item[_field])) {
            _stUpd[_field + "_1"] = _stUpd[_field + "_1"] + Number(item[_field]); //合计
          }
          if (_stUpd[_field + "_3"] > item[_field]) _stUpd[_field + "_3"] = item[_field]; //最小值
          if (_stUpd[_field + "_4"] < item[_field]) _stUpd[_field + "_4"] = item[_field]; //最大值
          _stUpd[_field + "_5"] = _stUpd[_field + "_5"] + 1; //统计行数
        }
      } else {
        //新增指标
        for (let k = 0; k < tarArr.length; k++) {
          const _field = tarArr[k];
          const fCat = fCatUse[_field];
          if (fCat && fCat.type === "number" && !isNaN(item[_field])) {
            _stIns[_field + "_1"] = Number(item[_field]); //合计
          } else {
            _stIns[_field + "_1"] = 0; //合计
          }
          _stIns[_field + "_3"] = item[_field]; //最小值
          _stIns[_field + "_4"] = item[_field]; //最大值
          _stIns[_field + "_5"] = 1; //统计行数
        }
        statsObj.push(_stIns);
      }
    }
  }

  //统计分析值
  for (let i = 0; i < statsObj.length; i++) {
    for (let j = 0; j < tarArr.length; j++) {
      const _field = tarArr[j];
      const fCat = fCatUse[_field];
      if (fCat.type === "number" && statsObj[i][_field + "_5"] > 0) {
        statsObj[i][_field + "_2"] = statsObj[i][_field + "_1"] / statsObj[i][_field + "_5"]; //平均值
      }
      //精确小数位
      if (fCat && !isNaN(fCat.numDec) && fCat.type === "number") {
        if (!isNaN(statsObj[i][_field + "_1"])) {
          statsObj[i][_field + "_1"] = Number(statsObj[i][_field + "_1"]).toFixed(fCat.numDec);
        }
        if (!isNaN(statsObj[i][_field + "_2"])) {
          statsObj[i][_field + "_2"] = Number(statsObj[i][_field + "_2"]).toFixed(fCat.numDec);
        }
        if (!isNaN(statsObj[i][_field + "_3"])) {
          statsObj[i][_field + "_3"] = Number(statsObj[i][_field + "_3"]).toFixed(fCat.numDec);
        }
        if (!isNaN(statsObj[i][_field + "_4"])) {
          statsObj[i][_field + "_4"] = Number(statsObj[i][_field + "_4"]).toFixed(fCat.numDec);
        }
      }
    }
  }

  return statsObj;
}
