<template lang="pug">
div(class="py-2 px-4 text-gray bg-secondary border-gray border")
  div
    div(class="my-1") 匯出資料
    el-select(v-model="exportForm.type" size="small")
      el-option(v-for="item of typeList" :key="item.value" :label="item.label" :value="item.value")

  div(v-show="exportForm.type === 'month'")
    div(class="my-1") 月份
    el-date-picker(v-model="exportForm.month" type="month" size="small")
    //- el-select(v-model="exportForm.month" size="small")
    //-   el-option(v-for="num of 12" :key="num" :value="num")

  div(class="mt-4")
    el-button(@click="exportType" class="bg-active border-none focus:bg-active focus:outline-none hover:bg-active" type="primary" size="small") 匯出Excel
</template>

<script>
import { ref, operateStore, allDataList } from '@/store'
import { reactive, computed } from 'vue'

const typeList = [
  { label: '月份', value: 'month' },
  { label: '全部', value: 'all' },
]

const date = new Date()

export default {
  name: 'export-excel',

  setup () {
    const exportForm = reactive({
      type: 'month',
      month: date,
    })

    const monthRange = computed(() => [dayjs(exportForm.month).startOf('month').valueOf(), dayjs(exportForm.month).endOf('month').valueOf()])

    const exportType = () => {
      let dataList = allDataList.value

      if (exportForm.type === 'month') {
        dataList = allDataList.value.filter(item => {
          if (monthRange.value[0] < item.timeStamp &&  item.timeStamp < monthRange.value[1]) return item
        })
        operateStore.export(dataList)
      }

      operateStore.export(dataList)
    }

    return {
      typeList,

      exportForm,
      exportType,
    }
  }
}
</script>

<style>

</style>