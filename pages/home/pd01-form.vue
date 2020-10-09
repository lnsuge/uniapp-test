<template lang='pug'>
  .container
    .site(@tap="handleSite('1')")
      .circle.origin
      .address(v-if='pd01Start.name') {{ pd01Start.name }}
      .placeholder(v-else) 您在哪里上车
      .icon
        app-icon(type="arrow-right" :size="20" color="#9B9B9B")
    .history(v-if="!pd01Start.name && !pd01End.name")
      .recommendSite(v-for='(item, index) in departSuggestSite' :key='index' @tap="handleRecommend('pd01Start', item)")
        .title {{ item.name }}
        .distance 距您{{ item.distance > 1 ? item.distance + 'km' : item.distance*1000 + 'm' }}
    .line
    .site(@tap="handleSite('2')")
      .circle.blue
      .address(v-if='pd01End.name') {{ pd01End.name }}
      .placeholder(v-else) 您要去哪里
      .icon
        app-icon(type="arrow-right" :size="20" color="#9B9B9B")
    .history(v-if="!pd01Start.name && !pd01End.name")
      .recommendSite(v-for='(item, index) in arriveSuggestSite' :key='index' @tap="handleRecommend('pd01End', item)")
        .title {{ item.name }}
        .distance 距您{{ item.distance > 1 ? item.distance + 'km' : item.distance*1000 + 'm' }}
</template>

<script>
import _ from 'lodash'

import AppIcon from '@/components/icon'

import { PD01_SUGGEST } from '@/store/modules/pd01/keys'

export default {
  components: { AppIcon },

  props: {
    start: {},
    pd01Start: {},
    pd01End: {},
  },

  data () {
    return {
      departSuggestSite: [],
      arriveSuggestSite: [],
    }
  },

  computed: {
    cityAdCode () {
      return _.get(this.$store.state.commons, 'city.adCode')
    },

    business () {
      return _.get(this.$store.state.commons, 'business')
    },

    originCode () {
      return _.get(this.pd01Start, 'code')
    },

    siteCode () {
      return _.get(this.pd01End, 'code')
    },
  },

  watch: {
    start () {
      this.pd01Suggest()
    },
  },

  methods: {
    // type查询类型,1查起点 2查终点
    handleSite (type) {
      uni.navigateTo({
        url: `/pd01/pd01-site-list/index?type=${type}&originCode=${this.originCode}&siteCode=${this.siteCode}`,
      })

      // 监听选择站点
      uni.$once('chooseSite', (data) => {
        // 如果上车点变化，改变首页start坐标，自动移动地图
        // if (data.type === '1') {
        //   const siteData = {
        //     geoType: 'GCJ02',
        //     name: _.get(data, 'site.name'),
        //     address: _.get(data, 'site.address'),
        //     geo: _.get(data, 'site.geo'),
        //   }
        //   this.$emit('formChange', 'start', siteData)
        // }

        const key = data.type === '1' ? 'pd01Start' : 'pd01End'
        this.$emit('formChange', key, data.site)
      })
    },

    handleRecommend (key, site) {
      this.$emit('formChange', key, site)
    
      // const siteData = {
      //   geoType: 'GCJ02',
      //   name: site.name,
      //   address: site.address,
      //   geo: site.geo,
      // }

      // if (key === 'pd01Start') {
      //   this.$emit('formChange', 'start', siteData)
      // }
    },

    async pd01Suggest () {
      const latitude = _.get(this.start, 'geo.coordinates[1]')
      const longitude = _.get(this.start, 'geo.coordinates[0]')

      if (!this.cityAdCode) return
      if (!latitude) return
      if (!longitude) return

      const payload = {
        cityCode: this.cityAdCode,
        geo: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      }
      const { departSuggestSite, arriveSuggestSite } = (await this.$store.dispatch(PD01_SUGGEST, payload)).data
      this.departSuggestSite = departSuggestSite
      this.arriveSuggestSite = arriveSuggestSite
    },
  },

  mounted () {
    this.pd01Suggest()
  },
}
</script>

<style lang='scss' scoped>
.container {
  .site {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    .circle {
      width: 20rpx;
      height: 20rpx;
      margin-right: 10rpx;
      border-radius: 50%;
    }
    .origin {
      background-color: #f5832b;
    }
    .blue {
      background-color: #2793e7;
    }
    .address {
      flex: 1;
      font-size: 28rpx;
    }
    .placeholder {
      flex: 1;
      color: #cfcfcf;
      font-size: 28rpx;
    }
  }

  .history {
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
    .recommendSite {
      display: inline-block;
      box-sizing: border-box;
      padding: 6rpx 16rpx;
      margin-right: 56rpx;
      margin-bottom: 8rpx;
      color: #b6b6b6;
      vertical-align: baseline;
      background: rgba(240, 240, 240, 1);
      border-radius: 6px;
      .title {
        display: inline-block;
        margin-right: 12rpx;
        font-size: 24rpx;
      }
      .distance {
        display: inline-block;
        font-size: 20rpx;
      }
    }
  }

  .line {
    height: 2rpx;
    background: rgba(228, 228, 228, 1);
  }
}
</style>
