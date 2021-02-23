<template lang="pug">

div(class="flex flex-col justify-between items-center")
  //- table
  div(class="w-full text-center bg-secondary rounded-lg")
    header(class="py-2 px-4 h-12 flex justify-between items-center bg-active rounded-t-lg text-white")
      div(v-for="column of thead" :key="column.attr" :class="column.class") {{ column.label }}

    section(class="px-5 h-table overflow-auto text-gray")
      article(v-for="item of sortableData" class="relative h-14 flex justify-between items-center text-center border-primary border-b")
        i(@click="operateStore.delete(item)" class="el-icon-error absolute -left-3 cursor-pointer text-red hover:bg-white rounded-full")
        div(
          v-for="column of thead"
          :class="[column.class, typeColor(column.attr, item[column.attr])]"
        ) {{ column.attr === 'money' ? comma(item[column.attr]) : item[column.attr] }}
  
  //- input
  div(class="w-full h-40 pb-2 px-4 flex flex-wrap items-center text-gray bg-secondary rounded-lg text-sm")
    div(class="mr-6")
      div 日期
      el-date-picker(v-model="detailForm.date" size="small" placeholder="選擇日期")
    
    div(class="mr-6")
      div 收支
      el-select(v-model="detailForm.type" @change="handleType" size="small" placeholder="請選擇")
        el-option(v-for="item of typeList" :value="item")

    div(class="mr-6")
      div 類型
      el-select(v-model="detailForm.category" size="small" placeholder="請選擇")
        el-option(v-for="item of categoryList" :value="item")

    div(class="mr-16")
      div 項目
      el-input(v-model="detailForm.name" ref="inputElement" size="small" placeholder="請輸入")

    div(class="mr-6")
      div 金額
      el-input(v-model="detailForm.money" type="number" placeholder="輸入金額" size="small" @keyup.enter="addItem(detailForm)")

    div   
      div 操作
      el-button(@click="addItem(detailForm)" class="bg-active border-none focus:bg-active focus:outline-none hover:bg-active" type="primary" size="small") 新增
      el-button(@click="operateStore.export()" class="bg-active border-none focus:bg-active focus:outline-none hover:bg-active" type="primary" size="small") 匯出Excel

</template>

<script>
import { ElMessage } from 'element-plus'
import { ref, reactive, watchEffect, computed, toRaw } from 'vue'
import { thead, typeList, allDataList, operateStore, assets } from '@/store'
import { comma } from '@/helper'

export default {
  name: 'detail',

  setup () {
    // data
    const nowTime = new Date()
    const detailForm = reactive({
      date: nowTime,
      name: '',
      category: '食',
      type: typeList[1],
      money: '',
    })

    const sortableData = computed(() => {
      return allDataList.value.sort((a, b) => a.timeStamp - b.timeStamp )
    })

    const categoryList = computed(() => {
      const payCategory = ['食', '衣', '住', '行', '娛樂', '其他']
      const incomeCategory = ['薪資', '投資', '其他']
      return detailForm.type === typeList[0] ? incomeCategory : payCategory
    })

    // operate
    const addItem = (formData) => {
      if (Object.values(formData).includes('')) return ElMessage.warning('內容輸入不完整')

      operateStore.add(formData)
      clearDetailForm()
    }

    // clear
    const inputElement = ref(null)
    const clearDetailForm = () => {
      detailForm.name = ''
      detailForm.money = ''
      inputElement.value.focus()
    }

    const handleType = () => {
      detailForm.category = categoryList.value[0]
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
      // default list
      thead,
      typeList,
      categoryList,

      inputElement,

      detailForm,
      sortableData,
      
      // operator
      addItem,
      operateStore,

      handleType,

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
