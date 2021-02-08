import {
  ElCheckbox,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElTable,
  ElTableColumn,
  ElMessage,
} from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.component(ElCheckbox.name, ElCheckbox)
app.component(ElInput.name, ElInput)
app.component(ElSelect.name, ElSelect)
app.component(ElOption.name, ElOption)
app.component(ElDatePicker.name, ElDatePicker)
app.component(ElButton.name, ElButton)
app.component(ElTable.name, ElTable)
app.component(ElTableColumn.name, ElTableColumn)
app.component(ElMessage.name, ElMessage)

app.mount('#app')
