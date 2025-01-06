<template>
  <el-dialog
    style="max-height: 90%"
    id="shDialog"
    :title="winParams.pcTitle"
    v-model="winParams.open"
    append-to-body
    class="app-dialog-container"
    @close="closeDialog('cancel')"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[winParams.pcWidth, winParams.pcHeight]" />
    <!-- 选项卡-帮助集 -->
    <div v-if="winParams.groupFlag">
      <el-tabs v-model="winParams.activeTabGroup" type="card" @tab-click="handleTabClick">
        <el-tab-pane v-for="(item, index) in selfParams.helpArr" :label="item.header.fieldName" :name="item.header.fieldCode" :key="index" />
      </el-tabs>
    </div>

    <!-- 查询条件 -->
    <el-form class="app-el-form" v-if="selectParams.length > 0">
      <el-row>
        <!-- 查询条件列数winParams.pcSelectCol 循环输出查询条件 更多筛选winParams.advancedSearch = 0仅显示第一行-->
        <template v-for="(item, index) in selectParams" :key="index">
          <el-col :span="24 / Number(winParams.pcSelectCol)" v-if="winParams.advancedSearch === 0 ? index < winParams.pcSelectCol : true">
            <!-- 基础字段下拉 -->
            <el-form-item v-if="item.fieldHelpType === 'B'" :label="item.fieldName">
              <szd-select v-model="item.fieldVal" :baseField="item.fieldHelpCode" :disabled="item.fieldDisplay" @keyup.enter.native="getSearch" />
            </el-form-item>
            <!-- 基础字段帮助 -->
            <el-form-item v-else :label="item.fieldName">
              <szd-input
                v-model="item.fieldVal"
                :disabled="item.fieldDisplay"
                :show-help="item.fieldHelpType === 'A' && item.fieldHelpCode"
                @help="szdSh({ a: item.fieldHelpCode, b: item, c: ['fieldVal-' + item.fieldHelpMap] })"
                @keyup.enter="getSearch" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <!-- 页标签 和 查询按钮 无常用值 winParams.pcCommonFlag 且无查询条件selectParams.length 不输出-->
    <el-row class="tabBox" v-if="winParams.pcCommonFlag || selectParams.length > 0">
      <!-- 页标签设置 -->
      <el-col :span="12" class="tabBoxCol">
        <div style="display: flex" v-if="winParams.pcCommonFlag">
          <div class="tabBoxTab" :style="{ color: tabStyle.allFontColor }" @click="setTab(0)">{{ $t("所有值") }}</div>
          <div class="tabBoxTab" :style="{ color: tabStyle.comFontColor }" @click="setTab(1)">{{ $t("常用值") }}</div>
          <div class="tabBoxLine" :style="{ left: tabStyle.left }" />
        </div>
      </el-col>
      <!-- 查询按钮设置 selectParams.length<pcSelectCol 查询条件小于列数，不输出更多筛选 -->
      <el-col :span="12" class="searchBox" v-if="selectParams.length > 0">
        <szd-button label="搜索" type="primary" icon="Search" @click="getSearch" />
        <szd-button label="同步" type="primary" icon="Sort" @click="getSync" v-if="winParams.pcJobCode" />
        <szd-button label="重置" type="primary" icon="Refresh" @click="setReset" />
        <szd-button label="更多筛选" type="primary" icon="DCaret" @click="setAdvancedSearch" v-if="selectParams.length > winParams.pcSelectCol" />
      </el-col>
    </el-row>

    <!-- 数据输出 单元格双击事件 复选选择事件 排序事件 -->
    <el-table stripe border :data="tableData" @cell-dblclick="handCellDblclick" @selection-change="handleSelectionChange" @sort-change="handleSort">
      <!-- 复选框 -->
      <el-table-column v-if="winParams.multipleChoice === 2" type="selection" align="center" width="55" />
      <!-- 数据列 -->
      <el-table-column
        v-for="(item, index) in columnParams"
        :key="index"
        :prop="item.fieldId"
        :label="$t(item.fieldName)"
        :width="item.fieldColWidth"
        :align="item.fieldColAlign"
        :sortable="item.fieldColSort" />
      <!-- 操作列输出 无常用值winParams.pcCommonFlag不输出 添加常用之winParams.activeTab===0 -->
      <el-table-column v-if="winParams.pcCommonFlag" :label="$t('操作')" align="center">
        <template v-slot="scope">
          <!-- 添加常用winParams.activeTab===0 -->
          <szd-button
            label="添加常用"
            type="primary"
            link
            @click="handleClickRowAdd(scope.row)"
            v-if="winParams.activeTab === 0"
            :disabled="scope.row.SZDcommonValFlagSZD === '1'" />
          <!-- 删除常用winParams.activeTab===0 -->
          <szd-button label="删除常用" type="primary" link @click="handleClickRowDel(scope.row, scope.$index)" v-if="winParams.activeTab === 1" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页设置 和 确定按钮 -->
    <template #footer>
      <div class="main-button">
        <div class="main-button-left" style="width: 70%">
          <szd-pagination
            position="left"
            :total="winParams.total"
            v-model:page="winParams.pageNum"
            :page-sizes="winParams.pageSizes"
            v-model:limit="winParams.pageSize"
            @pagination="getSelectParams" />
        </div>
        <div class="main-button-right" style="width: 30%">
          <szd-button label="确定" v-if="winParams.multipleChoice === 2" type="primary" @click="okay" />
          <szd-button label="取消" type="primary" @click="cancel" />
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<script>
  import { searchHelpList, addCommonValues, delCommonValues, syncMdm } from "../api/searchHelp.js";

  export default {
    data() {
      return {
        //URL参数传入
        urlParams: {
          urlAll: "/core/common/sh/all/list", //所有值请求地址
          urlCom: "/core/common/sh/com/list" //常用值请求地址
        },
        //页签样式
        tabStyle: {
          allFontColor: "#1890ff", //所有值下划线
          comFontColor: "", //常用值
          left: "0px"
        },
        //窗口大小和参数
        winParams: {
          open: false,
          total: 0, //总条数
          pageSizes: [], //分页大小
          pageSize: 20, //页大小
          pageNum: 1, //当前页

          activeTab: 0, //0所有值 1常用值
          advancedSearch: 0, //更多查询条件

          activeTabGroup: "", //集标签
          multipleChoice: 1, //单选多选
          pcTitle: "搜索帮助", //窗口标题
          pcWidth: 1000, //窗口宽度
          pcHeight: 600, //窗口高度
          pcSelectCol: 2, //查询列
          pcCommonFlag: true, //显示常用值
          pcUrlCus: "", //自定义后端请求
          pcJobCode: "", //同步接口程序

          groupFlag: false, //帮助集

          baseField: "" //基础字段
        },
        //排序列
        sortGroup: [
          {
            sortField: "", //排序字段
            sortType: "" //排序方式
          }
        ],
        //备份参数
        selfParams: {
          helpArr: [], //帮助数组
          objStyle: {} //样式
        },
        //搜索帮助
        objHelp: {},
        //查询条件
        selectParams: [],
        //查询结果列头
        columnParams: [],
        //输出数据
        tableData: [],
        //多选行
        listSel: [],
        //返回参数
        retParam: {
          defFieldId: ""
        }
      };
    },
    methods: {
      //接受数据
      getAcceptData(objParam) {
        this.objHelp = objParam;
        //窗口样式
        this.setStyles(this.objHelp.header);
        //设置查询条件
        this.setSelectParams(this.objHelp.pcFilter);
        //设置表头列
        this.setColumnParams(this.objHelp.pcOutput);
        //获取后台数据
        this.getSelectParams();
        this.winParams.open = true;
      },
      //设置窗口样式
      setStyles(header) {
        if (Array.isArray(header.pcPageSizes) && header.pcPageSizes.length > 0) {
          this.winParams.pageSizes = JSON.parse(header.pcPageSizes);
        } else {
          this.winParams.pageSizes = [20, 50, 200, 500];
        }
        this.winParams.pageSize = this.winParams.pageSizes[0];
        this.winParams.pageNum = 1;

        this.winParams.pcSelectCol = header.pcSelectCol ? header.pcSelectCol : 2; //查询列
        this.winParams.pcCommonFlag = header.pcCommonFlag; //显示常用值
        this.winParams.pcUrlCus = header.pcUrlCus; //自定义后端请求
        this.winParams.pcJobCode = header.pcJobCode; //同步接口程序
        this.retParam.defFieldId = ""; //默认回填字段代码
      },
      //设置查询条件
      setSelectParams(pcFilter) {
        this.selectParams = [];
        for (let i = 0; i < pcFilter.length; i++) {
          this.selectParams.push({
            fieldId: pcFilter[i].fieldId,
            fieldName: pcFilter[i].fieldName,
            fieldVal: pcFilter[i].fieldVal ? pcFilter[i].fieldVal : "",
            fieldMode: pcFilter[i].fieldMode,
            fieldDisplay: pcFilter[i].fieldDisplay,
            fieldHelpType: pcFilter[i].fieldHelpType,
            fieldHelpCode: pcFilter[i].fieldHelpCode,
            fieldHelpMap: pcFilter[i].fieldHelpMap
          });
        }
      },
      //设置表列头赋值
      setColumnParams(pcOutput) {
        this.columnParams = [];
        for (let i = 0; i < pcOutput.length; i++) {
          if (pcOutput[i].fieldRetDef) {
            this.retParam.defFieldId = pcOutput[i].fieldId; //默认回填
          }
          if (!pcOutput[i].fieldColHide) {
            this.columnParams.push({
              fieldId: pcOutput[i].fieldId,
              fieldName: pcOutput[i].fieldName,
              fieldColWidth: pcOutput[i].fieldColWidth ? pcOutput[i].fieldColWidth : "", //列宽度
              fieldColAlign: pcOutput[i].fieldColAlign ? pcOutput[i].fieldColAlign : "", //对齐方式
              fieldColSort: pcOutput[i].fieldColSort //排序
            });
          }
          if (!this.retParam.defFieldId && this.columnParams.length > 0) {
            this.retParam.defFieldId = this.columnParams[0].fieldId;
          }
        }
      },

      /**************从后台获取数据列表******************/
      //后台查询数据-获取查询条件参数
      getSelectParams() {
        let arr = [];
        for (let i = 0; i < this.selectParams.length; i++) {
          arr.push({
            paramName: this.selectParams[i].fieldId,
            paramValue: this.selectParams[i].fieldVal,
            paramMode: this.selectParams[i].fieldMode ? "=" : "like"
          });
        }
        let json = {
          baseField: this.winParams.baseField,
          client: "PC",
          pageNum: this.winParams.pageNum,
          pageSize: this.winParams.pageSize,
          _paramGroup: arr,
          _sortGroup: this.sortGroup
        };
        this.getRequest(json);
      },
      //后台查询数据-获取清单
      getRequest(requestJson) {
        let url = "";
        this.tableData = [];
        if (this.winParams.activeTab === 0) {
          url = this.winParams.pcUrlCus ? this.winParams.pcUrlCus : this.urlParams.urlAll;
        } else {
          url = this.urlParams.urlCom;
        }
        searchHelpList(requestJson, url).then(res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.winParams.total = res.total;
          }
        });
      },
      //页签切换(所有值和常用值)
      setTab(tab) {
        if (tab === this.winParams.activeTab) {
          return;
        }
        this.winParams.activeTab = tab;
        if (tab === 0) {
          this.tabStyle.left = 0 + "px";
          this.tabStyle.comFontColor = "";
          this.tabStyle.allFontColor = "#1890ff";
        } else if (tab === 1) {
          this.tabStyle.left = 60 + "px";
          this.tabStyle.comFontColor = "#1890ff";
          this.tabStyle.allFontColor = "";
        }
        this.getSelectParams();
      },

      /***********查询数据(查询、重置、更多筛选、同步数据)**************/
      //查询数据
      getSearch() {
        //点击搜索按钮要把页码重置为1
        this.winParams.pageNum = 1;
        this.getSelectParams();
      },
      //显示更多筛选
      setAdvancedSearch() {
        this.winParams.advancedSearch = this.winParams.advancedSearch === 0 ? 1 : 0;
      },
      //重置
      setReset() {
        //设置查询条件
        this.setSelectParams(this.objHelp.pcFilter);
      },
      //同步数据
      getSync() {
        syncMdm(this.winParams.baseField).then(res => {
          if (res.code === 200) {
            this.$m("CORE_CLIENT.S005"); //同步成功
            this.getSearch();
          }
        });
      },
      /***********事件处理(排序、多选、双击、确定)**************/
      //排序
      handleSort(column) {
        this.sortGroup[0].sortField = column.prop;
        this.sortGroup[0].sortType = column.order;
        this.getSelectParams();
      },
      //多选
      handleSelectionChange(val) {
        this.listSel = val;
      },
      //双击
      handCellDblclick(row) {
        let arr = [];
        arr.push(row);
        this.okayExitSearchHelp(arr);
      },
      //确定传输数据
      okay() {
        if (this.listSel.length === 0) {
          this.$mE("请至少选择一行数据");
        } else {
          this.okayExitSearchHelp(this.listSel);
        }
      },
      //返回选中值
      okayExitSearchHelp(selectRows) {
        this.$emit("exitSearchHelp", selectRows, this.winParams.baseField, this.retParam);
        this.winParams.open = false;
        this.closeDialog("okay");
      },
      // 关闭窗口
      cancel() {
        this.winParams.open = false;
        this.closeDialog("cancel");
      },
      //关闭窗口
      closeDialog(type) {
        this.$emit("closeDialog", type);
      },

      /***********常用值(添加、删除)**************/
      //添加常用值
      handleClickRowAdd(row) {
        let params = {
          baseField: this.winParams.baseField,
          client: "PC",
          fieldVal: JSON.stringify(row)
        };
        addCommonValues(params).then(res => {
          if (res.code === 200) {
            row.SZDcommonValFlagSZD = "1";
            this.$mS("添加成功");
          }
        });
      },
      //删除常用
      handleClickRowDel(row, index) {
        let params = {
          baseField: this.winParams.baseField,
          client: "PC",
          fieldVal: JSON.stringify(row)
        };
        delCommonValues(params).then(res => {
          if (res.code === 200) {
            this.tableData.splice(index, 1);
            this.$mS("删除成功");
          }
        });
      },

      /************************搜索帮助集-选中当前搜索帮助**************************/
      //TAB标签搜索帮助切换事件
      handleTabClick(tab) {
        this.getReqParams(this.selfParams.helpArr, tab.paneName, this.selfParams.objStyle);
      },
      //获取配置参数文件 帮助数组,基础字段,样式
      getReqParams(helpArr, fieldCode, objStyle) {
        //记录历史值
        this.selfParams.helpArr = helpArr; //帮助数组
        this.selfParams.objStyle = objStyle; //样式

        this.winParams.activeTabGroup = fieldCode; //帮助集标签
        this.winParams.multipleChoice = objStyle.multipleChoice; //单选多选
        this.winParams.pcTitle = objStyle.pcTitle; //窗口标题
        this.winParams.pcWidth = objStyle.pcWidth; //窗口宽度
        this.winParams.pcHeight = objStyle.pcHeight; //窗口高度
        this.winParams.groupFlag = objStyle.groupFlag; //帮助集
        this.winParams.baseField = fieldCode; //基础字段

        //获得当前展示的屏幕信息
        let tempHelp = {};
        for (let i = 0; i < helpArr.length; i++) {
          if (helpArr[i].header.fieldCode === fieldCode) {
            tempHelp = helpArr[i];
            break;
          }
        }
        this.getAcceptData(tempHelp);
      }
    }
  };
</script>

<style scoped>
  .tabBox {
    border-bottom: 2px solid #dfe4ed;
    margin-bottom: 10px;
    display: flex;
  }

  .tabBoxCol {
    height: 40px;
    display: flex;
    position: relative;
  }

  .tabBoxTab {
    font-size: 12px;
    width: 50px;
    margin-right: 10px;
    text-align: justify;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    font-weight: 600;
  }

  .tabBoxLine {
    background: #1890ff;
    width: 50px;
    height: 2px;
    position: absolute;
    bottom: -2px;
  }

  .searchBox {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .el-tabs--card :deep(.el-tabs__header .el-tabs__nav) {
    border-radius: 0 0 0 0;
    height: auto;
  }

  :deep(.el-tabs__header) {
    margin: 0 0 10px 0;
    height: auto;
  }

  .el-tabs--card :deep(.el-tabs__header) {
    border-bottom: 2px solid #dfe4ed;
  }

  :deep(.el-tabs--card .el-tabs__header .el-tabs__item.is-active) {
    border-bottom: 2px solid #1890ff;
  }
</style>
