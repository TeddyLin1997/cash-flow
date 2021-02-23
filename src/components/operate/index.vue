<template lang="pug">
section(class="flex w-full px-2 text-gray text-center")
  el-popover(v-for="item of operateList" v-model:visible="isVisibleForm[item.value]" :width="item.width" trigger="manual" popper-class="popper")
    template(#reference)
      article(@click="toggleVisible(item.value)" class="mr-6 w-10 h-10 flex justify-center items-center text-gray text-xl rounded-full bg-secondary cursor-pointer hover:opacity-80")
        i(:class="item.icon")

    component(:is="item.components")
    
  
</template>

<script>
import { ref, reactive } from 'vue'
import AddInput from './add-input'
import BatchDelete from './batch-delete'
import ExportExcel from './export-excel'

const operateList = [
  { value: 'add', components: 'add-input', icon: 'el-icon-plus', width: 256 },
  { value: 'delete', components: 'batch-delete', icon: 'el-icon-delete', width: 256 },
  { value: 'export', components: 'export-excel', icon: 'el-icon-download', width: 256 },
]
export default {
  name: 'operate',

  components: {
    AddInput,
    BatchDelete,
    ExportExcel,
  },

  setup () {
    const activeTab = ''

    const isVisibleForm = reactive({
      add: false,
      delete: false,
      export: false,
    })

    const toggleVisible = (key) => {
      isVisibleForm[key] = !isVisibleForm[key]
    }

    return {
      operateList,

      isVisibleForm,
      toggleVisible,
    }
  }
}
</script>

<style>
.popper {
  padding: 0 !important;
  border: none !important;
}
</style>
