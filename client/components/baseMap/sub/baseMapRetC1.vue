<template>
  <!--   结果映射   -->
  <div class="app-sub-container app-sub-sub szd__tb__wrapper">
    <!-- 功能按钮 -->
    <div class="main-table-title">
      <div class="main-table-title-left" style="width: 50%">
        <span>{{ $t("消费方表结构可同时赋值多个字段") }}</span>
      </div>
    </div>
    <!-- 返回结果 -->
    <el-table border stripe :data="_baseMap.retList" class="flex-1">
      <el-table-column :label="$t('服务字段')" prop="servFieldName" min-width="150" />
      <el-table-column :label="$t('消费字段')" prop="consField" min-width="150">
        <template #default="scope">
          <szd-select
            v-if="_baseArr.cols[_baseMap.header.consTable] && _baseArr.cols[_baseMap.header.consTable].length > 0"
            v-model="scope.row.consField"
            :baseArr="_baseArr.cols[_baseMap.header.consTable]"
            clearable />
        </template>
      </el-table-column>
      <el-table-column :label="$t('消费字段Key前缀')" prop="consFieldPre" min-width="150">
        <template #default="scope">
          <szd-select
            v-if="_baseArr.cols[_baseMap.header.consTable] && _baseArr.cols[_baseMap.header.consTable].length > 0"
            v-model="scope.row.consFieldPre"
            :baseArr="_baseArr.cols[_baseMap.header.consTable]"
            clearable />
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
</script>
