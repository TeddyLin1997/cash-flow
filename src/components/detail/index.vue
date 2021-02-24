<template lang="pug">

div(class="flex flex-col justify-between items-center")
  //- table
  div(class="w-full text-center bg-secondary rounded-lg")
    header(class="py-2 px-4 h-12 flex justify-between items-center bg-active rounded-t-lg text-white")
      div(v-for="column of thead" :key="column.attr" :class="column.class") {{ column.label }}

    //- 避免打包時優化tailwind class
    div(class="hidden pr-2 w-32 w-10 w-28 text-right font-bold")

    section(class="px-5 h-table overflow-auto text-gray")
      article(v-for="item of sortableData" class="relative h-14 flex justify-between items-center text-center border-primary border-b")
        i(@click="operateStore.delete(item)" class="el-icon-error absolute -left-3 cursor-pointer text-red hover:bg-white rounded-full")
        div(
          v-for="column of thead"
          :class="[column.class, typeColor(column.attr, item[column.attr])]"
        ) {{ column.attr === 'money' ? comma(item[column.attr]) : item[column.attr] }}
  //- operate
  operate

</template>

<script>
import { ref, watch, computed, onMounted, watchEffect } from 'vue'
import { thead, typeList, allDataList, operateStore } from '@/store'
import { comma } from '@/helper'
import Operate from '@/components/operate'

export default {
  name: 'detail',

  components: {
    Operate
  },

  setup () {
    // data
    const sortableData = computed(() => {
      return allDataList.value.sort((a, b) => a.timeStamp - b.timeStamp )
    })

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
      sortableData,
      operateStore,
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
