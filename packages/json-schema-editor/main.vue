<template>
  <div class="json-schema-editor" :class="{ root }">
    <div class="row header" v-if="root">
      <div class="col" style="flex: none; width: 300px"><span style="color: red">*</span>属性名</div>
      <div class="col" style="flex: none; width: 200px"><span style="color: red">*</span>属性含义</div>
      <div class="col" style="flex: none; width: 120px"><span style="color: red">*</span>是否必填</div>
      <div class="col" style="flex: none; width: 120px" v-if="isApiConfig || isDebug || isFlowEnd"><span style="color: red">*</span>类型</div>
      <div class="col" style="flex: none; width: 200px" v-if="(isApiConfig || isDebug) && !hideDefaultValue">{{ isApiConfig ? '默认值' : '参数值' }}</div>
      <div class="col" style="flex: none; width: 250px" v-if="(isFlow && !isResBody) || isFlowEnd">取值</div>
      <div class="col" style="flex: none; width: 60px" v-if="isFlow && isResBody">存入参</div>
      <!-- <div class="col">参数示例</div>
      <div class="col">备注</div> -->
      <div class="col left" style="flex: none; width: 90px" v-if="isApiConfig || isFlowEnd">操作</div>
    </div>

    <a-form ref="ruleForm" class="row" :model="pickValue">
      <!-- 名称  -->
      <div class="ant-col-name col" style="flex: none; width: 300px">
        <div :style="{ marginLeft: `${20 * deep}px` }" class="ant-col-name-c">
          <a-button v-if="pickValue.type === 'Object'" type="link" style="color: rgba(0, 0, 0, 0.65)" @click="hidden = !hidden">
            <template #icon>
              <caret-right-outlined v-if="hidden" />
              <caret-down-outlined v-else />
            </template>
          </a-button>
          <span v-else style="width: 32px; display: inline-block"></span>
          <a-form-item name="fielId" :rules="[{ required: true, message: '请输入名称' }]">
            <a-input
              :disabled="disabled || root || isDebug || isFlow"
              v-model:value="pickValue.fielId"
              :default-value="pickKey"
              class="ant-col-name-input"
              @blur="onInputName"
              :key="pickValue"
            />
          </a-form-item>
        </div>
      </div>
      <!-- 含义 字段标题 -->
      <div class="col" :span="6" style="flex: none; width: 200px">
        <a-form-item name="title" :rules="[{ required: true, message: '请输入含义' }]">
          <a-input
            v-model:value="pickValue.title"
            class="ant-col-title"
            :placeholder="local['title']"
            :disabled="disabledType || isDebug || isFlow || isFlow"
          />
        </a-form-item>
      </div>

      <!-- 是否必填 -->
      <div class="col required" style="flex: none; width: 120px">
        <!-- 提取到外面 -->
        <!-- <a-tooltip v-if="root">
          <template v-slot:title>{{ local['checked_all'] }}</template>
          <a-checkbox :disabled="!isObject && !isArray" class="ant-col-name-required" @change="onRootCheck" />
        </a-tooltip>
        <a-tooltip v-else>
          <template v-slot:title>{{ local['required'] }}</template>
          <a-checkbox :disabled="isItem" :checked="checked" class="ant-col-name-required" @change="onCheck" />
        </a-tooltip> -->
        <!-- 不提取到外面 -->

        <a-select
          v-model:value="pickValue.require"
          :disabled="disabledType || isDebug || isFlow"
          class="ant-col-type"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body
            }
          "
        >
          <a-select-option :key="t.key" :value="t.value" v-for="t in requiredMap">
            {{ t.key }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 数据类型 -->
      <div class="col" style="flex: none; width: 120px" v-if="isApiConfig || isDebug || isFlowEnd">
        <a-select
          v-model:value="pickValue.type"
          :disabled="disabledType || isDebug || isFlow"
          class="ant-col-type"
          @change="onChangeType"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body
            }
          "
        >
          <a-select-option :key="t" v-for="t in TYPE_NAME">
            {{ t }}
          </a-select-option>
        </a-select>
      </div>

      <!-- 取值规则 -->
      <div class="col" :span="6" style="flex: none; width: 250px" v-if="(isFlow && !isResBody) || isFlowEnd">
        <!-- <a-input v-model:value="pickValue.defaultValue" class="ant-col-title" :placeholder="local['defaultValue']" :disabled="disabledType" /> -->
        <a-cascader
          change-on-select
          :disabled="disabledType"
          style="width: 100%"
          v-model:value="pickValue.ruleResPath"
          :options="variableList"
          placeholder="请选择"
          :show-search="{ filter }"
          :fieldNames="{ label: 'propName', value: 'propKey', children: 'objectStructure' }"
          @change="(data) => changeCascader(data, pickValue)"
        />
      </div>

      <!-- 默认值 -->
      <div class="col" :span="6" style="flex: none; width: 200px" v-if="(isApiConfig || isDebug) && !hideDefaultValue">
        <!-- <a-input
          v-model:value="pickValue.defaultValue"
          class="ant-col-title"
          :placeholder="local['defaultValue']"
          :disabled="disabledType || ['Object', 'List', 'Array'].includes(pickValue.type)"
        /> -->
        <!-- :disabled="disabledType || ['Object', 'List', 'Array'].includes(pickValue.type)" -->

        <template v-if="pickValue.type === 'Long'">
          <a-input-number
            v-model:value="pickValue.defaultValue"
            :min="-9223372036854775808"
            :max="9223372036854775807"
            string-mode
            class="ant-col-title"
            :placeholder="local['defaultValue']"
            style="width: 100%"
          />
        </template>
        <template v-else-if="pickValue.type === 'Integer'">
          <a-input-number
            v-model:value="pickValue.defaultValue"
            :min="-2147483648"
            :max="2147483647"
            string-mode
            class="ant-col-title"
            :placeholder="local['defaultValue']"
            style="width: 100%"
          />
        </template>
        <template v-else-if="pickValue.type === 'Date' || pickValue.type === 'DateTime'">
          <a-date-picker
            :locale="locale"
            style="width: 100%"
            v-model:value="pickValue.defaultValue"
            :value-format="pickValue.type === 'Date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
            :show-time="pickValue.type === 'Date' ? false : { format: 'HH:mm:ss' }"
          />
        </template>
        <template v-else-if="pickValue.type === 'Boolean'">
          <a-switch
            v-model:checked="pickValue.defaultValue"
            :checkedValue="true"
            :unCheckedValue="false"
            class="ant-col-title"
            :placeholder="local['defaultValue']"
          />
        </template>
        <template v-else>
          <a-input
            v-model:value="pickValue.defaultValue"
            class="ant-col-title"
            :placeholder="local['defaultValue']"
            :disabled="disabledType || ['Object', 'List', 'Array'].includes(pickValue.type)"
          />
        </template>
      </div>

      <!-- 是否存为入参 -->
      <div class="col" v-if="isFlow && isResBody" style="flex: none; width: 60px">
        <a-tooltip>
          <template v-slot:title>是否存为后续接口入参{{ isResBody }}</template>
          <a-checkbox v-model:checked="pickValue.isSaveNext" class="ant-col-name-required" />
        </a-tooltip>
      </div>

      <!-- 图标 -->
      <div :span="6" class="ant-col-setting col left" style="flex: none; width: 90px" v-if="isApiConfig || isFlowEnd">
        <!-- <a-tooltip> -->
        <!-- <template v-slot:title>{{ local['preview'] }}</template> -->
        <!-- <a-button type="link" class="setting-icon" @click="onSetting"> -->
        <!-- <template #icon><setting-outlined /></template> -->
        <!-- <template #icon><eye-outlined /></template> -->
        <!-- </a-button> -->
        <!-- </a-tooltip> -->
        <a-tooltip v-if="isObject">
          <template v-slot:title>{{ local['add_child_node'] }}</template>
          <a-button type="link" class="plus-icon" @click="addChild">
            <template #icon><plus-outlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip v-if="!root && !isItem">
          <template v-slot:title>{{ local['remove_node'] }}</template>
          <a-button type="link" class="close-icon ant-btn-icon-only" @click="removeNode">
            <template #icon><delete-outlined /></template>
          </a-button>
        </a-tooltip>
      </div>
    </a-form>

    <template v-if="!hidden && pickValue.properties && !isArray">
      <json-schema-editor
        v-for="(item, key, index) in pickValue.properties"
        :value="{ [key]: item }"
        :parent="pickValue"
        :key="index"
        :deep="deep + 1"
        :root="false"
        class="children"
        :lang="lang"
        :custom="custom"
        :pmsType="pmsType"
        :pmsPosition="pmsPosition"
        :variableList="variableList"
        :hideDefaultValue="hideDefaultValue"
      />
    </template>
    <template v-if="isArray">
      <json-schema-editor
        :value="{ items: pickValue.items }"
        :deep="deep + 1"
        disabled
        isItem
        :root="false"
        class="children"
        :lang="lang"
        :custom="custom"
        :pmsType="pmsType"
        :pmsPosition="pmsPosition"
        :variableList="variableList"
        :hideDefaultValue="hideDefaultValue"
      />
    </template>
    <!-- <a-button type="primary" v-if="root" @click="verification">验证</a-button> -->
    <!-- <a-button type="primary" html-type="submit" @click="onFinish">Search</a-button> -->
    <a-modal
      v-model:visible="modalVisible"
      v-if="modalVisible"
      :title="local['preview']"
      :maskClosable="false"
      :okText="local['ok']"
      :cancelText="local['cancel']"
      width="800px"
      @ok="handleOk"
      wrapClassName="json-schema-editor-advanced-modal"
    >
      <!-- 弹窗基本信息设置 -->
      <!-- <h3>{{ local['base_setting'] }}</h3>
      <a-form :model="advancedValue" class="ant-advanced-search-form">
        <a-row :gutter="6">
          <a-col :span="8" v-for="(item, key) in advancedValue" :key="key">
            <a-form-item>
              <span>{{ local[key] }}</span>
              <a-input-number
                v-model:value="advancedValue[key]"
                v-if="advancedAttr[key].type === 'integer' || advancedAttr[key].type === 'number'"
                style="width: 100%"
                :placeholder="key"
              />
              <span v-else-if="advancedAttr[key].type === 'boolean'" style="display: inline-block; width: 100%">
                <a-switch v-model:checked="advancedValue[key]" />
              </span>
              <a-textarea @blur="changeEnumValue" :default-value="enumText" :rows="2" v-else-if="key === 'enum'" :placeholder="local['enum_msg']"></a-textarea>
              <a-select
                v-else-if="advancedAttr[key].type === 'array'"
                v-model:value="advancedValue[key]"
                style="width: 100%"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode || document.body
                  }
                "
                :placeholder="local[key]"
              >
                <a-select-option value="">{{ local['nothing'] }}</a-select-option>
                <a-select-option :key="t" v-for="t in advancedAttr[key].enums">
                  {{ t }}
                </a-select-option>
              </a-select>
              <a-input v-model:value="advancedValue[key]" v-else style="width: 100%" :placeholder="key" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form> -->
      <!-- 自定义属性  -->
      <!-- <h3 v-show="custom">{{ local['add_custom'] }}</h3>
      <a-form class="ant-advanced-search-form" v-show="custom">
        <a-row :gutter="6">
          <a-col :span="8" v-for="item in customProps" :key="item.key">
            <a-form-item :label="item.key">
              <a-input v-model:value="item.value" style="width: calc(100% - 30px)" />
              <a-button type="link" @click="removeCustomNode(item.key)" style="width: 30px">
                <template #icon><close-outlined /></template>
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="addProp.key != undefined">
            <a-form-item>
              <template #label><a-input v-model:value="addProp.key" style="width: 100px" /></template>
              <a-input v-model:value="addProp.value" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="link" @click="confirmAddCustomNode(null)" v-if="customing">
                <template #icon><check-outlined /></template>
              </a-button>
              <a-tooltip :title="local['add_custom']" v-else>
                <a-button type="link" @click="addCustomNode">
                  <template #icon><plus-outlined /></template>
                </a-button>
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form> -->
      <!-- <h3>{{ local['preview'] }}</h3> -->
      <pre style="width: 100%">{{ completeNodeValue }}</pre>
    </a-modal>
  </div>
</template>
<script>
import { isNull, renamePropertyAndKeepKeyPrecedence } from './util'
import { TYPE_NAME } from './type/type'
import { Row, Col, Button, Input, InputNumber, Icon, Checkbox, Select, Tooltip, Modal, Form, Switch, Cascader, DatePicker } from 'ant-design-vue'
import {
  CaretRightOutlined,
  CaretDownOutlined,
  SettingOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import LocalProvider from './LocalProvider'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default {
  name: 'JsonSchemaEditor',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    // eslint-disable-next-line vue/no-unused-components
    AIcon: Icon,
    AInput: Input,
    AInputNumber: InputNumber,
    ATextarea: Input.TextArea,
    ACheckbox: Checkbox,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATooltip: Tooltip,
    AModal: Modal,
    AForm: Form,
    AFormItem: Form.Item,
    ASwitch: Switch,
    ACascader: Cascader,
    ADatePicker: DatePicker,
    CaretRightOutlined,
    CaretDownOutlined,
    SettingOutlined,
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    CheckOutlined,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    disabled: {
      //name不可编辑，根节点name不可编辑,数组元素name不可编辑
      type: Boolean,
      default: false,
    },
    disabledType: {
      //禁用类型选择
      type: Boolean,
      default: false,
    },
    isItem: {
      //是否数组元素
      type: Boolean,
      default: false,
    },
    deep: {
      // 节点深度，根节点deep=0
      type: Number,
      default: 0,
    },
    root: {
      //是否root节点
      type: Boolean,
      default: true,
    },
    parent: {
      //父节点
      type: Object,
      default: null,
    },
    custom: {
      //enable custom properties
      type: Boolean,
      default: false,
    },
    lang: {
      // i18n language
      type: String,
      default: 'zh_CN',
    },
    // 使用场景
    pmsType: {
      type: String,
      default: 'api_config', // api_config debug
    },
    pmsPosition: {
      type: String,
      default: 'res_body', // 使用位置 req_body/res_body
    },
    variableList: {
      type: Array,
      default: () => [],
    },
    hideDefaultValue: {
      // 是否隐藏默认值
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isApiConfig: (v) => v.pmsType == 'api_config',
    isDebug: (v) => v.pmsType == 'debug',
    isFlow: (v) => v.pmsType == 'flow',
    isResBody: (v) => v.pmsPosition == 'res_body',
    isFlowEnd: (v) => v.pmsType == 'flowEnd',
    pickValue() {
      let pack = Object.values(this.value)[0]
      pack.fielId = Object.keys(this.value)[0]
      pack.disabled = !pack.isSaveNext

      return pack
    },
    pickKey() {
      return Object.keys(this.value)[0]
    },
    isObject() {
      return this.pickValue.type === 'Object'
    },
    isArray() {
      return this.pickValue.type === 'List'
    },
    checked() {
      return this.parent && this.parent.required && this.parent.required.indexOf(this.pickKey) >= 0
    },
    // advanced() {
    //   return TYPE[this.pickValue.type]
    // },
    // advancedAttr() {
    //   return TYPE[this.pickValue.type].attr
    // },
    ownProps() {
      return ['type', 'title', 'properties', 'items', 'required']
    },
    advancedNotEmptyValue() {
      const jsonNode = Object.assign({}, this.advancedValue)
      for (let key in jsonNode) {
        isNull(jsonNode[key]) && delete jsonNode[key]
      }
      return jsonNode
    },
    completeNodeValue() {
      const t = {}
      const basicValue = { ...this.pickValue }
      for (const item of this.customProps) {
        t[item.key] = item.value
      }
      this._pickDiffKey().forEach((key) => delete basicValue[key])
      return Object.assign({}, basicValue, t, this.advancedNotEmptyValue)
    },
    enumText() {
      const t = this.advancedValue['enum']
      if (!t) return ''
      if (!t.length) return ''
      return t.join('\n')
    },
  },
  data() {
    return {
      locale,
      TYPE_NAME,
      hidden: false,
      countAdd: 1,
      modalVisible: false,
      advancedValue: {},
      addProp: {}, // 自定义属性
      customProps: [],
      customing: false,
      local: LocalProvider(this.lang),
      requiredMap: [
        {
          key: '是',
          value: true,
        },
        {
          key: '否',
          value: false,
        },
      ],
      rules: {
        fielId: [
          {
            required: true,
            message: '请输入属性',
            type: 'string',
          },
        ],
        title: [
          {
            required: true,
            message: '请输入名称',
            type: 'string',
          },
        ],
      },
    }
  },
  methods: {
    changeCascader(data, param) {
      // 不能只选开始节点参数位置和api节点参数位置
      if (data.length < 3) {
        param.ruleResPath = []
      }
    },
    filter(inputValue, path) {
      return path.some((option) => option.propName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    onFinish() {
      // console.log(this.$refs.ruleForm, 889990)
      // this.$refs.ruleForm.validate().then(() => {
      //   console.log('values')
      // })
    },
    onInputName(e) {
      const oldKey = this.pickKey
      const newKey = e.target.value

      if (oldKey === newKey) return

      // const nodeValue = this.parent.properties[oldKey]

      // 替换key名
      // delete this.parent.properties[oldKey]
      // eslint-disable-next-line vue/no-mutating-props
      // this.parent.properties[newKey] = nodeValue
      renamePropertyAndKeepKeyPrecedence(this.parent.properties, [oldKey, newKey])

      // required重新设置
      const requireds = this.parent.required || []
      const oldIndex = requireds.indexOf(oldKey)
      if (requireds.length > 0 && oldIndex > -1) {
        requireds.splice(oldIndex, 1)
        requireds.push(newKey)
        // eslint-disable-next-line vue/no-mutating-props
        this.parent['required'] = [...new Set(requireds)]
      }
    },
    onChangeType() {
      this.pickValue.defaultValue = ''

      // this.parseCustomProps()
      // 删除自定义属性
      this.customProps.forEach((item) => {
        // 框架设定全部三次，自己自定义的这个连个不能删
        if (!['require', 'fielId'].includes(item.key)) {
          delete this.pickValue[item.key]
        }
      })
      this.customProps = []

      delete this.pickValue['properties']
      delete this.pickValue['items']
      delete this.pickValue['required']
      delete this.pickValue['format']
      delete this.pickValue['enum']

      if (this.isArray) {
        this.pickValue['items'] = { type: 'Object', title: '列表', require: false }
      }
    },
    onCheck(e) {
      this._checked(e.target.checked, this.parent)
    },
    onRootCheck(e) {
      this._deepCheck(e.target.checked, this.pickValue)
    },
    changeEnumValue(e) {
      const pickType = this.pickValue.type
      const value = e.target.value
      var arr = value.split('\n')

      if (pickType === 'String') {
        this.advancedValue.enum = arr.map((item) => item)
      } else {
        if (arr.length === 0 || (arr.length === 1 && arr[0] == '')) {
          this.advancedValue.enum = null
        } else {
          this.advancedValue.enum = arr.map((item) => +item)
        }
      }
    },
    _deepCheck(checked, node) {
      if (node.type === 'Object' && node.properties) {
        checked ? (node['required'] = Object.keys(node.properties)) : delete node['required']
        Object.keys(node.properties).forEach((key) => this._deepCheck(checked, node.properties[key]))
      } else if (node.type === 'List' && node.items.type === 'Object') {
        checked ? (node.items['required'] = Object.keys(node.items.properties)) : delete node.items['required']
        Object.keys(node.items.properties).forEach((key) => this._deepCheck(checked, node.items.properties[key]))
      }
    },
    _checked(checked, parent) {
      let required = parent.required
      if (checked) {
        // eslint-disable-next-line vue/no-mutating-props
        required || (this.parent['required'] = [])

        required = this.parent.required
        required.indexOf(this.pickKey) === -1 && required.push(this.pickKey)
      } else {
        const pos = required.indexOf(this.pickKey)
        pos >= 0 && required.splice(pos, 1)
      }
      required.length === 0 && delete parent['required']
    },
    addChild() {
      const name = this._joinName()
      const type = 'String'
      const node = this.pickValue
      node.properties || (node['properties'] = {}) // this.$set(node,'properties',{})
      const props = node.properties
      props[name] = { type: type, require: true, isSaveNext: true } //this.$set(props,name,{type: type})
    },
    // parseCustomProps() {
    //   const ownProps = this.ownProps
    //   Object.keys(this.pickValue).forEach((key) => {
    //     if (ownProps.indexOf(key) === -1) {
    //       this.confirmAddCustomNode({ key: key, value: this.pickValue[key] })
    //       // this.$delete(this.pickValue,key)
    //     }
    //   })
    // },
    addCustomNode() {
      // this.$set(this.addProp,'key',this._joinName())
      // this.$set(this.addProp,'value','')
      this.addProp['key'] = this._joinName()
      this.addProp['value'] = ''
      this.customing = true
    },
    removeCustomNode(key) {
      this.customProps.forEach((item, index) => {
        if (item.key === key) {
          this.customProps.splice(index, 1)
          return
        }
      })
    },
    confirmAddCustomNode(prop) {
      const p = prop || this.addProp
      let existKey = false
      this.customProps.forEach((item) => {
        if (item.key === p.key) {
          existKey = true
        }
      })
      if (existKey) return
      this.customProps.push(p)
      this.addProp = {}
      this.customing = false
    },
    removeNode() {
      const { properties, required } = this.parent
      delete properties[this.pickKey]
      if (required) {
        const pos = required.indexOf(this.pickKey)
        pos >= 0 && required.splice(pos, 1)
        required.length === 0 && delete this.parent['required']
      }
    },
    _joinName() {
      return `field_${this.deep}_${this.countAdd++}`
    },
    onSetting() {
      this.modalVisible = true
      // this.advancedValue = { ...this.advanced.value }
      // for (const k in this.advancedValue) {
      //   if (this.pickValue[k]) {
      //     this.advancedValue[k] = this.pickValue[k]
      //   }
      // }
      // this.parseCustomProps()
    },

    handleOk() {
      this.modalVisible = false
      for (const key in this.advancedValue) {
        if (isNull(this.advancedValue[key])) {
          delete this.pickValue[key]
        } else {
          this.pickValue[key] = this.advancedValue[key]
        }
      }
      const diffKey = this._pickDiffKey()
      diffKey.forEach((key) => delete this.pickValue[key])
      for (const item of this.customProps) {
        this.pickValue[item.key] = item.value
      }
    },
    _pickDiffKey() {
      const keys = Object.keys(this.pickValue)
      return keys.filter((item) => this.ownProps.indexOf(item) === -1)
    },
  },
}
</script>
<style scoped>
.json-schema-editor.root {
  border: 1px solid #f2f2f2;
  padding: 0;
  width: auto;
  float: left;
}
.json-schema-editor .row {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  /* margin: 12px; */
}
.json-schema-editor .row.header {
  background-color: #f2f2f2;
  height: 35px;
  line-height: 35px;
}
.json-schema-editor .row .col {
  padding: 0 8px;
  flex: 1;
  text-align: center;
  /* margin: 12px; */
}
.json-schema-editor .row .col.left {
  text-align: left;
}
.json-schema-editor .row .col.left.handler {
  padding-left: 30px;
}

.json-schema-editor .row .ant-col-name {
  display: flex;
  align-items: center;
}
.json-schema-editor .row .ant-col-name .ant-col-name-c {
  display: flex;
  align-items: center;
  width: 100% !important;
}
.json-schema-editor .row .ant-col-name .ant-col-name-required {
  flex: 0 0 24px;
  text-align: center;
  padding-left: 5px;
}
.json-schema-editor .row .ant-col-type {
  width: 100%;
}
.json-schema-editor .row .ant-col-setting {
  display: inline-block;
}
.json-schema-editor .row .setting-icon {
  color: rgba(0, 0, 0, 0.45);
  border: none;
}
.json-schema-editor .row .plus-icon {
  border: none;
}
.json-schema-editor .row .close-icon {
  color: #888;
  border: none;
}
</style>
<style>
.json-schema-editor-advanced-modal {
  color: rgba(0, 0, 0, 0.65);
  min-width: 600px;
}
.json-schema-editor-advanced-modal pre {
  font-family: monospace;
  height: 100%;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 12px;
  width: 50%;
}
.json-schema-editor-advanced-modal h3 {
  display: block;
  border-left: 3px solid #1890ff;
  padding: 0 8px;
}
.json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item {
  display: flex;
}
.json-schema-editor-advanced-modal .ant-advanced-search-form .ant-form-item .ant-form-item-control-wrapper {
  flex: 1;
}

.json-schema-editor .ant-form-item {
  margin-bottom: 0 !important;
}
.json-schema-editor .ant-form-item-explain.ant-form-item-explain-connected {
  position: absolute;
  left: 4px;
  top: 100%;
}
.json-schema-editor .ant-form-item {
  width: 100%;
}
</style>
