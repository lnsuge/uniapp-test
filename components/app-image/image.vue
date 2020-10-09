<template lang="pug">
  image.img(:src="src" :mode="mode" :style="mergeStyle")
</template>

<script>

export default {
  props: {
    src: {
      type: String,
      default: '',
    },

    mode: {
      type: String,
      default: 'widthFix',
    },

    mergeStyle: String,
  },
}
</script>

<style lang="scss" scoped>
</style>
