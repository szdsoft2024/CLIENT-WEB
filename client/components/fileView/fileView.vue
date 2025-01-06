<template>
  <!-- img预览 -->
  <el-image v-if="_fileType === 'img'" :src="_src" fit="contain" />
  <!-- pdf预览 -->
  <iframe v-else-if="_fileType === 'pdf'" :src="_src" frameborder="0" style="width: 100%; height: 100%" />
  <!-- txt预览 -->
  <iframe v-else-if="_fileType === 'txt'" :src="_src" frameborder="0" style="width: 100%; height: 100%" />
  <!-- video预览 -->
  <video v-else-if="_fileType === 'video'" :src="_src" controls style="width: 100%; height: 100%" />
  <!-- docx预览 -->
  <vue-office-docx v-else-if="_fileType === 'docx'" :src="_src" style="width: 100%; height: 100%" />
  <!-- xlsx预览 -->
  <vue-office-excel v-else-if="_fileType === 'xlsx'" :src="_src" style="width: 100%; height: 100%" />
  <!-- xls预览 使用tab选项卡来模拟Excel的sheet页 -->
  <div v-else-if="_fileType === 'xls'" class="excel-view-container">
    <el-tabs v-if="xlsSheets && xlsSheets.length" type="border-card" @tab-click="handleTabClickXls">
      <el-tab-pane v-for="(item, index) in xlsSheets" :label="item" :key="index">
        <div id="xlsView" v-html="xlsView" style="width: 100%; height: 100%; overflow: auto" />
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else style="width: 100%; height: 100%">{{ $t("文件显示失败,请使用下载或联系技术人员") }}</div>
</template>

<script setup>
  import { defineProps, ref, nextTick, computed, onMounted } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { downloadFile } from "./api";
  import { szdGetFileBlobType, szdGetFileType } from "./fileView";
  import VueOfficeExcel from "@vue-office/excel";
  import "@vue-office/excel/lib/index.css";
  import VueOfficeDocx from "@vue-office/docx";
  import "@vue-office/docx/lib/index.css";
  import * as XLSX from "xlsx-js-style";

  const props = defineProps({
    src: {
      type: String,
      default: ""
    },
    srcBlob: {
      type: String,
      default: ""
    },
    fileName: {
      type: String,
      default: ""
    },
    isBlob: {
      type: Boolean,
      default: false
    }
  });
  //文件后缀类型
  const _fileType = computed(() => {
    if (props.fileName) {
      return szdGetFileType(props.fileName);
    } else {
      return szdGetFileType(props.src);
    }
  });
  //下载文件方式
  const _blobType = computed(() => {
    if (props.isBlob || _fileType.value === "xls") {
      let _fileName = props.fileName ? props.fileName : props.src;
      let bt = szdGetFileBlobType(_fileName);
      if (!bt) {
        nextTick(() => {
          $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
        });
        return "";
      } else {
        return bt;
      }
    } else {
      return "";
    }
  });

  //字节流
  const _src = ref();
  //excel数据
  const xlsView = ref();
  const xlsWorkBook = ref();
  const xlsSheets = ref();

  onMounted(() => {
    if (_fileType.value) {
      initDataSrc();
    } else {
      $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
    }
  });

  //初始化数据
  const initDataSrc = () => {
    if (_fileType.value === "xls") {
      if (props.src) {
        fileXls();
      } else {
        $m("CORE_CLIENT.E018"); //src地址不能为空
      }
    } else {
      if (props.srcBlob) {
        _src.value = props.srcBlob;
      } else if (props.src) {
        if (props.isBlob) {
          downloadBlob();
        } else {
          _src.value = props.src;
        }
      } else {
        $m("CORE_CLIENT.E019"); //src或srcBlob地址不能为空
      }
    }
  };

  //下载文件
  const downloadBlob = () => {
    downloadFile(props.src).then(res => {
      if (["img", "xlsx", "docx", "pdf", "txt"].includes(_fileType.value)) {
        //图片/pdf/txt类型
        const blob = new Blob([res], { type: _blobType.value });
        _src.value = window.URL.createObjectURL(blob);
      } else {
        const blob = new Blob([res]);
        _src.value = window.URL.createObjectURL(blob);
      }
    });
  };

  //xls预览-下载文件
  const fileXls = () => {
    downloadFile(props.src).then(res => {
      let blob = new Blob([res], { type: _blobType.value });
      let reader = new FileReader();
      //另一种方式：blob类型转换为ArrayBuffer类型 reader.readAsArrayBuffer(blob);  XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
      reader.readAsBinaryString(blob);
      //文件转换
      reader.onload = ev => {
        xlsWorkBook.value = XLSX.read(ev.target.result, { type: "binary" });
        xlsSheets.value = xlsWorkBook.value.SheetNames;
        xlsView.value = XLSX.utils.sheet_to_html(xlsWorkBook.value.Sheets[xlsSheets.value[0]]);
        nextTick(() => {
          setStyle4ExcelHtml();
        });
      };
    });
  };
  //xls预览-页签切换
  const handleTabClickXls = obj => {
    xlsView.value = XLSX.utils.sheet_to_html(xlsWorkBook.value.Sheets[xlsSheets.value[obj.index]]);
  };
  //设置Excel转成HTML后的样式
  const setStyle4ExcelHtml = () => {
    const xlsViewDOM = document.getElementById("xlsView");
    if (xlsViewDOM) {
      // 获取的是HTMLConnection
      const xlsViewTDNodes = xlsViewDOM.getElementsByTagName("td");
      if (xlsViewTDNodes) {
        const xlsViewTDArr = Array.prototype.slice.call(xlsViewTDNodes);
        for (const i in xlsViewTDArr) {
          const id = xlsViewTDArr[i].id; // 默认生成的id格式为sjs-A1、sjs-A2......
          if (id) {
            const idNum = id.replace(/[^0-9]/gi, ""); // 提取id中的数字，即行号
            if (idNum && (idNum === "1" || idNum === 1)) {
              // 第一行标题行
              xlsViewTDArr[i].classList.add("classTitle");
              // xlsViewTDArr[i].innerText = ' '
            }
            if (idNum && (idNum === "2" || idNum === 2)) {
              // 第二行表头行
              xlsViewTDArr[i].classList.add("classTableTh");
            }
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .excel-view-container {
    width: 100%;
    margin: auto;
    height: 100%;

    .el-tabs {
      height: 100%;
      position: relative;

      .el-tabs__header {
        position: absolute;
        width: 100%;
        bottom: 0;

        .el-tabs__item.is-active {
          border-top: 1px solid;
        }
      }

      .el-tabs__content {
        height: 100%;
        overflow: auto;
        padding: 0;
      }
    }
  }

  :deep(#xlsView) {
    table {
      border-collapse: collapse;
      table-layout: fixed;

      .classTitle {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #eee;
      }

      td {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #ddd;
        width: 50px;
        height: 20px;
      }
    }
  }
</style>
