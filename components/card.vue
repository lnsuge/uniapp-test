<template lang="pug">
  view.card
    view.header(v-if="showHeader", :style="headerStyle")
      view.prefix(v-if="prefix")
        app-icon(:type="prefix", size="20", color="#fff")
      view.title {{ title }}
      view.suffix
        slot(name="header-suffix")
    view.body(:style="mergeBodyStyle", :class="bodyClass")
      slot
    slot(name="footer")
</template>

<script>
import AppIcon from './icon'

export default {
  components: { AppIcon },

  props: {
    headerPrefix: String,
    title: String,
    headerStyle: String,
    bodyStyle: String,
    active: { default: false },
    mode: String,
  },

  computed: {
    showHeader () {
      return !!this.headerPrefix || !!this.title
    },
    mergeBodyStyle () {
      let style = ''
      switch (this.mode) {
        case 'through':
          style = 'padding: 24rpx 0'
          break
        case 'fill':
          style = 'padding: 0rpx'
          break
        default:
          style = 'padding: 24rpx'
      }
      return this.bodyStyle ? `${style};${this.bodyStyle}` : style
    },
    bodyClass () {
      return this.active !== false ? 'active' : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  background-color: white;
  border-radius: 6rpx;
  box-shadow:0px 3px 3px rgba(106,106,106,0.16);
}
.header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: rgba(255, 255, 255, .2);
}
.title {
  flex: 1;
}
.body {
  transition: background-color linear 300ms;
  &.active {
    background-color: rgba(112, 199, 147, .3);
  }
}
</style>
