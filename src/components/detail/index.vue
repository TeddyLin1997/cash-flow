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
        ) {{ column.attr === 'money' ? comma(item[column.attr]) : item[column.attr] }}
  
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
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { ref, reactive, watchEffect, computed, toRaw } from 'vue'
import { typeList, allDataList, operateData, assets } from '@/data'
import { comma } from '@/helper'

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
    const nowTime = new Date()
    const detailForm = reactive({
      date: nowTime,
      name: '',
      moneyType: '食',
      type: typeList[1],
      money: '',
    })

    // operate
    const deleteItem = (row) => {
      operateData.delete(row)
    }

    const addItem = (formData) => {
      if (Object.values(formData).includes('')) return ElMessage.warning('內容輸入不完整')

      operateData.add(formData)
      clearDetailForm()
    }

    // clear
    const isClear = ref(false)
    const clearDetailForm = () => {
      if (!isClear.value) return
      detailForm.date = ''
      detailForm.name = ''
      detailForm.moneyType = ''
      detailForm.type = ''
      detailForm.money = ''
    }

    // util
    const typeColor = (type, value) => {
      switch (type) {
        case 'type':
          const mapping = { [typeList[0]]: 'text-green', [typeList[1]]: 'text-red', }
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
      comma,
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
