<template>
  <!-- 表格输出 -->
  <el-table ref="refTable1" border stripe :data="layList" class="flex-1">
    <el-table-column prop="variant" :label="$t('变式代码')" min-width="100">
      <template v-slot="scope">
        <el-button type="primary" link @click="handleRowSel(scope.row)">{{ scope.row.variant }}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="varName" :label="$t('变式名称')" min-width="180" />
    <el-table-column prop="varMode" :label="$t('变式级别')" min-width="100" align="center">
      <template v-slot="scope">
        <span v-if="scope.row.varMode === 'A'">{{ $t("所有人可用") }}</span>
        <span v-else>{{ $t("仅自己可用") }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="varDefault" :label="$t('默认变式')" min-width="60" align="center">
      <template v-slot="scope">
        <span v-if="scope.row.varDefault">{{ $t("是") }}</span>
        <span v-else>{{ $t("否") }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="userName" :label="$t('创建人')" min-width="100" />
    <el-table-column :label="$t('操作')" align="center" width="220" fixed="right">
      <template v-slot="scope">
        <el-button type="primary" link icon="Finished" @click="handleRowSel(scope.row)">{{ $t("选择") }}</el-button>
        <template v-if="scope.row.auth">
          <el-button v-if="!scope.row.varDefault" type="primary" link icon="Edit" @click="handleRowDef(scope.row)">
            {{ $t("默认") }}
          </el-button>
          <el-button v-else type="primary" link icon="Edit" @click="handleRowDefRemove(scope.row)">
            {{ $t("取消默认") }}
          </el-button>
          <el-button type="primary" link icon="Delete" @click="handleRowDel(scope.row)">{{ $t("删除") }}</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import { defineEmits, defineProps } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";
  import { delVariant, setVarDef, removeVarDef } from "../../api/statistics";
  //回调事件
  const emit = defineEmits(["stats-refresh-list", "stats-select"]);
  const props = defineProps({
    layList: {
      type: Array
    }
  });
  //选择布局
  const handleRowSel = row => {
    emit("stats-select", row);
  };
  //设置默认值刷新数据
  const handleRowDef = row => {
    let json = {
      report: row.report,
      variant: row.variant, //变式代码
      varMode: row.varMode //变式级别
    };
    setVarDef(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S002"); //处理成功
        emit("stats-refresh-list"); //刷新数据
      }
    });
  };
  //取消默认值刷新数据
  const handleRowDefRemove = row => {
    let json = {
      report: row.report,
      variant: row.variant, //变式代码
      varMode: row.varMode //变式级别
    };
    removeVarDef(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S002"); //处理成功
        emit("stats-refresh-list"); //刷新数据
      }
    });
  };
  //删除布局
  const handleRowDel = row => {
    let json = {
      report: row.report,
      variant: row.variant, //变式代码
      varMode: row.varMode //变式级别
    };
    delVariant(json).then(res => {
      if (res.code === 200) {
        $m("CORE_CLIENT.S003"); //删除成功
        emit("stats-refresh-list"); //刷新数据
      }
    });
  };
</script>
