<template lang="pug">
  view.icon(:style="style")
</template>

<script>
import { Base64 } from 'js-base64'
import { icons } from '@/common/icons'

export default {
  props: {
    type: { require: true },
    size: { default: 48 },
    color: { default: '#ffffff' },
  },
  computed: {
    style () {
      const svg = icons[this.type]
        .replace(/"/g, '\'')
        .replace(/fill='currentColor'/g, `fill='${this.color}'`)
      const url = `data:image/svg+xml;base64,${Base64.encode(svg)}`
      return `height:${this.size}rpx;width:${this.size}rpx;background-image:url("${url}")`
    },
  },
}
</script>

<style scoped lang="scss">
.icon {
  justify-content: center;
  align-items: center;
  direction: flex;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
</style>
