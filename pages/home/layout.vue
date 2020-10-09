<template lang="pug">
  .container(v-if="isShow" :class="animation")
    ext-time.time(@handHide="handHide" :business="business" :city="city")
</template>

<script>
import ExtTime from './time'

export default {
  components: { ExtTime },

  props: {
    isShow: {
      type: Boolean,
    },
    city: {
      type: Object,
    },
    business: {
      type: String,
    },
  },

  methods: {
    handHide (obj) {
      this.$emit('handHide', obj)
    },
  },
}
</script>
