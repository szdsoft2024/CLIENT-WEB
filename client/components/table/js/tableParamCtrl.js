import _ from "lodash";

//输入框编辑控制
export function getCtrlParam(layout, fCat, row) {
  if (layout.optionCell && row[layout.optionCell] && row[layout.optionCell][fCat.field]) {
    let _ctrlParam = _.cloneDeep(fCat.ctrlParam);
    if (_.isBoolean(row[layout.optionCell][fCat.field].disabled)) {
      _ctrlParam.disabled = row[layout.optionCell][fCat.field].disabled;
    }
    if (_.isBoolean(row[layout.optionCell][fCat.field].readonly)) {
      _ctrlParam.readonly = row[layout.optionCell][fCat.field].readonly;
    }
    if (_.isBoolean(row[layout.optionCell][fCat.field].hide)) {
      _ctrlParam.hide = row[layout.optionCell][fCat.field].hide;
    }
    return _ctrlParam;
  } else {
    return fCat.ctrlParam;
  }
}

//按钮操作控制
export function getCtrlParamButton(layout, fCat, ctrlParam, row) {
  if (layout.optionCell && row[layout.optionCell] && row[layout.optionCell][fCat.field] && row[layout.optionCell][fCat.field][ctrlParam.fCode]) {
    let _ctrlParam = _.cloneDeep(ctrlParam);
    if (_.isBoolean(row[layout.optionCell][fCat.field][ctrlParam.fCode].disabled)) {
      _ctrlParam.disabled = row[layout.optionCell][fCat.field][ctrlParam.fCode].disabled;
    }
    if (_.isBoolean(row[layout.optionCell][fCat.field][ctrlParam.fCode].hide)) {
      _ctrlParam.hide = row[layout.optionCell][fCat.field][ctrlParam.fCode].hide;
    }
    return _ctrlParam;
  } else {
    return ctrlParam;
  }
}

//获取表单按钮
export function getCtrlSubTableOper(oper, tableCode) {
  let _oper = {
    szdopt: oper.szdopt,
    szdkey: tableCode
  };
  if (oper.szdfst) _oper["szdfst"] = oper.szdfst;
  if (oper.szdbtn) _oper["szdbtn"] = oper.szdbtn;
  return _oper;
}
