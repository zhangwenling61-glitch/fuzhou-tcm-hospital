<template>
  <div class="portal-general-dialog" catch-move catchtouchmove="handleTouchMove" @touchmove.stop.prevent="handleTouchMove">
    <div class="portal-general-dialog__mask" catch-move catchtouchmove="handleTouchMove" @touchmove.stop.prevent="handleTouchMove"></div>
    <section class="portal-general-dialog__box" role="dialog" aria-modal="true" @click.stop>
      <div class="portal-general-dialog__top-bg">
        <img class="portal-general-dialog__top-bg-img" :src="dialogBg" alt="">
      </div>
      <img class="portal-general-dialog__corner" :src="cornerBlue" alt="">
      <img class="portal-general-dialog__shadow-large" :src="shadowLarge" alt="">
      <img class="portal-general-dialog__shadow-small" :src="shadowSmall" alt="">
      <img class="portal-general-dialog__bell" :src="bell" alt="">

      <div class="portal-general-dialog__content">
        <h3>{{ title }}</h3>
        <rich-text class="portal-general-dialog__message" :nodes="formattedMessage" />
        <div v-if="showCancel" class="portal-general-dialog__btn-group">
          <button class="portal-general-dialog__btn portal-general-dialog__btn--secondary btn-secondary" type="button" @click="$emit('cancel')">{{ cancelText }}</button>
          <button class="portal-general-dialog__btn portal-general-dialog__btn--primary btn-primary" type="button" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
        <PortalButton v-else :text="confirmText" @click="$emit('confirm')" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dialogBg from '@/assets/images/popup/general-dialog/general-dialog-bg@3x.svg'
import cornerBlue from '@/assets/images/popup/general-dialog/alert-check-corner@3x.svg'
import shadowLarge from '@/assets/images/popup/general-dialog/general-dialog-bell-shadow-large@3x.svg'
import shadowSmall from '@/assets/images/popup/general-dialog/general-dialog-bell-shadow-small@3x.svg'
import PortalButton from '@/components/PortalButton/index.vue'
import { usePageScrollLock } from '@/utils/pageScrollLock'
const bell = 'https://foruda.gitee.com/images/1779469627348434971/99207793_16918445.png'
import './index.less'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
  showCancel?: boolean
  cancelText?: string
}>(), {
  title: '这是标题',
  message: '这里是正文字号显示',
  confirmText: '我知道了',
  showCancel: false,
  cancelText: '取消'
})

defineEmits(['confirm', 'cancel'])

const isDialogVisible = ref(true)
usePageScrollLock(isDialogVisible)

function handleTouchMove(e?: any) {
  e?.stopPropagation?.()
  e?.preventDefault?.()
}

const formattedMessage = computed(() => {
  if (!props.message) return ''
  // Replace <span> with styled span
  return props.message.replace(/<span>/g, '<span style="color: #196ffa; font-family: PingFangSC-Medium, sans-serif; font-weight: 600;">')
})
</script>
