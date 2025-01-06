<template>
  <!--  C4 直接赋值 下对上，上对下，表头间相互赋值  存在顺序处理问题及死循环问题 -->
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
            clearable
            :disabled="scope.row.servFix" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('固定值')" prop="servFix" width="60" align="center">
        <template #default="scope">
          <szd-checkbox v-model="scope.row.servFix" @change="handleChangeServFix(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('默认值')" prop="servDef" min-width="100">
        <template #default="scope">
          <szd-input v-model="scope.row.servDef" :disabled="!scope.row.servFix" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('规则')" prop="consMoveRule" min-width="100">
        <template #default="scope">
          <szd-select v-model="scope.row.consMoveRule" baseField="CORE_SCP_MP_MOVE_RULE" first />
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="60" align="center">
        <template v-slot="scope">
          <el-button type="primary" link @click="delRow(scope.row)" icon="Delete">
            {{ $t("删除") }}
          </el-button>
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
      servFix: false, //固定值
      servDef: "", //默认值
      consMoveRule: "" //赋值规则
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

  //更改固定值
  const handleChangeServFix = row => {
    row.consField = "";
    row.servDef = "";
  };
</script>
