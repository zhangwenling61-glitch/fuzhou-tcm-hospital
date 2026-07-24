<template>
  <PortalGeneralDialog
    v-if="show"
    :title="title"
    :message="message"
    :confirm-text="countdownConfirmText"
    @confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import PortalGeneralDialog from '@/components/PortalGeneralDialog/index.vue'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  duration?: number
}>(), {
  title: '操作成功',
  message: '',
  confirmText: '我知道了',
  duration: 3000
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  confirm: []
  timeout: []
}>()

const countdown = ref(3)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null

const countdownConfirmText = computed(() => `${props.confirmText}(${countdown.value}S)`)

const clearTimers = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

const closeToast = (source: 'confirm' | 'timeout') => {
  clearTimers()
  emit(source)
  emit('update:show', false)
}

const startCountdown = () => {
  clearTimers()
  const duration = Math.max(props.duration, 1000)
  countdown.value = Math.max(Math.ceil(duration / 1000), 1)
  countdownTimer = setInterval(() => {
    countdown.value = Math.max(countdown.value - 1, 0)
  }, 1000)
  closeTimer = setTimeout(() => {
    closeToast('timeout')
  }, duration)
}

const handleConfirm = () => {
  closeToast('confirm')
}

watch(() => props.show, (visible) => {
  if (visible) {
    startCountdown()
    return
  }
  clearTimers()
}, { immediate: true })

onBeforeUnmount(clearTimers)
</script>
