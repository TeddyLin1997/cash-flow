<template lang="pug">
div(class="py-2 px-4 w-full flex flex-col justify-between bg-secondary border border-white text-white")
  div(class="my-1") 日期
  el-date-picker(v-model="detailForm.date" size="small" placeholder="選擇日期")

  div(class="my-1") 收支
  el-select(v-model="detailForm.type" @change="handleType" size="small" placeholder="請選擇")
    el-option(v-for="item of typeList" :value="item")

  div(class="my-1") 類型
  el-select(v-model="detailForm.category" size="small" placeholder="請選擇")
    el-option(v-for="item of categoryList" :value="item")

  div(class="my-1") 項目
  el-input(v-model="detailForm.name" ref="inputElement" size="small" placeholder="請輸入")

  div(class="my-1") 金額
  el-input(v-model="detailForm.money" type="number" placeholder="輸入金額" size="small" @keyup.enter="addItem(detailForm)")

  el-button(@click="addItem(detailForm)" class="mt-4 w-20 bg-active border-none focus:bg-active focus:outline-none hover:bg-active" type="primary" size="small") 新增
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { date, typeList, categoryList, operateStore } from '@/store'
import { ElMessage } from 'element-plus'

export default {
  name: 'add-input',

  setup () {
    // data
    const detailForm = reactive({
      date: date,
      name: '',
      category: '食',
      type: typeList[1],
      money: '',
    })

    // category
    const handleType = () => {
      detailForm.category = categoryList.value[0]
    }
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

    return {
      typeList,

      categoryList,
      handleType,

      inputElement,
      detailForm,
      addItem,
    }
  }
}
</script>

<style>

</style>