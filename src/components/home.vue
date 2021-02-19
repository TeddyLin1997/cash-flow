<template lang="pug">
.index
  el-table(:data="allDataList" show-summary :summary-method="summaryMethod" height="634px")
    el-table-column(label="" prop="operate" align="center" width="40")
      template(v-slot="scope")
        el-button(type="text" @click="deleteItem(scope.row)")
          i.el-icon-close
    el-table-column(label="日期" prop="date")
      template(v-slot="scope")
        span {{ scope.row.date }}
    el-table-column(label="項目" prop="name")
    el-table-column(label="類型" prop="moneyType" align="center")
    el-table-column(label="收支" prop="type" align="center")
      template(v-slot="scope")
        span(:class="typeColor(scope.row.type)") {{ scope.row.type }}
    el-table-column(label="金額" prop="money" align="right")
    el-table-column(width="40")
  
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

</template>

<script>
import { ElMessage } from 'element-plus'
import { ref, reactive, watchEffect, computed, toRaw } from 'vue'
import operateData from './data'
import dayjs from 'dayjs'

const nowTime = new Date()
const typeList = ['收入', '支出']
const moneyTypeList = ['食', '衣', '住', '行', '娛樂', '其他']

export default {
  name: 'App',

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
    const summaryMethod = ({ data }) => {
      let sunMoney = data.reduce((acc, curr) => acc + parseInt(curr.money, 10) , 0)
      return ['-', '-', '-', '-', '-', `$ ${sunMoney}`]
    }

    const typeColor = (value) => {
      return value === '收入' ? 'green' : 'red'
    }

    return {
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
      summaryMethod,
    }
  }
}
</script>

<style>
@import './style.css';
</style>
