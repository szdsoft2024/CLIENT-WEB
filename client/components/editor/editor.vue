<template>
  <div class="szdeditor-contanier szd__tb__wrapper" style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
      v-if="!hideBar"
      style="border-bottom: 1px solid #ccc; display: flex; justify-content: center; background: #fff"
      :editor="editor"
      :defaultConfig="toolbarConfig" />
    <!-- 编辑器 -->
    <Editor
      class="flex-1"
      style="overflow: hidden"
      :defaultConfig="editorConfig"
      v-model="html"
      @onChange="onChange"
      @onCreated="onCreated"
      :class="classObj" />
  </div>
</template>

<script>
  import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
  import { Boot, i18nChangeLanguage } from "@wangeditor/editor";
  import attachmentModule from "@wangeditor/plugin-upload-attachment";
  import szdStoreCookie from "../../common/store/storeCookie";

  // 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
  Boot.registerModule(attachmentModule);

  // class MyMenu {
  //   constructor() {
  //     this.title = "格式化</>";
  //     this.tag = "button";
  //   }
  //
  //   getValue(editor) {
  //     return "";
  //   }
  //
  //   exec(editor, value) {
  //     const config = editor.getMenuConfig("fmt");
  //     config.onClick(editor.getText());
  //   }
  // }
  //
  // const myMenuConf = {
  //   key: "fmt",
  //   factory() {
  //     return new MyMenu();
  //   }
  // };
  // Boot.registerMenu(myMenuConf);

  export default {
    components: { Editor, Toolbar },
    props: {
      content: {
        default: ""
      },
      hideBar: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: "请输入内容..."
      },
      excludeKeys: {
        type: Array,
        default: () => {
          return ["group-video"];
        }
      },
      toolbarKeys: {
        type: Array,
        default: () => {
          return [];
        }
      },
      uploadImgUrl: {
        type: String,
        default: ""
      },
      uploadAttachUrl: {
        type: String,
        default: ""
      },
      params: {
        type: Object,
        default: {}
      }
    },
    data() {
      const _this = this;
      return {
        editor: null,
        html: _this.content,
        toolbarConfig: {
          excludeKeys: _this.excludeKeys,
          // 插入哪些菜单
          insertKeys: {
            index: 24, // 自定义插入的位置
            keys: ["uploadAttachment"] // “上传附件”菜单
          }
        },
        editorConfig: {
          placeholder: "",
          // autoFocus: false,
          hoverbarKeys: {
            attachment: {
              menuKeys: ["downloadAttachment"] // “下载附件”菜单
            }
          },

          // 所有的菜单配置，都要在 MENU_CONF 属性下
          MENU_CONF: {
            // 服务端地址, 下载wangEditor服务端 https://github.com/wangeditor-team/server.git storeCookie
            uploadImage: {
              server: _this.uploadImgUrl,
              fieldName: "file",
              maxFileSize: 100 * 1024 * 1024, // 1M
              headers: { Authorization: "Bearer " + szdStoreCookie.getToken() },
              meta: _this.params
            },
            uploadAttachment: {
              server: _this.uploadAttachUrl, // 服务端地址
              timeout: 5 * 1000, // 5s
              fieldName: "file",
              metaWithUrl: true, // meta 拼接到 url 上
              headers: {
                Accept: "text/x-json",
                Authorization: "Bearer " + szdStoreCookie.getToken()
              },
              meta: _this.params,
              maxFileSize: 10 * 1024 * 1024, // 10M
              onBeforeUpload: file => {
                _this.editorConfig.MENU_CONF.uploadAttachment.fieldName = file.name;
                return file; // 上传 file 文件
              },
              onProgress: progress => {},
              onSuccess: (file, res) => {},
              onFailed: (file, res) => {
                alert(res.message);
              },
              onError: (file, err, res) => {
                alert(err.message);
                console.error("onError", file, err, res);
              },

              // 上传成功后，用户自定义插入文件
              customInsert: (res, file, insertFn) => {
                const url = res.data.url;
                if (!url) throw new Error(`url is empty`);
                // 插入附件到编辑器
                insertFn(`${file.name}`, url);
              },

              // 插入到编辑器后的回调
              onInsertedAttachment(elem) {}
            }
            // fmt: {
            //   onClick: text => {}
            // }
          }
        },
        classObj: {
          "w-e-full-screen-styles": false
        }
      };
    },
    watch: {
      content(val) {
        this.html = val;
      }
    },

    created() {
      this.editorConfig.placeholder = this.placeholder;
    },
    mounted() {
      this.selectLang();
      if (this.toolbarKeys.length > 0) {
        this.toolbarConfig.toolbarKeys = this.toolbarKeys;
      }
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错

        this.editor.on("fullScreen", () => {
          this.classObj["w-e-full-screen-styles"] = true;
        });
        this.editor.on("unFullScreen", () => {
          this.classObj["w-e-full-screen-styles"] = false;
        });
      },
      onChange(editor) {
        // 兼容写法
        this.$emit("contentHtmlUpdate", editor.getHtml());
        this.$emit("contentTextUpdate", editor.getText());
      },
      getEditorText() {
        const editor = this.editor;
        if (editor == null) return;
      },
      printEditorHtml() {
        const editor = this.editor;
        if (editor == null) return;
      },
      handleHlt() {
        const result = hljs.highlightAuto(this.code);
        return result;
      },
      selectLang() {
        const localLang = localStorage.getItem("szdLangMd5");
        if (localLang) {
          const lang = localLang.split("_")[1];
          // wangeditor 只有中英文语言
          if (["zh-CN", "en"].includes(lang)) {
            i18nChangeLanguage(lang);
          }
        }
      }
    },
    beforeDestroy() {
      const editor = this.editor;
      if (editor == null) return;
      editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    }
  };
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="scss">
  .szdeditor-contanier {
    height: 100%;
    overflow: hidden;

    .szdfull-screen {
      background-color: rgb(245, 245, 245);
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: #fff;
    }

    ::-webkit-scrollbar-thumb {
      background: #eee;
    }
  }

  .w-e-full-screen-container {
    z-index: 10;

    .w-e-bar {
      .w-e-bar-item {
        .w-e-bar-item-menus-container {
          z-index: 15;
        }

        .w-e-menu-tooltip-v5 {
          &::before {
            z-index: 15;
          }

          &::after {
            z-index: 15;
          }
        }

        .w-e-drop-panel {
          z-index: 100;
        }

        .w-e-select-list {
          z-index: 15;
        }
      }
    }
  }

  .w-e-full-screen-styles {
    z-index: 10;
    background-color: rgb(245, 245, 245);

    .w-e-text-container {
      width: 50%;
      margin-left: 25%;
      box-shadow: 0 2px 10px #ccc;
      margin-top: 30px;
      max-height: 95%;
      padding-bottom: 30px;

      .w-e-scroll {
        padding: 20px 40px;
      }
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background: #fff;
    }

    ::-webkit-scrollbar-thumb {
      background: #eee;
    }
  }
</style>
