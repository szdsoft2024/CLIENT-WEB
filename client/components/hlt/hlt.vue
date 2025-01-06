<template>
  <div class="hils-wrapper">
    <pre v-highlightjs><code class="javascript">{{ _code }}</code></pre>
  </div>
</template>

<script setup>
  import { computed, defineProps } from "vue";
  import vkbeautify from "vkbeautify";
  import "highlight.js/styles/github.css";
  import hljs from "highlight.js";

  const props = defineProps({
    //显示代码
    code: {
      type: [String, Object],
      default: ""
    }
  });

  //自定义指令
  const vHighlightjs = {
    mounted(el, binding) {
      const codeNodes = el.querySelectorAll("code");
      for (let i = 0; i < codeNodes.length; i++) {
        const codeNode = codeNodes[i];
        if (typeof binding.value === "string") {
          codeNode.textContent = binding.value;
        }
        hljs.highlightBlock(codeNode);
      }
    }
  };

  //代码
  const _code = computed(() => {
    return formatCode(props.code);
  });

  //格式化代码
  const formatCode = code => {
    const sqlKey1 = /SELECT|UPDATE|DELETE|INSERT|CREATE|ALTER|DROP|TRUNCATE|RENAME/i;
    const sqlKey2 = /FROM/i;
    let res;
    try {
      if (JSON.parse(code)) {
        res = vkbeautify.json(code);
      } else if (code && code.startsWith("<\?xml")) {
        res = vkbeautify.xml(code);
      } else if (sqlKey1.test(code) && sqlKey2.test(code)) {
        res = vkbeautify.sql(code);
      } else {
        res = code;
      }
    } catch (err) {
      res = code;
    }
    return res;
  };
</script>

<style lang="scss">
  //.hljs {
  //  background: #f0f0f0;
  //}

  .hils-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #d8dce6;

    > pre {
      height: 100%;
      overflow: auto;
      margin: 0;
      word-break: keep-all;
      background: #f8f8f8;

      > code {
        overflow: visible;
      }
    }
  }
</style>
