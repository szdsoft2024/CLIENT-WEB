import _ from "lodash";

export function initStatsTableLay(lay) {
  let _lay = {
    layout: _.cloneDeep(lay.layout),
    toolbar: _.cloneDeep(lay.tBar),
    fieldCat: _.cloneDeep(lay.fCatSta),
    sortRule: []
  };
  _lay.layout.report = "";
  for (let i = 0; i < lay.fCatDim.length; i++) {
    const item = lay.fCatDim[i];
    if (item.order === "1" || item.order === "2") {
      _lay.sortRule.push({ field: item.field, order: "ascending" });
    } else if (item.order === "3" || item.order === "4") {
      _lay.sortRule.push({ field: item.field, order: "descending" });
    }
  }

  for (let i = 0; i < lay.fCatTar.length; i++) {
    const item = lay.fCatTar[i];
    if (item.order === "1" || item.order === "2") {
      _lay.sortRule.push({ field: item.field + "_" + item.doSum, order: "ascending" });
    } else if (item.order === "3" || item.order === "4") {
      _lay.sortRule.push({ field: item.field + "_" + item.doSum, order: "descending" });
    }
  }

  return _lay;
}
