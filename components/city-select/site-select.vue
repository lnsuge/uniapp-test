<template>
  <!-- 城市选择-->
  <view class="city-select">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="city-select-main" id="city-select-main">
      <!-- 预留搜索-->
      <view class="city-serach" v-if="isSearch"><view class="serach-icon"><app-icon type="search" :size="28" color="#6A6A6A"></app-icon></view><input @input="keyInput" :placeholder="placeholderText" class="city-serach-input" /></view>
      <!-- 城市列表(搜索前) -->
      <view class="citys" v-if="!serachCity">
        <view v-for="(city, index) in sortItems" :key="index" v-show="city.isCity">
          <view class="citys-item-letter" :id="'city-letter-' + (city.name === '#' ? '0' : city.name)">{{ city.name }}</view>
          <view class="citys-item" v-for="(item, inx) in city.citys" :key="inx" @click="cityTrigger(item)">
            <view>{{ item.cityName }}</view>
            <view class="citys-item-address">{{ item.cityAddress }}</view>
          </view>
        </view>
      </view>
      <!-- 城市列表(搜索后)  -->
      <view class="citys" v-if="serachCity">
        <view v-for="(item, index) in searchDatas" :key="index">
          <view class="citys-item" :key="inx" @click="cityTrigger(item)">
            <view>{{ item.name }}</view>
            <view class="citys-item-address">{{ item.address }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 城市选择索引-->
    <view class="city-indexs-view" v-if="!serachCity">
      <view class="city-indexs">
        <view class="icon">
          <app-icon type="pentagram" :size="28" color="#F18635"></app-icon>
        </view>
        <view v-for="(cityIns, index) in handleCity" v-show="cityIns.isCity" :key="index" @click="cityindex(cityIns.name)">{{ cityIns.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import citySelect from './citySelect.js'
import AppIcon from '@/components/icon'
export default {
  components: { AppIcon },
  props: {
    //传入要排序的名称
    formatName: {
      type: String,
      default: 'cityName',
    },
    //城市数据
    obtainCitys: {
      type: Array,
      default: () => [],
    },
    //是否有搜索
    isSearch: {
      type: Boolean,
      default: true,
    },
    //搜索占位文字
    placeholderText: {
      type: String,
      default: '请输入',
    },
  },
  data () {
    return {
      scrollTop: 0, //scroll-view 滑动的距离
      cityindexs: [], // 城市索引
      activeCityIndex: '', // 当前所在的城市索引
      handleCity: [], // 处理后的城市数据
      serachCity: '', // 搜索的城市
      cityData: [],
    }
  },
  computed: {
    /**
     * @desc 城市列表排序
     * @return  Array
     */
    sortItems () {
      for (let index = 0; index < this.handleCity.length; index++) {
        if (this.handleCity[index].isCity) {
          var cityArr = this.handleCity[index].citys
          cityArr = cityArr.sort((a, b) => {
            var value1 = a.unicode
            var value2 = b.unicode
            return value1 - value2
          })
        }
      }
      return this.handleCity
    },
    /**
     * @desc 搜索后的城市列表
     * @return Array
     */
    searchDatas () {
      var searchData = []
      for (let i = 0; i < this.cityData.length; i++) {
        if (this.cityData[i][this.formatName].indexOf(this.serachCity) !== -1 || this.cityData[i].letter.indexOf(this.serachCity) !== -1 ) {
          searchData.push({
            oldData: this.cityData[i],
            name: this.cityData[i][this.formatName],
            address: this.cityData[i].address,
          })
        }
      }
      return searchData
    },
  },
  created () {
    // 初始化城市数据
    this.cityData = this.obtainCitys
    this.initializationCity()
    this.buildCityindexs()
  },
  watch: {
    obtainCitys (newData) {
      this.updateCitys(newData)
    },
  },
  methods: {
    /**
     * @desc 初始化
     */
    updateCitys (data) {
      if (data && data.length) {
        this.cityData = data
        this.initializationCity()
        this.buildCityindexs()
      }
    },
    /**
     * @desc 监听输入框的值
     */
    keyInput (event) {
      this.serachCity = event.detail.value
    },
    /**
     * @desc 初始化城市数据
     * @return undefind
     */
    initializationCity () {
      this.handleCity = []
      const cityLetterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
      for (let index = 0; index < cityLetterArr.length; index++) {
        this.handleCity.push({
          name: cityLetterArr[index],
          isCity: false, // 用于区分是否含有当前字母开头的城市
          citys: [], // 存放城市首字母含是此字母的数组
        })
      }
    },
    /**
     * @desc 得到城市的首字母
     * @param str String
     */
    getLetter (str) {
      return citySelect.getFirstLetter(str[0])
    },
    /**
     * @desc 构建城市索引
     * @return undefind
     */
    buildCityindexs () {
      this.cityindexs = []
      for (let i = 0; i < this.cityData.length; i++) {
        // 获取首字母
        let cityLetter = this.getLetter(this.cityData[i][this.formatName]).firstletter
        // 获取当前城市首字母的unicode，用作后续排序
        let unicode = this.getLetter(this.cityData[i][this.formatName]).unicode

        let index = this.cityIndexPosition(cityLetter)
        if (this.cityindexs.indexOf(cityLetter) === -1) {
          this.handleCity[index].isCity = true
          this.cityindexs.push(cityLetter)
        }

        this.handleCity[index].citys.push({
          cityName: this.cityData[i][this.formatName],
          cityAddress: this.cityData[i].address,
          unicode: unicode,
          oldData: this.cityData[i],
        })
      }
    },
    /**
     * @desc 滑动到城市索引所在的地方
     * @param id String 城市索引
     */
    cityindex (id) {
      //创建节点查询器
      const query = uni.createSelectorQuery().in(this)
      var that = this
      that.scrollTop = 0
      //滑动到指定位置(解决方法:重置到顶部，重新计算，影响:页面会闪一下)
      setTimeout(() => {
        query
          .select('#city-letter-' + (id === '#' ? '0' : id))
          .boundingClientRect(data => {
            data ? (that.scrollTop = data.top) : void 0
          })
          .exec()
      }, 0)
    },
    /**
     * @desc 获取城市首字母的unicode
     * @param letter String 城市索引
     */
    cityIndexPosition (letter) {
      if (!letter) {
        return ''
      }
      const ACode = 65
      return letter === '#' ? 26 : letter.charCodeAt(0) - ACode
    },
    /** @desc 城市列表点击事件
     *  @param Object
     */
    cityTrigger (item) {
      // 传值到父组件
      this.$emit('cityClick', item.oldData ? item.oldData : item)
    },
  },
}
</script>

<style lang="scss">
//宽度转换vw
@function vww($number) {
  @return ($number / 375) * 750 + rpx;
}

view {
  box-sizing: border-box;
}

.city-serach {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  color: #4a4a4a;
  background: rgba(255,255,255,1);
  box-shadow: 0 6rpx 6rpx rgba(106,106,106,.16);

  .serach-icon {
    padding: 38rpx 28rpx;
  }

  &-input {
    flex: 1;
    box-sizing: border-box;
    height: vww(40);
    padding: 0 vww(5);
    font-size: vww(14);
    line-height: vww(40);
    background: rgba(249,249,249,1);
    background: rgba(255,255,255,1);
    border-radius: 6rpx;
  }
}

.hot-content {
  box-sizing: border-box;
  margin-bottom: 38rpx;
  background: rgba(255,255,255,1);
  box-shadow: 0 6rpx 6rpx rgba(106,106,106,.16);
  border-radius: 6rpx;
}

.city-select-main {
  position: relative;

// overflow: scroll;
  // -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
  background: rgba(249,249,249,1);

  // overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}

.city-select {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 0 12rpx 12rpx 12rpx;
  background: rgba(249, 249, 249, 1);

  .hot-title-content {
    display: flex;
    align-items: center;
    height: 112rpx;
    app-icon {
      padding: 20rpx;
    }
  }

  .line {
    border: 2rpx solid rgba(233,233,233,1);
  }

  // 热门城市
  .hot-title {
    flex: 1;
    color: rgba(39,39,39,1);
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
  }

  .hot-city {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    width: 100%;
    padding-left: 30rpx;

    .hot-item {
      display: -webkit-box;
      height: 52rpx;
      padding: 6rpx 20rpx;
      margin: 0 40rpx 46rpx 0;
      color: rgba(50,50,50,1);
      font-size: 28rpx;
      font-weight: 400;
      line-height: 40rpx;
      text-align: center;
      background: rgba(240,240,240,1);
      border-radius: 6rpx;

      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }

    .hot-hidden {
      display: none;
      margin-right: 0;
    }
  }

  .citys {
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    box-shadow: 0 6rpx 6rpx rgba(106,106,106,.16);
    border-radius: 6rpx;
     > view {
      width: 100%;
      padding-left: 38rpx;
      font-size: 14px;

      .citys-item-letter {
        width: 100vw;
        padding-left: vww(18);
        margin-top: -1px;
        margin-left: vww(-18);
        color: rgba(39,39,39,1);
        line-height: vww(30);
        border-top: none;
      }

      .citys-item {
        width: 100%;
        color: rgba(50,50,50,1);
        font-family: PingFang SC;
        font-size: 28rpx;
        font-weight: 400;
        line-height: vww(50);
        border-bottom: 2rpx solid rgba(233,233,233,1);
        &:last-child {
          border: none;
        }

        .citys-item-address {
          width: 100%;
          padding-bottom: 24rpx;
          color: rgba(173,173,173,1);
          font-family: PingFang SC;
          font-size: 26rpx;
          font-weight: 400;
          line-height: 36rpx;
        }
      }
    }
  }

  .city-indexs-view {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    display: flex;
    width: vww(20);
    height: 100%;
    text-align: center;
    background: transparent;

    .city-indexs {
      align-self: center;
      width: vww(20);
      text-align: center;
      vertical-align: middle;

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: vww(20);
      }

       > view {
        width: vww(20);
        margin-bottom: vww(10);
        color: rgba(174,174,174,1);
        font-size: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
