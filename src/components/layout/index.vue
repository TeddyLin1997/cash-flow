<template lang="pug">
div(class="flex bg-primary")
  account(class="p-4 w-full")
  detail(class="p-4 w-full")
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
