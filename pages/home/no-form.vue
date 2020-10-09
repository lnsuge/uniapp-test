<template lang='pug'>
  .container(@tap='handleTap')
    view 点击跳转到对应的小程序
</template>

<script>
import _ from 'lodash'
import { navigate } from '@/tools/navigate'

export default {
  computed: {
    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    businesses () {
      return _.get(this.$store.state.commons, 'businessConfig.business')
    },

    item () {
      return _.get(_.filter(this.businesses, item => item.code === this.business ), '[0]')
    },
  },

  methods: {
    handleTap () {
      const { extra } = this.item
      navigate(`minapp://${extra.appId}${extra.path}`)
    },
  },
}
</script>

<style lang='scss' scoped>
.container {
  padding: 80rpx 0;
  color: #555;
  text-align: center;
}
</style>
