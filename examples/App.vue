<template>
  <div id="app">
    <div class="container">
      <json-schema-editor class="schema" :value="tree" disabledType lang="zh_CN" custom pmsType="flow" pmsPosition="req_body" :variableList="variableList" />
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
      variableList: [
        {
          propKey: '25',
          propName: '25',
          type: 'Object',
          objectStructure: [
            {
              propKey: 'body',
              propName: '出参根节点',
              type: 'Object',
              isRequired: 0,
              itemType: '',
              objectStructure: [
                {
                  propKey: 'code',
                  propName: '返回code值',
                  type: 'Integer',
                  isRequired: 0,
                  itemType: '',
                  objectStructure: [],
                  defaultValue: '33',
                },
                {
                  propKey: 'msg',
                  propName: '返回msg值',
                  type: 'String',
                  isRequired: 0,
                  disabled: true,
                  itemType: '',
                  objectStructure: [],
                  defaultValue: '33',
                },
                {
                  propKey: 'data',
                  propName: '返回data值',
                  type: 'Object',
                  isRequired: 0,
                  itemType: '',
                  objectStructure: [
                    {
                      propKey: 'userInfo',
                      propName: '返回用户信息',
                      type: 'String',
                      isRequired: 0,
                      itemType: '',
                      objectStructure: [],
                    },
                    {
                      propKey: 'token',
                      propName: '返回token值',
                      type: 'String',
                      isRequired: 0,
                      itemType: '',
                      objectStructure: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          propKey: 'STAET',
          propName: '开始节点',
          type: 'Object',
          objectStructure: [
            {
              propKey: '11',
              propName: '11',
              defaultValue: '',
              type: 'String',
              isRequired: true,
              itemType: '',
              objectStructure: [],
            },
            {
              propKey: '22',
              propName: '22',
              defaultValue: '',
              type: 'String',
              isRequired: true,
              itemType: '',
              objectStructure: [],
            },
            {
              propKey: '33',
              propName: '33',
              defaultValue: '',
              type: 'String',
              isRequired: false,
              itemType: '',
              objectStructure: [],
            },
          ],
        },
      ],
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
