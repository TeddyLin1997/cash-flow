<template lang="pug">
.account
  article(class="mb-4 p-2 bg-secondary rounded-lg")
    div(class="mb-4 text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 資產管理
    
    div(class="font-bold")
      div(class="my-2 px-1 flex justify-between text-red")
        span 總支出
        span - {{ comma(pay)  }}
      div(class="px-1 flex justify-between text-green")
        span 總收入
        span + {{ comma(income) }}
      div(class="mt-2 p-1 pt-2 flex justify-between items-end border-t border-gray text-orange ")
        span 淨資產
        span(class="text-3xl") $ {{ comma(total) }}
  
  article(class="mb-4 p-2  bg-secondary rounded-lg")
    header(class="text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 收支分佈
    main
      canvas(class="w-full" ref="profitElement")

  article(class="p-2 bg-secondary rounded-lg")
    header(class="mb-2 text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 支出比例
    main(class="mb-1 relative")
      canvas(class="w-full" ref="paymentElement")
    footer(class="mx-4 py-1 border-t border-gray h-detail")
      div(v-for="type of payTypeList" class="flex justify-between text-gray")
        div(class="w-16") {{ type.name }}
        div(class="w-20 text-right") {{ ((Math.abs(type.value) / pay) * 100).toFixed(2) }}%
        div(class="w-20 text-right") {{ comma(Math.abs(type.value)) }}
      
  
</template>

<script>
import { ref, onMounted, computed, watchEffect, watch } from 'vue'
import { useAssets, allDataList } from '@/store'
import { comma } from '@/helper'
import * as echarts from 'echarts'

export default {
  name: 'account',

  setup () {
    const { income, pay, total } = useAssets()
    // profit chart
    const profitElement = ref(null)
    const profitInstance = ref(null)
    const profitOption = computed(() => ({
      series: [
        {
          type: 'pie',
          radius: ['50%', '90%'],
          itemStyle: { color: () => colors[i.value++] },
          label: { formatter:'{b} {d}%', position: 'inside', fontSize: 14, lineHeight: 20, color: '#fff', backgroundColor: 'transparent' },
          data: [
            {value: income.value, name: '收入'},
            {value: pay.value, name: '支出'},
          ],
        },
      ],
    }))

    onMounted(() => {
      profitInstance.value = echarts.init(profitElement.value)
      profitInstance.value.setOption(profitOption.value ,true)

      watch([ income, pay ], () => profitInstance.value.setOption(profitOption.value ,true))
    })

    // color
    const colors = [ '#38bdaa', '#FD6162' ]
    let i = ref(0)
    watchEffect(() => { if (i.value === 2) i.value = 0 })

    // payment chart
    const payTypeList = computed(() => {
      const list = []
      allDataList.value.filter(item => item.type === '支出').forEach(item => {
        const target = list.find(node => node.name === item.moneyType)
        if (!target) list.push({ value: item.money, name: item.moneyType })
        else target.value += item.money
      })
      return list
    })

    const paymentElement = ref(null)
    const paymentInstance = ref(null)
    const paymentOption = computed(() => ({
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['50%', '80%'],
          itemStyle: { borderColor: '#404449', borderWidth: 3, left: 10 },
          label: { formatter:'{b} {d}%', fontSize: 12, lineHeight: 20, color: '#fff', backgroundColor: 'transparent' },
          labelLine: { length: 10, length2: 7 },
          data: payTypeList.value,
        },
      ],
    }))

    onMounted(() => {
      paymentInstance.value = echarts.init(paymentElement.value)
      paymentInstance.value.setOption(paymentOption.value)

      watch(payTypeList, () => paymentInstance.value.setOption(paymentOption.value ,true))
    })

    return {
      income,
      pay,
      total,

      payTypeList,

      profitElement,
      paymentElement,

      comma,
    }
  }
}
</script>
