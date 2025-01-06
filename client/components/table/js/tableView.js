import _ from "lodash";

//初始化View数据
export function initDataView(lay, oper) {
  let _layView = {
    layout: lay.layout,
    tabCount: 0,
    tabGroup: []
  };

  //标配字段输出
  let tabGroup = [];
  switch (lay.layout.viewMode) {
    case "1": //单页面
      tabGroup.push({ label: "基本信息", children: _.cloneDeep(lay.fCatCol) });
      break;
    case "2": //tab标签
      let tab0 = { label: "基本信息", children: [] }; //基础信息
      tabGroup.push(tab0);
      for (let i = 0; i < lay.fCatCol.length; i++) {
        const item = _.cloneDeep(lay.fCatCol[i]);
        //多表头，首层为页签
        if (item.children && item.children.length > 0) {
          tabGroup.push({ label: item.label, children: item.children });
        } else {
          tab0.children.push(item);
        }
      }
      break;
  }

  //详情设置，检查详情是否单独设置
  for (let i = 0; i < tabGroup.length; i++) {
    if (lay.viewLay && lay.viewLay.fieldArr.length > 0) {
      //检查详情是否单独设置-单独设置的字段不进行显示
      let _tabFCat = initDataViewCheck(tabGroup[i].children, lay.viewLay.fieldArr);
      if (_tabFCat.length > 0) {
        _layView.tabGroup.push({ label: tabGroup[i].label, children: _tabFCat });
      }
    } else {
      if (tabGroup[i].children.length > 0) {
        _layView.tabGroup.push({ label: tabGroup[i].label, children: tabGroup[i].children });
      }
    }
  }

  //添加自定页签
  if (lay.viewLay && lay.viewLay.viewCat.length > 0) {
    for (let i = 0; i < lay.viewLay.viewCat.length; i++) {
      let item = lay.viewLay.viewCat[i];
      //检查标签是否输出 1.正常  3.禁用、4.隐藏
      let fstVal = oper.szdbtn && item.field && oper.szdbtn[item.field] ? oper.szdbtn[item.field] : "";
      if (["3", "4"].includes(fstVal)) continue;
      _layView.tabGroup.push(item);
    }
  }

  //标签tabCode键值和数量
  _layView.tabGroup.forEach((item, index) => {
    item["$SZDTabName"] = "tab" + index;
  });
  _layView.tabCount = _layView.tabGroup.length;

  return _layView;
}

//添加详情字段
function initDataViewCheck(fCats, fieldArr) {
  let _fCat = [];
  for (let i = 0; i < fCats.length; i++) {
    const item = _.cloneDeep(fCats[i]);
    if (fieldArr.includes(item.field)) continue;
    if (item.children && item.children.length > 0) {
      let child = initDataViewCheck(item.children, fieldArr);
      if (child.length > 0) {
        item.children = child;
        _fCat.push(item);
      }
    } else {
      _fCat.push(item);
    }
  }
  return _fCat;
}

//初始化数据-子表设置，详情中子表不存在，进行初始化
export function initDataViewSubTable(row, lay) {
  if (lay.viewLay && lay.viewLay.subTableArr.length > 0) {
    for (let i = 0; i < lay.viewLay.subTableArr.length; i++) {
      const field = lay.viewLay.subTableArr[i];
      if (!row[field]) row[field] = [];
    }
  }
}
