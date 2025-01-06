<template>
  <div class="app-sub-container szd__tb__wrapper">
    <!-- 查询条件 -->
    <el-form :model="query" ref="queryForm" class="app-el-form">
      <el-row>
        <szd-input-form-item-col
          label="所属票夹"
          v-model="query.folderId"
          showHelp
          @help="szdSh({ a: 'SEIS_FOL_FOL', b: query, c: ['folderId', 'folderName'] })"
          :span="8" />
        <szd-input-form-item-col label="附件名称" v-model="query.attachName" :span="8"/>
        <szd-date-form-item-col label="上传时间" v-model="query.date" type="daterange" :span="8"/>
      </el-row>
    </el-form>
    <!-- 功能按钮 -->
    <div class="main-button">
      <div class="main-button-left" style="width: 50%"></div>
      <div class="main-button-right" style="width: 50%">
        <szd-button label="搜索" type="primary" icon="Search" @click="handleQuery" />
        <szd-button label="重置" type="primary" icon="Refresh" @click="resetQuery" />
      </div>
    </div>
    <!-- 表格输出 -->
    <el-table border stripe :data="objData.invFol" @selection-change="handleSelRow" class="flex-1">
      <el-table-column align="center" type="selection" width="40" />
      <el-table-column :label="$t('附件ID')" prop="attachId" min-width="170" />
      <el-table-column :label="$t('附件名称')" prop="attachName" min-width="150" />

      <wfConsumeInvColCat :bussBase="bussBase" />

      <el-table-column :label="$t('所属票夹')" prop="folderId" min-width="170">
        <template v-slot="scope">
          {{ scope.row.folderId + "." + scope.row.folderName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('上传时间')" prop="createTime" min-width="170" />
    </el-table>
  </div>
</template>

<script setup>
  import { defineProps, onMounted, ref } from "vue";
  import { $t } from "../../common/utils/globalConfig";
  import wfConsumeInvColCat from "./wfConsumeInvColCat.vue";
  import { wfEisConsumeFol } from "../api/wfComsume";

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object
    },
    //业务主体
    objData: {
      type: Object,
      default: {}
    }
  });

  const query = ref({
    folderId: "",
    folderName: "",
    attachName: "",
    date: []
  });

  onMounted(() => {
    initData();
  });

  const initData = () => {
    query.value.folderId = "";
    query.value.folderName = "";
    query.value.attachName = "";
    query.value.date = [];
  };

  //查询数据
  const handleQuery = () => {
    query.value.startTime = null;
    query.value.endTime = null;
    if (query.value.date && query.value.date.length > 0) {
      query.value.startTime = query.value.date[0];
      query.value.endTime = query.value.date[1];
    }
    wfEisConsumeFol(props.bussBase.bussId, query.value).then(res => {
      if (res.code === 200) {
        props.objData.invFol = res.data;
        // setRowSpans();
      }
    });
  };

  //重置
  const resetQuery = () => {
    initData();
    handleQuery();
  };

  const handleSelRow = selection => {
    props.objData.invFolSel = selection;
  };

  //构造合并数据
  const setRowSpans = () => {
    // 先给所有的数据都加一个v.rowspan = 1
    let i = 0;
    props.objData.invFol.forEach(v => {
      v.index = i;
      v.rowspan = 1;
      i++;
    });
    // 双层循环
    for (let i = 0; i < props.objData.invFol.length; i++) {
      // 就把当前v.rowspan + 1
      // 下一行的v.rowspan - 1
      for (let j = i + 1; j < props.objData.invFol.length; j++) {
        //此处可根据相同字段进行合并，此处是根据的id
        if (props.objData.invFol[i].attachId === props.objData.invFol[j].attachId) {
          props.objData.invFol[i].rowspan++;
          props.objData.invFol[j].rowspan--;
        } else {
          break;
        }
      }
      // 这里跳过已经重复的数据
      i = i + props.objData.invFol[i].rowspan - 1;
    }
  };

  const handleSpanMethod = ({ row, columnIndex }) => {
    let num = 2;
    if (columnIndex <= num) {
      return { rowspan: row.rowspan, colspan: 1 };
    }
  };
</script>
