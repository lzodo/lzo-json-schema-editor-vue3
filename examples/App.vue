<template>
  <div id="app">
    <div class="container">
      <json-schema-editor class="schema" :value="tree" disabledType lang="zh_CN" custom />
      <pre class="code">{{ jsonStr }}</pre>
    </div>
  </div>
</template>

<script>
import GenerateSchema from 'generate-schema'
export default {
  name: 'App',
  computed: {
    jsonStr: {
      get: function () {
        return JSON.stringify(this.tree, null, 2)
      },
      set: function (newVal) {
        this.tree = JSON.parse(newVal)
      },
    },
  },
  data() {
    return {
      importJson: '',
      visible: false,
      tree: {
        // root: {
        //   type: 'Object',
        //   title: '根节点',
        //   require: false,
        //   properties: {
        //     name: {
        //       type: 'Object',
        //       title: '名称',
        //       require: false,
        //     },
        //     appId: {
        //       type: 'Integer',
        //       title: '应用ID',
        //       require: false,
        //     },
        //     credate: {
        //       type: 'String',
        //       title: '创建日期',
        //       format: 'date',
        //       require: false,
        //     },
        //   },
        //   // required: ['name', 'appId', 'credate'],
        // },

        body: {
          fielId: 'body',
          title: '出参根节点1',
          type: 'Object',
          require: false,
          properties: {
            msg: {
              fielId: 'msg',
              title: '1',
              type: 'String',
              require: false,
              properties: {},
            },
            rows: {
              fielId: 'rows',
              title: '2',
              type: 'Array',
              require: false,
              items: {},
            },
            total: {
              fielId: 'total',
              title: '3',
              type: 'String',
              require: false,
              properties: {},
            },
            code: {
              fielId: 'code',
              title: '4',
              type: 'String',
              require: false,
              properties: {},
            },
          },
        },
      },
    }
  },
  methods: {
    handleImportJson() {
      const t = GenerateSchema.json(JSON.parse(this.importJson))
      delete t.$schema
      this.tree.root = t
      this.visible = false
    },
  },
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.title {
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  height: 100px;
  line-height: 100px;
}
.desc {
  padding: 20px;
  width: 80vw;
  min-width: 800px;
  margin: auto;
  padding: 0 3em;
  font-size: 1.2em;
}
.container {
  display: flex;
  padding: 20px;
  width: 100%;
  min-width: 800px;
  justify-content: center;
  height: calc(100vh - 150px);
  margin: auto;
  flex-direction: column;
}
.container pre {
  font-family: monospace;
  height: 100%;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 12px;
  width: 100%;
}
.code-container {
  max-height: 600px;
  overflow: auto;
}
.schema {
  margin-left: 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
}
.CodeMirror {
  height: 100% !important;
}
.vue-codemirror {
  flex: 1;
  margin: 0 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-height: 300px;
  overflow: auto;
  border-radius: 6px;
}
</style>
