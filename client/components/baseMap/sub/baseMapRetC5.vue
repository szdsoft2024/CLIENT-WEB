<template>
  <!-- C5 汇总赋值 上级汇总下级，表头或自己结构汇总，存在顺序处理问题及死循环问题-->
  <div class="app-sub-container app-sub-sub szd__tb__wrapper">
    <!-- 功能按钮 -->
    <div class="main-table-title">
      <div class="main-table-title-left" style="width: 50%">
        <span>{{ $t("设置时禁止出现相互赋值情况") }}</span>
      </div>
      <div class="main-table-title-right" style="width: 50%">
        <szd-button label="新增" type="primary" link icon="Plus" @click="addRow" />
      </div>
    </div>
    <!--  返回结果 -->
    <el-table border stripe :data="_baseMap.retList" class="flex-1">
      <el-table-column :label="$t('排序')" prop="consMovePos" min-width="100">
        <template #header>
          <szd-table-col-header required label="排序" />
        </template>
        <template #default="scope">
          <szd-input-number v-model="scope.row.consMovePos" :min="0" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作符')" prop="consOption" width="120" align="center">
        <template #default="scope">
          <szd-select
            :baseArr="[
              { svalue: '+', sname: '相加' },
              { svalue: '-', sname: '相减' }
            ]"
            v-model="scope.row.consOption"
            first />
        </template>
      </el-table-column>
      <el-table-column :label="$t('消费表')" prop="consTable" min-width="170">
        <template #default="scope">
          <szd-select
            v-model="scope.row.consTable"
            :baseArr="_baseArr.table"
            :disabled="scope.row.servFix"
            first
            @change="handleChangeConsTable(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('消费表字段')" prop="consField" min-width="150">
        <template #default="scope">
          <szd-select
            v-if="_baseArr.cols[scope.row.consTable] && _baseArr.cols[scope.row.consTable].length > 0"
            v-model="scope.row.consField"
            :baseArr="_baseArr.cols[scope.row.consTable]"
            clearable />
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="60" align="center">
        <template v-slot="scope">
          <szd-button label="删除" type="primary" link @click="delRow(scope.row)" icon="Delete" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, computed } from "vue";
  import { $t } from "../../../common/utils/globalConfig";

  //定义事件
  const emit = defineEmits(["update:baseMap"]);

  const props = defineProps({
    baseMap: {
      type: Object
    },
    baseArr: {
      type: Object
    }
  });

  //值数据
  const _baseMap = computed({
    get: () => props.baseMap,
    set: val => {
      emit("update:baseMap", val);
    }
  });

  //消费方选择字段
  const _baseArr = computed(() => {
    return props.baseArr;
  });

  //新增行
  const addRow = () => {
    _baseMap.value.retList.push({
      consMovePos: 0, //排序
      consTable: "", //消费表
      consField: "", //消费表字段
      consOption: "+", //操作符
      servFix: false, //固定值
      servDef: "" //默认值
    });
  };

  //删除行
  const delRow = row => {
    _baseMap.value.retList = _baseMap.value.retList.filter(item => item !== row);
  };

  //更改消费字段
  const handleChangeConsTable = row => {
    row.consField = "";
  };
</script>
