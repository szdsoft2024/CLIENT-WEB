<template>
  <!-- 输出列-多表头 -->
  <el-table-column v-if="_fCat.children && !_fCat.hide" :label="_fCat.label" :column-key="_fCat.field">
    <template v-for="item in _fCat.children">
      <tableCompColumn :layout="layout" :layFCat="item" @handleRowEvent="handleRowEventImp" />
    </template>
  </el-table-column>
  <!-- 输出列-实际列 -->
  <el-table-column
    v-if="!_fCat.children && !_fCat.hide"
    :prop="_fCat.field"
    :label="_fCat.label"
    :width="_fCat.width"
    :min-width="_fCat.minWidth"
    :column-key="_fCat.field"
    header-align="center"
    :align="_fCat.align"
    :fixed="_fCat.fixed"
    :sortable="_fCat.sort ? 'custom' : false">
    <!-- 表头设置 -->
    <template v-if="_fCat.required || _fCat.helpTip" #header="scope">
      <szd-table-col-header :required="_fCat.required" :label="_fCat.label" :helpTip="_fCat.helpTip" :lang="false" />
    </template>
    <!-- 控件设置 -->
    <template v-if="_fCat.ctrlType" #default="scope">
      <!--  控件类型 input -->
      <template v-if="_fCat.ctrlType === 'input'">
        <szd-input-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          :desc="_fCat.ctrlParam.descField ? scope.row[_fCat.ctrlParam.descField] : ''"
          @help="handleRowHelp(_fCat, scope.row, scope.$index)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)"
          @dblclick="handleRowClick(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 input-number -->
      <template v-else-if="_fCat.ctrlType === 'input-number'">
        <szd-input-number-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 date -->
      <template v-else-if="_fCat.ctrlType === 'date'">
        <szd-date-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 time -->
      <template v-else-if="_fCat.ctrlType === 'time'">
        <szd-time-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 checkbox -->
      <template v-else-if="_fCat.ctrlType === 'checkbox'">
        <szd-checkbox-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 radio -->
      <template v-else-if="_fCat.ctrlType === 'radio'">
        <szd-radio-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 select -->
      <template v-else-if="_fCat.ctrlType === 'select'">
        <szd-select-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 textarea -->
      <template v-else-if="_fCat.ctrlType === 'textarea'">
        <szd-textarea-ctrl
          v-model="scope.row[_fCat.field]"
          :ctrl="handleCtrlParam(_fCat, scope.row)"
          @change="handleRowChange(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 svg -->
      <template v-else-if="_fCat.ctrlType === 'svg'">
        <szd-svg
          :name="_fCat.ctrlParam.nameField ? scope.row[_fCat.ctrlParam.nameField] : _fCat.ctrlParam.name"
          :fixed="_fCat.ctrlParam.fixed"
          :color="_fCat.ctrlParam.colorField ? scope.row[_fCat.ctrlParam.colorField] : _fCat.ctrlParam.color"
          :fontSize="_fCat.ctrlParam.fontSize"
          :label="_fCat.ctrlParam.labelField ? scope.row[_fCat.labelField] : ''"
          :clicked="_fCat.ctrlParam.click"
          @click="handleRowClick(_fCat, scope.row, scope.$index)" />
      </template>
      <!--  控件类型 button -->
      <template v-else-if="_fCat.ctrlType === 'button'">
        <template v-for="ctrl in _fCat.ctrlParam">
          <szd-button-ctrl
            :ctrl="handleCtrlParamButton(_fCat, ctrl, scope.row)"
            @click="handleRowButton(ctrl.fCode, _fCat, scope.row, scope.$index)" />
        </template>
      </template>
    </template>
    <!--  控件类型 click 按钮 -->
    <template v-else-if="_fCat.click" #default="scope">
      <el-button type="primary" text @click="handleRowClick(_fCat, scope.row, scope.$index)">
        <szd-dot v-if="_fCat.$SZDDot" v-model="scope.row[_fCat.field]" :numDec="_fCat.numDec" :numDot="_fCat.numDot" :noZero="_fCat.noZero" />
        <div v-else>{{ scope.row[_fCat.field] }}</div>
      </el-button>
    </template>
    <!-- 千分位符 -->
    <template v-else-if="_fCat.$SZDDot" #default="scope">
      <szd-dot v-model="scope.row[_fCat.field]" :numDec="_fCat.numDec" :numDot="_fCat.numDot" :noZero="_fCat.noZero" />
    </template>
  </el-table-column>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from "vue";
  import _ from "lodash";
  import { setRowHelp } from "./js/tableFunc";
  import tableCompColumn from "./tableCompColumn.vue";
  import szdRouter from "../../common/utils/goRouter";
  import { getCtrlParam, getCtrlParamButton } from "./js/tableParamCtrl";

  //回调事件
  const emit = defineEmits(["handleRowEvent"]);

  const props = defineProps({
    layout: {
      type: Object
    },
    layFCat: {
      type: Object
    }
  });
  //列表头
  const _fCat = computed(() => {
    return props.layFCat;
  });

  //设置单元格是否可编辑
  const handleCtrlParam = (fCat, row) => {
    return getCtrlParam(props.layout, fCat, row);
  };

  //设置按钮操作状态
  const handleCtrlParamButton = (fCat, ctrlParam, row) => {
    return getCtrlParamButton(props.layout, fCat, ctrlParam, row);
  };

  //搜索帮助
  const handleRowHelp = (fCat, row, rowIndex) => {
    if (fCat.ctrlParam.showHelp) {
      if (fCat.ctrlParam.baseField) {
        setRowHelp(props.layout, fCat, row).then(res => {
          if (res) {
            callEmitRowEvent("$change", fCat.field, row, rowIndex);
          }
        });
      } else {
        callEmitRowEvent("$help", fCat.field, row, rowIndex); //搜索帮助回调
      }
    }
  };
  //行事件-按钮
  const handleRowButton = (fCode, fCat, row, rowIndex) => {
    callEmitRowEvent(fCode, fCat.field, row, rowIndex);
  };
  //行事件-数据更改 $change
  const handleRowChange = (fCat, row, rowIndex) => {
    callEmitRowEvent("$change", fCat.field, row, rowIndex);
  };
  //行事件-数据单击 $click
  const handleRowClick = (fCat, row, rowIndex) => {
    if (_.isObject(fCat.click)) {
      let _nav = {
        routerCode: fCat.click.routerCode,
        params: {},
        mode: fCat.click.mode
      };
      if (fCat.click.params) {
        for (let key in fCat.click.params) {
          if (_.isString(fCat.click.params[key]) && fCat.click.params[key].startsWith("row.")) {
            _nav.params[key] = row[fCat.click.params[key].substring(4)];
          } else {
            _nav.params[key] = fCat.click.params[key];
          }
        }
      }
      szdRouter.goNav(_nav.routerCode, _nav.params, _nav.mode);
    } else {
      callEmitRowEvent("$click", fCat.field, row, rowIndex);
    }
  };

  //调用父级功能-行处理事件
  const callEmitRowEvent = (fCode, field, row, index) => {
    emit("handleRowEvent", { fCode: fCode, field: field, row: row, index: index });
  };

  //行回调事件
  const handleRowEventImp = obj => {
    emit("handleRowEvent", obj);
  };
</script>
