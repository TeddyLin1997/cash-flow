<template lang="pug">
.account
  article(class="mb-4 p-2 bg-secondary rounded-lg")
    div(class="mb-4 text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 資產管理
    
    div(class="font-bold")
      div(class="px-1 flex justify-between text-red")
        span 總支出
        span - {{ pay }}
      div(class="px-1 flex justify-between text-green")
        span 總收入
        span + {{ income }}
      div(class="mt-2 p-1 pt-2 flex justify-between items-end border-t border-white text-orange ")
        span 淨資產
        span(class="text-3xl") $ {{ total }}
  
  article(class="mb-4 p-2 bg-secondary rounded-lg")
    div(class="mb-4 text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 收支分佈

  article(class="mb-4 p-2 bg-secondary rounded-lg")
    div(class="mb-4 text-lg font-bold text-gray")
      i.el-icon-s-finance(class="mr-2")
      span 支出比例
  
</template>

<script>
import { useAssets, allDataList } from '@/data'

export default {
  name: 'account',

  setup () {
    const { income, pay, total } = useAssets()
    return {
      income,
      pay,
      total,
    }
  }
}
</script>
