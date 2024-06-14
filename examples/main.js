import { createApp } from 'vue'
import App from './App.vue'
import JsonSchemaEditor from '../packages/index'
import { Modal } from 'ant-design-vue'

// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'

createApp(App).use(JsonSchemaEditor).use(Modal).mount('#app')
