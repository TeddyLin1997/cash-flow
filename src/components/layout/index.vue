<template lang="pug">
div(class="flex justify-evenly bg-primary")
  account(class="p-4 pr-0 w-80")
  detail(class="p-4 flex-1")
</template>

<script>
import Detail from '@/components/detail'
import Account from '@/components/account'

export default {
  name: 'layout',

  components: {
    Detail,
    Account
  }
}
</script>
