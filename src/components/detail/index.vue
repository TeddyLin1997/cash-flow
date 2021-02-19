<template lang="pug">

div(class="flex flex-col justify-between items-center")
  //- table
  div(class="w-full text-center bg-secondary rounded-lg")
    header(class="py-2 px-4 h-12 flex justify-between items-center bg-active rounded-t-lg text-white")
      div(v-for="column of thead" :key="column.attr" :class="column.class") {{ column.label }}

    section(class="px-5 h-table overflow-auto text-gray")
      article(v-for="item of allDataList" class="relative h-14 flex justify-between items-center text-center border-primary border-b")
        i(@click="deleteItem(item)" class="el-icon-error absolute -left-3 cursor-pointer text-red hover:bg-white rounded-full")
        div(
          v-for="column of thead"
          :class="[column.class, typeColor(column.attr, item[column.attr])]"
        ) {{ item[column.attr] }}
  
  //- input
  div(class="w-full h-40 pb-2 px-4 flex text-gray justify-between bg-secondary rounded-lg text-sm")
    div(class="flex flex-col justify-evenly")
      div 日期
      el-date-picker(v-model="detailForm.date" size="small" placeholder="選擇日期")
      div 項目
      el-input(v-model="detailForm.name" size="small" placeholder="請輸入" @keypress.enter="addItem(detailForm)")
    div(class="flex flex-col justify-evenly")
      div 類型
      el-select(v-model="detailForm.moneyType" size="small" placeholder="請選擇")
        el-option(v-for="item of moneyTypeList" :value="item")
      div 金額
      el-input(v-model="detailForm.money" type="number" placeholder="輸入金額" size="small" @keyup.enter="addItem(detailForm)")
    div(class="flex flex-col justify-evenly")
      div 收支
      el-select(v-model="detailForm.type" size="small" placeholder="請選擇")
        el-option(v-for="item of typeList" :value="item")
      
      div 操作
      div
        el-button(@click="addItem(detailForm)" class="bg-active border-none focus:bg-active hover:bg-active" type="primary" size="small") 新增
        el-checkbox(v-model="isClear" class="ml-4 text-white") 新增後清除

</template>

<script>
import { ElMessage } from 'element-plus'
import { ref, reactive, watchEffect, computed, toRaw } from 'vue'
import operateData from './data'
import dayjs from 'dayjs'

const nowTime = new Date()
const typeList = ['收入', '支出']
const thead = [
{ label: '日期', attr: 'date', class: 'w-28' },
{ label: '項目', attr: 'name', class: 'w-28' },
{ label: '類型', attr: 'moneyType', class: 'w-10' },
{ label: '收支', attr: 'type', class: 'w-10' },
{ label: '金額', attr: 'money', class: 'pr-2 w-32 text-right font-bold' },
]
const moneyTypeList = ['食', '衣', '住', '行', '娛樂', '其他']

export default {
  name: 'detail',

  setup () {
    // data
    const allDataList = ref([])
    const detailForm = reactive({
      date: nowTime,
      name: '',
      moneyType: '食',
      type: '支出',
      money: '',
    })

    const readData = async () => { allDataList.value = await operateData.read() }
    readData()

    // operate
    const deleteItem = (row) => {
      const targetIndex = allDataList.value.findIndex(item => item === row)
      allDataList.value.splice(targetIndex, 1)
      operateData.write(allDataList.value)
    }

    const addItem = (formData) => {
      if (Object.values(detailForm).includes('')) return ElMessage.warning('內容輸入不完整')
      const item = { ...formData }
      if (item.type === '支出') item.money = -item.money
      item.date = dayjs(item.date).format('YYYY/MM/DD')
      allDataList.value.push(item)
      operateData.write(allDataList.value)
      clearDetailForm()
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
    const typeColor = (type, value) => {
      switch (type) {
        case 'type':
          const mapping = { '收入': 'text-green', '支出': 'text-red', }
          return mapping[value]
          break;
        case 'money':
          return value >= 0 ? 'text-green' : 'text-red'
        default:
          break;
      }
    }

    return {
      thead,

      isClear,

      typeList,
      moneyTypeList,

      detailForm,
      allDataList,
      
      // operator
      addItem,
      deleteItem,

      // other
      typeColor,
    }
  }
}
</script>

<style scoped>
.form-item {
  margin: 0px 8px;
}

.el-input {
  width: 180px;
}
</style>
