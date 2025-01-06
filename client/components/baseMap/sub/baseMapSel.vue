<template>
  <!--   查询条件   -->
  <div class="app-sub-container app-sub-sub szd__tb__wrapper">
    <el-table border stripe :data="_baseMap.selList" class="flex-1">
      <el-table-column :label="$t('服务字段')" prop="servFieldName" min-width="130" />
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
