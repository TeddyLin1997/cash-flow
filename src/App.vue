<template lang="pug">
.index
  .table
    h3 收支明細
    el-table(:data="allDataList")
      el-table-column(label="日期" prop="dateTime")
        template(v-slot="scope")
          span {{ scope.row.dateTime }}
      el-table-column(label="項目" prop="name")
      el-table-column(label="類型" prop="moneyType")
      el-table-column(label="收支" prop="type")
        template(v-slot="scope")
          span(:class="typeColor(scope.row.type)") {{ scope.row.type }}
      el-table-column(label="金額" prop="money")
        template(v-slot="scope")
          span {{ scope.row.type === '支出' ? '-' : '' }} {{ scope.row.money }}

  .form
    .title
      span 輸入列 &nbsp
      el-checkbox(v-model="isClear") 新增後清除
    .form-item
      label 日期
      el-date-picker(v-model="detailForm.dateTime" size="small" placeholder="選擇日期")
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
      el-input(v-model="detailForm.name" size="small" placeholder="請輸入")
    .form-item
      label 金額
      el-input(v-model="detailForm.money" type="number" placeholder="輸入金額" size="small" @keyup.enter="addItem(detailForm)")
    .form-item
      el-button(@click="addItem(detailForm)" type="primary" size="small") 新增
  
</template>

<script>
import { ref, reactive, watchEffect } from 'vue'
import dayjs from 'dayjs'
import XLSX from 'xlsx'

const typeList = ['收入', '支出']
const moneyTypeList = ['食', '衣', '住', '行', '娛樂', '其他']

export default {
  name: 'App',

  setup () {
    const allDataList = ref([])
    const detailForm = reactive({
      dateTime: '',
      name: '',
      moneyType: '',
      type: '',
      money: '',
    })

    const addItem = (formData) => {
      const item = { ...formData }
      item.dateTime = dayjs(item.dateTime).format('YYYY/MM/DD')
      allDataList.value.push(item)
      clearDetailForm()
    }

    const isClear = ref(true)
    const clearDetailForm = () => {
      if (isClear.value) {
        detailForm.dateTime = ''
        detailForm.name = ''
        detailForm.moneyType = ''
        detailForm.type = ''
        detailForm.money = ''
      }
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
      
      addItem,
      typeColor,
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

.table h3 {
  padding: 12px 8px;
}

.form {
  padding: 12px 16px;
  color: #fff;
  background-color: #4c5560;
}

label {
  font-size: 14px;
}

.form-item {
  margin: 12px;
  display: inline-block;
  width: 220px;
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
</style>
