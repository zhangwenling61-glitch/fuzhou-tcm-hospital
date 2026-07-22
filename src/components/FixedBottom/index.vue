<template>
  <div class="fixed-bottom" :style="{height: height + 'px'}">
    <div id="fixed" ref="fixed" class="fixed-bottom__content">
      <slot>
        <yh-button v-bind="$attrs" size="large" @click="$emit('click')">{{ text }}</yh-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { eventCenter, getCurrentInstance, createSelectorQuery } from '@tarojs/taro'
import { Button } from '@yh/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  placeholder?: boolean
  text?: string
}>()

defineEmits<{
  click: []
}>()

const height = ref(0)

onMounted(() => {
  if (process.env.TARO_ENV === 'h5') {
    const el = document.getElementById('fixed')
    if (el) height.value = el.clientHeight
  } else {
    eventCenter.once(getCurrentInstance().router.onReady, getHeight)
    setTimeout(getHeight, 100)
  }
})

function getHeight() {
  if (height.value) return
  const query = createSelectorQuery()
  query.select('#fixed').boundingClientRect()
  query.exec(res => {
    if (res[0]) height.value = res[0].height
  })
}
</script>

<style lang="less">
.fixed-bottom {
  position: relative;
  &__content {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    box-shadow: inset 0px 2px 0px 0px #F5F5F5;
    padding: 30px 40px;
    padding-bottom: calc(const(safe-area-inset-bottom) + 30px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 30px);
    background-color: #fff;
  }
  .yh-button--large { display: block; }
}
</style>
