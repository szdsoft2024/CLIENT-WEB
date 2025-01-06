<template>
  <!-- 通用导入Excel组件 -->
  <el-dialog
    :title="$t(uploadParams.title)"
    v-model="dg.open"
    append-to-body
    class="app-dialog-container"
    @close="handleClose"
    align-center
    destroy-on-close
    draggable>
    <div v-szd-dialog="[400, 380]"></div>
    <el-upload
      ref="upload"
      :limit="uploadParams.limit"
      :accept="uploadParams.accept"
      :headers="conParams.headers"
      :action="uploadParams.uploadUrl"
      :auto-upload="false"
      :disabled="uploadParams.disabled"
      :before-upload="beforeUpload"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("将文件拖到此处，或") }} <em>{{ $t("点击上传") }}</em>
      </div>
      <!-- 导入文件提示信息 -->
      <div v-if="uploadParams.acceptTxt" class="el-upload__tip" style="color: red" slot="tip">
        {{ uploadParams.acceptTxt }}
      </div>
    </el-upload>

    <template #footer>
      <szd-button label="下载模板" type="primary" @click="handleDownloadTM" v-if="uploadParams.TMCode" />
      <szd-button label="确定" type="primary" @click="submitForm" />
      <szd-button label="取消" type="primary" @click="handleCloseForm" />
    </template>
  </el-dialog>
</template>

<script>
  import { downloadTemplate } from "../api/upload.js";

  export default {
    props: {
      updParams: {
        type: Object,
        default: () => ({})
      },
      initByJs: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dg: {
          open: false,
          retCode: "" //返回码，S成功(刷新) Q或空取消操作 E 操作错误
        },
        conParams: {
          headers: {
            // 设置上传的请求头部
            Authorization: "Bearer " + this.szdStoreCookie.getToken()
          },
          rootUrl: process.env.VUE_APP_BASE_API // 上传的根地址
        },
        uploadParams: {
          title: "上传文件",
          limit: 1, //最大上传文件数
          accept: "", //上传文件类型
          acceptTxt: "",
          disabled: false,
          uploadUrl: "", //上传的地址
          emitMethod: "", //回调方法
          TMCode: "",
          dimension: []
        }
      };
    },
    mounted() {
      if (this.initByJs) {
        this.acceptData(this.updParams);
      }
    },
    methods: {
      //接受参数
      acceptData(infoParam) {
        this.initData();
        // 上传数据参数
        if (!infoParam.uploadUrl) {
          this.$m("CORE_CLIENT.E079"); //上传地址参数不能为空
          return;
        }
        if (infoParam.title) {
          this.uploadParams.title = infoParam.title;
        }
        if (infoParam.limit) {
          this.uploadParams.limit = infoParam.limit;
        }
        if (infoParam.accept) {
          this.uploadParams.accept = infoParam.accept;
          this.uploadParams.acceptTxt = this.$t("提示：仅允许导入") + this.uploadParams.accept + this.$t("格式文件！");
        }
        if (infoParam.acceptTxt) {
          this.uploadParams.acceptTxt = infoParam.acceptTxt;
        }
        this.uploadParams.uploadUrl = this.conParams.rootUrl + infoParam.uploadUrl;
        if (infoParam.TMCode) {
          this.uploadParams.TMCode = infoParam.TMCode;
        }
        if (infoParam.dimension) {
          this.uploadParams.dimension = infoParam.dimension;
        }
        this.dg.open = true;
      },
      // 提交上传文件
      submitForm() {
        this.$refs.upload.submit();
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.uploadParams.disabled = true;
      },
      // 文件上传成功
      handleFileSuccess(response, file, fileList) {
        this.uploadParams.disabled = false;
        if (response.code === 200) {
          this.$refs.upload.clearFiles();
          this.dg.retCode = "S";
          this.$message.success(response.msg);
          this.$emit("uploadSuccess", response);
        } else {
          const msg = response.msg.replaceAll("\n", "<br/>");
          this.$message.error({
            message: msg,
            dangerouslyUseHTMLString: true
          });
          this.$emit("uploadError", response);
        }
        this.dg.open = false;
      },
      // 文件上传失败
      handleFileError(err, file, fileList) {
        this.uploadParams.disabled = false;
        this.$m("CORE_CLIENT.E080"); //上传文件失败，请检查文件
        this.$emit("uploadError", err);
        this.dg.open = false;
      },
      //关闭
      handleCloseForm() {
        this.dg.open = false;
      },
      handleClose() {
        this.$refs.upload.clearFiles();
        this.$emit("closeDialog");
      },
      // 下载模板
      handleDownloadTM() {
        downloadTemplate(this.uploadParams.TMCode).then(response => {
          // 利用a标签自定义下载文件名
          const link = document.createElement("a");
          // 创建Blob对象，设置文件类型
          let blob = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
          });
          let objectUrl = URL.createObjectURL(blob); // 创建URL
          link.href = objectUrl;
          link.download = this.uploadParams.TMCode + "_" + this.szdDate.format(undefined, "YYYYMMDDHHmmssSSS"); // 自定义文件名
          link.click(); // 下载文件
          URL.revokeObjectURL(objectUrl); // 释放内存
          this.$m("CORE_CLIENT.S010"); //导出文件成功
        });
      },
      //初始化数据
      initData() {
        this.dg.retCode = "";
        this.uploadParams = {
          title: "上传文件",
          limit: 1, //最大上传文件数
          accept: "", //上传文件类型
          acceptTxt: "",
          disabled: false,
          uploadUrl: "", //上传的地址
          emitMethod: "", //回调方法
          TMCode: ""
        };
      },
      //上传前尺寸检查
      beforeUpload(file) {
        return new Promise((resolve, reject) => {
          if (!this.uploadParams.dimension || (Array.isArray(this.uploadParams.dimension) && this.uploadParams.dimension.length === 0)) {
            return resolve(true);
          }
          const fileReader = new FileReader();
          fileReader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const [width, height] = this.uploadParams.dimension;
              if (img.width !== width || img.height !== height) {
                this.$m("CORE_CLIENT.E016", [width, height]); //图片尺寸限制为 & * &
                return reject(false);
              }
              return resolve();
            };
          };
          fileReader.readAsDataURL(file);
        });
      }
    }
  };
</script>
