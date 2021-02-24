<template lang="pug">
div(class="p-2 flex justify-center items-center bg-secondary border-gray border")
  el-button(@click="deleteAllData" class="bg-active border-none focus:bg-active focus:outline-none hover:bg-active" type="primary" size="small") 全部清除
</template>

<script>
import { operateStore } from '@/store'

export default {
  name: 'batch-delete',

  setup () {

    const deleteAllData = () => {
      operateStore.clear()
    }

    return {
      deleteAllData,
    }
  }
}
</script>

<style>

</style>