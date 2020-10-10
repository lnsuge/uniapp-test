<template lang='pug'>
  .container
    view 工作台页面
</template>

<script>
import _ from 'lodash'
import { uniPromiseify } from '@/common'


export default {

  data () {
    return {

    }
  },

  computed: {
  },

  methods: {
    
  },

  onLoad (options) {
    console.log(options)
  },


  onShow () {
  },
}
</script>

<style lang='scss' scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
