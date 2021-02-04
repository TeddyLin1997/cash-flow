<template lang="pug">
.index
  el-table(:data="allDataList" show-summary :summary-method="summaryMethod" height="634px")
    el-table-column(label="日期" prop="date")
      template(v-slot="scope")
        span {{ scope.row.date }}
    el-table-column(label="項目" prop="name")
    el-table-column(label="類型" prop="moneyType" align="center")
    el-table-column(label="收支" prop="type" align="center")
      template(v-slot="scope")
        span(:class="typeColor(scope.row.type)") {{ scope.row.type }}
    el-table-column(label="金額" prop="money" align="right")
    el-table-column(label="操作" prop="operate" align="center")
      template(v-slot="scope")
        el-button(type="text" @click="deleteItem(scope.row)")
          i.el-icon-delete
  
  .form
    .title
      el-checkbox(v-model="isClear") 新增後清除
    .form-item
      label 日期
      el-date-picker(v-model="detailForm.date" size="small" placeholder="選擇日期")
    .form-item
      label 類型
      el-select(v-model="detailForm.moneyType" size="small" placeholder="請選擇")
        el-option(v-for="item of moneyTypeList" :value="item")
    .form-item
      label 收支
      el-select(v-model="detailForm.type" size="small" placeholder="請選擇")
        el-option(v-for="item of typeList" :value="item")
    .form-item
      label 項目
      el-input(v-model="detailForm.name" size="small" placeholder="請輸入" @keypress.enter="addItem(detailForm)")
    .form-item
      label 金額
      el-input(v-model="detailForm.money" type="number" placeholder="輸入金額" size="small" @keyup.enter="addItem(detailForm)")
    .form-button
      el-button(@click="addItem(detailForm)" type="primary" size="small") 新增
      label.upload 匯入
        input.display(type="file" @change="handleFile")
      el-button(@click="exportExcel" type="primary" size="small") 匯出
</template>

<script>
import { ElMessage } from 'element-plus'
import { ref, reactive, watchEffect, computed } from 'vue'
import useWorkBook from '@/workbook'
import { getToday } from '@/helper'
import { saveAs } from 'file-saver';
import dayjs from 'dayjs'
import XLSX from 'xlsx'

const typeList = ['收入', '支出']
const moneyTypeList = ['食', '衣', '住', '行', '娛樂', '其他']
const thead = {
  '日期': 'date',
  '項目': 'name',
  '類型': 'moneyType',
  '收支': 'type',
  '金額': 'money',
}

export default {
  name: 'App',

  setup () {
    // create workbook
    const workbook = useWorkBook()

    // reader
    const reader = new FileReader()
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'array' })
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      allDataList.value = convertExcel(data)
    }

    // import
    const file = ref(undefined)
    const handleFile = async (event) => {
      file.value = event.target.files[0]
      await reader.readAsArrayBuffer(file.value)
    }

    // export
    const exportData = computed(() => convertExcel(allDataList.value, 'out'))

    const exportExcel = () => {
      workbook.Sheets['sheet1'] = XLSX.utils.json_to_sheet(exportData.value, { header: Object.keys(thead), skipHeader: false })
      workbook.SheetNames = Object.keys(workbook.Sheets)
      const blob = new Blob([changeToBlob(workbook)])
      const file = new File([blob], 'workbook.xlsx')
      saveAs(file)
    }

    const changeToBlob = (workbook) => {
      const rawData = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' })
      const aryBuf = new ArrayBuffer(rawData.length)
      const view = new Uint8Array(aryBuf)
      for (var i = 0; i != rawData.length; ++i) view[i] = rawData.charCodeAt(i) & 0xFF
      return aryBuf
    }

    
    // data
    const allDataList = ref([])
    const detailForm = reactive({
      date: getToday(),
      name: '',
      moneyType: '食',
      type: '支出',
      money: '',
    })

    // add
    const addItem = (formData) => {
      if (Object.values(detailForm).includes('')) return ElMessage.warning('內容輸入不完整')
      const item = { ...formData }
      if (item.type === '支出') item.money = -item.money
      item.date = dayjs(item.date).format('YYYY/MM/DD')
      allDataList.value.push(item)
      clearDetailForm()
    }

    const deleteItem = (row) => {
      const targetIndex = allDataList.value.findIndex(item => item === row)
      allDataList.value.splice(targetIndex, 1)
    }

    // clear
    const isClear = ref(false)
    const clearDetailForm = () => {
      if (isClear.value) {
        detailForm.date = ''
        detailForm.name = ''
        detailForm.moneyType = ''
        detailForm.type = ''
        detailForm.money = ''
      }
    }

    // util
    const summaryMethod = ({ data }) => {
      let sunMoney = data.reduce((acc, curr) => acc + parseInt(curr.money, 10) , 0)
      return ['-', '-', '-', '-', sunMoney]
    }
    const typeColor = (value) => {
      return value === '收入' ? 'green' : 'red'
    }

    const convertExcel = (value, mode = 'in') => {
      if (mode === 'in') {
        return value.map(item => {
          const newItem = {}
          Object.keys(thead).forEach(key => { newItem[thead[key]] = item[key] })
          return newItem
        })
      } else if (mode === 'out') {
        return value.map(item => {
          const newItem = {}
          Object.keys(thead).forEach(key => { newItem[key] = item[thead[key]] })
          return newItem
        })
      }
    }

    return {
      isClear,

      file,
      handleFile,

      typeList,
      moneyTypeList,

      detailForm,
      allDataList,
      
      addItem,
      deleteItem,

      exportExcel,
      typeColor,
      summaryMethod,
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: left;
  height: 100vh;
  background-color: #edeef2;
}

.index {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.table {
  height: calc(100% - 146px);
  overflow: auto;
}

.form {
  margin: 0 auto;
  height: 146px;
  padding: 8px;
  color: #fff;
  background-color: #4c5560;
}

.form .title {
  padding-left: 8px;
}

label {
  font-size: 14px;
}

.form-item {
  margin: 0px 8px;
  display: inline-block;
  width: 220px;
}

.form-button {
  margin: 0px 8px;
  display: inline-flex;
  justify-content: space-between;
  width: 220px;
}

.upload {
  padding: 0px 12px;
  display: inline-block;
  width: fit-content;
  line-height: 32px;
  background-color: #409EFF;
  cursor: pointer;
  border-radius: 3px;
}

.display {
  display: none;
}

.green {
  color: #67C23A;
}

.red {
  color: #F56C6C;
}

.tip {
  padding: 0 12px;
}

.el-input {
  width: 220px;
}

.el-checkbox {
  color: #fff;
}
</style>
