<template>
  <!-- 列目录 -->
  <el-table-column :label="$t('业务小类')" prop="bsub" min-width="250">
    <template v-slot="scope">
      <szd-input-desc
        v-model="scope.row.bsub"
        showHelp
        @help="
          szdSh({
            a: 'CORE_BSUB01',
            b: scope.row,
            c: ['bsub', 'bsubName'],
            d: [
              ['bstp', scope.row.bstp],
              ['compCode', scope.row.compCode]
            ]
          })
        "
        :desc="scope.row.bsubName"
        :descSpan="12" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('票据类型')" prop="invTypeCode" min-width="200">
    <template v-slot="scope">
      <szd-select v-model="scope.row.invTypeCode" baseField="CORE_INVT" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('发票代码')" prop="invCode" min-width="120">
    <template v-slot="scope">
      <szd-input v-model="scope.row.invCode" :maxlength="15" />
    </template>
  </el-table-column>
  <!-- 发票代码 -->
  <el-table-column :label="$t('发票号码')" prop="invNo" min-width="120">
    <template v-slot="scope">
      <szd-input v-model="scope.row.invNo" :maxlength="12" />
    </template>
  </el-table-column>
  <!-- 发票代码 -->
  <el-table-column :label="$t('发票日期')" prop="invDate" min-width="130" align="center">
    <template v-slot="scope">
      <szd-date v-model="scope.row.invDate" type="date" />
    </template>
  </el-table-column>
  <!-- 税率% -->
  <el-table-column :label="$t('税率')" prop="invTaxRate" min-width="80" align="center">
    <template #header>{{ $t("税率") }}</template>
    <template v-slot="scope">
      <szd-select v-model="scope.row.invTaxRate" baseField="CORE_TAXR" />
    </template>
  </el-table-column>
  <!-- 金额 -->
  <el-table-column prop="invAmt" :label="$t('金额(含税)')" min-width="120" align="right">
    <template #header>{{ $t("金额(含税)") }}</template>
    <template v-slot="scope">
      <szd-input type="number" v-model="scope.row.invAmt" numDot :numDec="2" :numMin="0" />
    </template>
  </el-table-column>
  <el-table-column prop="invAmtTax" :label="$t('税额')" min-width="100" align="right">
    <template v-slot="scope">
      <szd-input type="number" v-model="scope.row.invAmtTax" numDot :numDec="2" :numMin="0" />
    </template>
  </el-table-column>
  <el-table-column prop="invAmtNoTax" :label="$t('金额(不含税)')" min-width="120" align="right">
    <template v-slot="scope">
      <szd-input type="number" v-model="scope.row.invAmtNoTax" numDot :numDec="2" :numMin="0" />
    </template>
  </el-table-column>
  <!-- 销方信息 -->
  <el-table-column :label="$t('销方信息')" prop="sellerName" min-width="200">
    <template v-slot="scope">
      <szd-input v-model="scope.row.sellerName" :maxlength="200" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('纳税人识别号')" prop="sellerTaxNum" min-width="180">
    <template v-slot="scope">
      <szd-input v-model="scope.row.sellerTaxNum" :maxlength="50" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('发票校验码')" prop="invCheckCode" min-width="120">
    <template v-slot="scope">
      <szd-input v-model="scope.row.invCheckCode" :maxlength="50" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('开始日期')" prop="startDate" min-width="130" align="center">
    <template v-slot="scope">
      <szd-date v-model="scope.row.startDate" type="date" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('结束日期')" prop="endDate" min-width="130" align="center">
    <template v-slot="scope">
      <szd-date v-model="scope.row.endDate" type="date" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('出发城市')" prop="startCity" min-width="120">
    <template v-slot="scope">
      <szd-area v-model="scope.row.startCity" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('到达城市')" prop="endCity" min-width="120">
    <template v-slot="scope">
      <szd-area v-model="scope.row.endCity" />
    </template>
  </el-table-column>
  <!-- 座位等级 -->
  <el-table-column :label="$t('座位等级')" prop="seatClass" min-width="120">
    <template v-slot="scope">
      <szd-select
        v-if="scope.row.bsub"
        v-model="scope.row.seatClass"
        baseField="CORE_BSUBPJ"
        :baseSelect="[['bsub', scope.row.bsub]]"
        :nullObj="scope.row.bsub" />
    </template>
  </el-table-column>
  <el-table-column :label="$t('费用发生城市')" prop="city" min-width="120">
    <template v-slot="scope">
      <szd-area v-model="scope.row.city" />
    </template>
  </el-table-column>
</template>

<script setup>
  import { defineProps } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    }
  });

  //重置业务小类
  const handleChangeComp = row => {
    row.bsub = "";
    row.bsubName = "";
  };
</script>
