<template lang="pug">
  view.map
    view(v-show="isShowTip")
      ext-map-anchor.anchor(:style="anchorStyle" :is-move="isMove" :is-time="isTime" :is-show="isShowBubble")
    map#instance(
      v-if="hackReset"
      :longitude="lLng === null ? initialLng : lLng"
      :latitude="lLat === null ? initialLat : lLat"
      :subkey="styleKey"
      @regionchange="regionchange"
      :polyline="lines"
      :markers="marker"
      class="uni-map"
      :show-location="isShowLocation")
</template>

<script>
import _ from 'lodash'
import { promisify } from '@/tools'
import ExtMapAnchor from './map-anchor'
export default {
  components: { ExtMapAnchor },

  props: {
    isShowTip: { default: true }, //是否显示锚点
    isShowBubble: { default: true }, //是否显示锚点上的气泡
    extraHeight: { default: 0 }, //内容区域高度
    waitHeight: { default: 0 },
    isTime: null, //气泡是否显示倒计时（暂时只有选中车辆页面用到）
    isShowLocation: { default: true }, // 是否显示当前位置锚点
    lLat: null, //
    lLng: null,
    systemInfo: uni.getSystemInfoSync(),
  },

  data () {
    return {
      styleKey: '4KHBZ-K4FW2-35JUU-CPRWV-JGWVV-GLBER',
      isMove: 0,
      marker: [],
      virtual: [],
      lines: [],
      move: true,
      initialLat: 0,
      initialLng: 0,
      hackReset: true,
      formHeight: 0,
      isIncludeP: false, //第一次加载地图缩放点
      isWait: false,
      screenHeight: null,
      screenWidth: null,
      maxLat: 0,
      maxLng: 0,
      minLat: 0,
      minLng: 0,
      constLat: 0,
      leftLng: 0,
      rightLng: 0,
      LRmaxLng: 0,
      LRminLng: 0
    }
  },

  computed: {
    anchorStyle () {
      return `top: calc((100vh - ${this.extraH}px) * 0.5 - 22rpx);left: calc(50vw - ${this.isShowBubble ? 134 : 24 }rpx);`
    },
    extraH () {
      return this.formHeight === 0 ? this.extraHeight : this.formHeight
    },

  },

  methods: {
    async getSystemInfo (){
      const systemInfo = await promisify(uni.getSystemInfo)()
      this.screenHeight = _.get(systemInfo, 'screenHeight', 0)
      this.screenWidth = _.get(systemInfo, 'screenWidth', 0)
    },

    setHeight (height, isWait = false){
      this.formHeight = height
      this.isWait = isWait
    },

    async calcRegion () {
      const { northeast, southwest } = await promisify(this._mapContext.getRegion)()

      return [
        (northeast.longitude + southwest.longitude) / 2, // 中心点经度
        southwest.latitude, // 基础纬度
        northeast.latitude - southwest.latitude,// 相对纬度
        northeast.longitude - southwest.longitude,// 相对经度
        (northeast.latitude + southwest.latitude) / 2 // 中心点纬度
      ]
    },

    //移动地图中心点到指定点
    setCenterLocation (longitude, latitude){
      wx.getLocation({
        type: 'gcj02',
        complete: ()=>{
          if (longitude !== undefined) {
            this.moveToLocation({ longitude: longitude, latitude: latitude })
          }
        },
      })

    },

    //移动地图中心点到当前定位点
    setLocation () {
      wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 2000,
        success: (e) => {
          this.initialLng = e.longitude
          this.initialLat = e.latitude
          this.moveToLocation({ longitude: e.longitude, latitude: e.latitude })
        },
      })
    },

    againLoadMap () {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },

    async getCenterLocation (isVirtual = true) {
      if (isVirtual) {
        // 获取屏幕可视区域高度
        // 计算地图的中心经度，左下角纬度和相对纬度
        const [ lng, baseLat, relativeLat ] = await this.calcRegion()
        const mapHeight = this.screenHeight - this.extraH

        // 计算偏移纬度的偏移比例（占屏幕高度的偏移量）
        const ratio = (mapHeight * 0.5 + this.extraH - (this.isShowBubble ? 74 : 34) ) / this.screenHeight

        // 计算虚拟中心纬度（基础纬度 + 偏移值）
        const lat = baseLat + relativeLat * ratio

        return { longitude: lng, latitude: lat }
      } else {
        return promisify(this._mapContext.getCenterLocation)()
      }
    },

    async moveToLocation ({ longitude, latitude }, isVirtual = true) {
      if (isVirtual) {
        // 获取屏幕可视区域高度
        // 计算地图的中心经度，左下角纬度和相对纬度
        const res = await this.calcRegion()
        const mapHeight = this.screenHeight - this.extraH

        // 计算实际中心点和虚拟中心点相对纬度占屏幕的偏移量
        const ratio = (mapHeight * 0.5 + (this.isShowBubble ? 74 : 34) ) / this.screenHeight

        // 计算实际中心点纬度 res[0]
        const lat = latitude - res[2] * ( 0.5 - ratio)
        await promisify(this._mapContext.moveToLocation)({ longitude: longitude, latitude: lat })
      } else {
        await promisify(this._mapContext.moveToLocation)({ longitude, latitude })
      }

    },



    //监听地图变化
    async regionchange (e) {
      const res = await this.getCenterLocation()
      if (e.causedBy === 'gesture' || e.causedBy === 'drag' || e.causedBy === 'scale') {
        if (e.type === 'end') {
          this.isMove = 2
          this.$emit('regionchange', { lng: res.longitude, lat: res.latitude })
        }else{
          this.isMove = 1
        }
      }
    },
    
    async newLines (points){
      let point = []
      if (points !== null ) {
        point = points
        
        // 获取屏幕可视区域高度
        // 计算地图的中心经度，左下角纬度和相对纬度
        const [ lng, baseLat, relativeLat, relativeLng, lat ] = await this.calcRegion()

        this.maxLng = lng
        this.minLng = lng

        this.LRminLng = lng + relativeLng
        this.LRmaxLng = lng
        //表单区域比例
        const ratio = this.extraH / this.screenHeight
        
        //参照点纬度
        const referLat = baseLat + relativeLat * ratio
        //遍历数组
        this.minLat = referLat
        point.slice(0, 2).forEach(element => {
          if (element.latitude < referLat) {
            this.minLat = element.latitude
            this.minLng = element.longitude
          }
          if (element.longitude > this.LRmaxLng) {
            this.LRmaxLng = element.longitude
          }
          if (element.longitude < this.LRminLng) {
            this.LRminLng = element.longitude
          }
        })
        if (this.minLat !== 0) {
          //虚拟点纬度
          let fakeLat = 0
          if (this.isWait) {
            fakeLat = this.minLat - relativeLat * (ratio / 2)
          }else {
            fakeLat = this.minLat - (referLat - this.minLat) * 2
          }
          
          if(this.minLat.toFixed(2)*1 < referLat.toFixed(2)*1) {
            if (referLat.toFixed(2)*1 - this.minLat.toFixed(2)*1 < 0.1 && this.constLat != 0) {
              point.push({ latitude: this.constLat, longitude: this.minLng })
            } else {
              this.constLat = fakeLat
              point.push({ latitude: fakeLat, longitude: this.minLng })
              
            }
          }else if (this.constLat != 0) {
            point.push({ latitude: this.constLat, longitude: this.minLng })
          }
          
          if (referLat > 0) {
            const _lng = (this.LRmaxLng + this.LRminLng) / 2
            if (this.leftLng < this.LRmaxLng && this.rightLng < this.LRmaxLng) {
              //左右虚拟点
              this.leftLng = _lng - relativeLng
              this.rightLng = _lng + relativeLng
              point.push({ latitude: lat, longitude: this.leftLng })
              point.push({ latitude: lat, longitude: this.rightLng })
            }else {
              point.push({ latitude: lat, longitude: this.leftLng })
              point.push({ latitude: lat, longitude: this.rightLng })
            }
          }
        }
        
        
        if (this.isWait) {
          //司机接单状态上面表单区域比例
          const ratio2 = this.waitHeight / this.screenHeight
          
          //参照点纬度
          const waitLat = baseLat + relativeLat * (1 - ratio2)
          
          //遍历数组
          point.slice(0, 2).forEach(element => {
            if (element.latitude > waitLat) {
              this.maxLat = element.latitude
              this.maxLng = element.longitude
            }
          })

          if (this.maxLat !== 0) {
            //虚拟点纬度
            const fakeLat2 = this.maxLat + relativeLat * (ratio2 / 2)
            point.push({ latitude: fakeLat2, longitude: this.maxLng })
          }
        }
        
        //绘制路线
        await promisify(this._mapContext.includePoints)({ points: point })
      }
    },

    //绘制路线
    drawLines (res){
      if (res !== null ) {
        this.lines = res
      }

    },

    //显示附近的车辆
    nearbyCar (res, isInclude = true){

      if (res !== null ) {
        this.marker = []
        this.virtual = []
        res.forEach(element => {
          let cars = {
            latitude: element.latitude,
            longitude: element.longitude,
            iconPath: '/static/map/car@2x.png',
            width: 17,
            height: 37,
            rotate: element.rotate ? element.rotate : 0 }
          this.marker.push(cars)
          this.virtual.push(cars)
        })
      }
      if (isInclude) {
        if (this.virtual.length < 4 && this.virtual.length !== 0) {
          this.newLines(this.virtual)
        }
      }

    },

    //显示起点终点
    async setSite (res, isInclude = true){
      let point = {}
      this.marker = []
      this.virtual = []
      if (res !== null ) {
        res.forEach(element => {
          if (element.title) {
            point = {
              id: element.id,
              latitude: element.latitude,
              longitude: element.longitude,
              iconPath: element.path,
              width: element.width,
              height: element.height,
              rotate: element.rotate ? element.rotate : 0,
              callout: {
                content: element.title,
                color: '#777777',
                fontSize: 12,
                borderRadius: 20,
                bgColor: '#ffffff',
                padding: 9,
                display: 'ALWAYS',
                textAlign: 'center',
                boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
              },
              label: {
                content: element.site,
                color: '#000000',
                anchorX: 5,
                anchorY: 3,
                fontSize: 12,
              },
            }
          } else {
            point = {
              id: element.id,
              latitude: element.latitude,
              longitude: element.longitude,
              iconPath: element.path,
              width: element.width,
              height: element.height,
              rotate: element.rotate ? element.rotate : 0,
              label: {
                content: element.site,
                color: '#000000',
                anchorX: 5,
                anchorY: 3,
                fontSize: 12,
              },
            }
          }
          this.marker.push(point)
          this.virtual.push(point)
        })
      }

      
  
      if (isInclude && this.virtual.length < 4 && this.virtual.length !== 0) {
        if (!this.isIncludeP) {
          await promisify(uni.createMapContext('instance', this).includePoints)(
            {
              points: this.virtual,
              complete: () => {
                setTimeout(
                  () => {
                    this.newLines(this.virtual)
                    this.isIncludeP = true
                  }, 1000
                )
              },
            })
        } else {
          this.newLines(this.virtual)
        }
      }
    },

    async translateMarker ( longitude, latitude ){

      await promisify(this._mapContext.translateMarker)(
        { markerId: 1,
          destination: { longitude: longitude, latitude: latitude },
          autoRotate: false, rotate: 0, duration: 500,
        })
    },
  },

  mounted () {
    this.getSystemInfo()
    this._mapContext = uni.createMapContext('instance', this)
    if (this.lLng !== null && this.lLat !== null ) {
      this.moveToLocation({ longitude: this.lLng, latitude: this.lLat })
    } else {
      //this.setLocation()
    }
  },
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  width: 100vw;
  height: 100vh;

  .uni-map {
    width: 100%;
    height: 100%;
  }

  .anchor {
    position: absolute;
    z-index: 99;
  }
}
.button {
  position: absolute;
  left: calc(50vw - 26rpx);
  z-index: 999;
}
</style>
