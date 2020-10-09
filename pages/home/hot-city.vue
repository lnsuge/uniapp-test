<template lang='pug'>
  .container(:style='containerMarginTop')
    .head 热门城市
    .city(v-for='(item, index) in hotCity' :key='index' @tap="handleHotCity(item)") {{ item.name }}
</template>

<script>
import _ from 'lodash'

import AppImage from '@/components/app-image/image'

import { PD04_CITY_HOT } from '@/store/modules/pd04/keys'

export default {
  components: { AppImage },

  data () {
    return {
      hotCity: [],
    }
  },

  computed: {
    orderProcess () {
      return _.get(this.$store.state.order, 'orderProcess', [])
    },

    containerMarginTop () {
      return this.orderProcess.length === 0 ? 'margin-top: 60rpx;' : 'margin-top: 20rpx;'
    },
  },

  methods: {
    async getHotCity () {
      const { data } = await this.$store.dispatch(PD04_CITY_HOT)
      this.hotCity = data
    },

    handleHotCity (item) {
      uni.$emit('pd04HotCityChoose', { 'endCity': item })
    },
  },

  created () {
    this.getHotCity()
  },
}
</script>

<style lang='scss' scoped>
.container {
  box-sizing: border-box;
  padding: 20rpx;
  margin: 20rpx 20rpx 0 20rpx;
  background: rgba(255,255,255,1);
  box-shadow: 0rpx 6rpx 6rpx rgba(106,106,106,.16);
  border-radius: 6rpx;

  .head {
    color: rgba(45,45,45,1);
    font-family: PingFang SC;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
  }

  .city {
    display: inline-block;
    padding: 20rpx 20rpx;
    margin: 20rpx 20rpx 0 0;
    color: rgba(96,96,96,1);
    font-family: PingFang SC;
    font-size: 26rpx;
    font-weight: 400;
    line-height: 36rpx;
    background: rgba(240,240,240,1);
    border-radius: 6rpx;
  }
}
</style>
