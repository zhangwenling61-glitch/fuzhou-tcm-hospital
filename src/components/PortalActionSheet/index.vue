<template>
  <div
    v-if="activeShow"
    class="portal-action-sheet"
    :class="{ 'is-leaving': isLeaving }"
  >
    <div class="portal-action-sheet__mask"
         :style="overlayStyle"
         catch-move
         @touchmove.stop.prevent
         @tap="onClose"></div>
    <section
      class="premium-action-sheet-popup"
      :class="[
        { 'is-leaving': isLeaving, 'has-title': Boolean(title), 'is-custom-content': Boolean($slots.default) },
        sheetClass
      ]"
      @tap.stop
    >
      <div v-if="title || showClose" class="premium-action-sheet-header" catch-move @touchmove.stop.prevent>
        <span class="premium-action-sheet-title">{{ title }}</span>
        <span
          v-if="showClose"
          class="premium-action-sheet-close"
          @tap="onClose"
        ></span>
      </div>

      <div v-if="$slots.default" class="premium-action-sheet-body">
        <slot></slot>
      </div>

      <div v-else class="premium-action-sheet-body">
        <div
          v-for="(item, index) in actions"
          :key="`${item}-${index}`"
          class="premium-action-sheet-item"
          :class="{ 'is-selected': item === value }"
          hover-class="premium-action-sheet-item--hover"
          @tap="onSelect(item)"
        >
          <div class="item-content-wrap">
            <template v-if="getPatientByName(item)">
              <img
                class="item-avatar"
                :src="getPatientByName(item)?.avatar"
                alt="头像"
              />
              <div class="item-info">
                <div class="item-name-wrap">
                  <span class="item-text">{{ maskName(item) }}</span>
                </div>
                <div class="item-card-wrap">
                  <span
                    class="item-tag"
                    :class="getInsuranceTagClass(getPatientByName(item)?.insuranceLabel)"
                  >
                    {{ getInsuranceTagClassText(getPatientByName(item)?.insuranceLabel) }}
                  </span>
                  <span class="item-card-no">
                    {{ formatCardNo(getPatientByName(item)?.cardNo) }}
                  </span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="item-simple-content">
                <span class="item-text">{{ item }}</span>
              </div>
            </template>
          </div>
          <span v-if="item === value" class="item-check">✓</span>
        </div>
      </div>

      <div catch-move @touchmove.stop.prevent>
        <slot name="footer">
          <PortalButton v-if="showCancelButton" :text="cancelText" @click="onClose" />
        </slot>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalActionSheet',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/store'
import PortalButton from '@/components/PortalButton/index.vue'
import { maskName } from '@/utils'
import { usePageScrollLock } from '@/utils/pageScrollLock'

const store = useAppStore()

const getPatientByName = (name: string) => {
  return store.patients.find(p => p.name === name)
}

const formatCardNo = (card?: string) => {
  return card || ''
}

const getInsuranceTagClass = (label?: string) => {
  if (label === '健康卡' || label === '电子健康卡') {
    return 'is-health'
  }
  if (label === '就诊卡' || label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') {
    return 'is-zifei'
  }
  return 'is-yibao'
}

const getInsuranceTagClassText = (label?: string) => {
  if (!label) return ''
  if (label === '健康卡' || label === '电子健康卡') {
    return '健康卡'
  }
  if (label === '社保卡' || label === '医保卡' || label === '医保') {
    return '医保'
  }
  if (label === '就诊卡') {
    return '就诊卡'
  }
  if (label === '就诊卡自费卡' || label === '就诊卡(自费)' || label === '自费') {
    return '自费'
  }
  return label
}

const props = withDefaults(defineProps<{
  show: boolean
  actions: string[]
  value?: string
  title?: string
  cancelText?: string
  showClose?: boolean
  showCancelButton?: boolean
  sheetClass?: string
  overlayStyle?: Record<string, string>
}>(), {
  actions: () => [],
  value: '',
  title: '',
  cancelText: '取消',
  showClose: false,
  showCancelButton: true,
  sheetClass: '',
  overlayStyle: () => ({ backgroundColor: 'rgba(0, 0, 0, 0.7)' })
})

const emit = defineEmits<{(e: 'update:show', val: boolean): void
  (e: 'update:value', val: string): void
  (e: 'select', val: string): void
  (e: 'cancel'): void
}>()

const activeShow = ref(props.show)
const isLeaving = ref(false)
const leaveDuration = 260
let leaveTimer: ReturnType<typeof setTimeout> | undefined

usePageScrollLock(activeShow)

const playLeave = (options: { emitUpdate?: boolean; emitCancel?: boolean } = {}) => {
  if (!activeShow.value) {
    if (options.emitUpdate) {
      emit('update:show', false)
    }
    if (options.emitCancel) {
      emit('cancel')
    }
    return
  }

  if (leaveTimer) {
    clearTimeout(leaveTimer)
  }

  isLeaving.value = true
  leaveTimer = setTimeout(() => {
    if (options.emitUpdate) {
      emit('update:show', false)
    }
    activeShow.value = false
    isLeaving.value = false
    leaveTimer = undefined
    if (options.emitCancel) {
      emit('cancel')
    }
  }, leaveDuration)
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = undefined
    }
    activeShow.value = true
    isLeaving.value = false
  } else if (activeShow.value && !isLeaving.value) {
    playLeave()
  }
})

const onSelect = (item: string) => {
  // Emit events immediately so parent component and store are updated reactively
  emit('update:value', item)
  emit('select', item)

  // Defer transitions to prevent touch event cancellation on real devices
  setTimeout(() => {
    if (activeShow.value && !isLeaving.value) {
      isLeaving.value = true
      playLeave({ emitUpdate: true })
    }
  }, 50)
}

const onClose = () => {
  playLeave({ emitUpdate: true, emitCancel: true })
}
</script>

<style lang="less">
.portal-action-sheet {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.portal-action-sheet__mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45) !important;
  backdrop-filter: blur(4px) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  animation: portal-action-sheet-mask-in 0.22s ease-out both;
}

.portal-action-sheet.is-leaving {
  pointer-events: none;

  .portal-action-sheet__mask {
    animation: portal-action-sheet-mask-out 0.26s ease-out both;
  }
}

.premium-action-sheet-popup {
  position: relative;
  z-index: 1;
  width: 100%;
  max-height: calc(100vh - 96px);
  border-radius: 60px 60px 0 0 !important;
  background: linear-gradient(180deg, #eaf6e3 0%, #f7faf6 100%) !important;
  border-top: 2px solid @white !important;
  border-left: 2px solid @white !important;
  border-right: 2px solid @white !important;
  border-bottom: none !important;
  box-shadow: 0 -8px 32px rgba(42, 69, 29, 0.12) !important;
  backdrop-filter: blur(50px) !important;
  -webkit-backdrop-filter: blur(50px) !important;
  overflow: hidden !important;
  animation: portal-action-sheet-slide-up 0.3s cubic-bezier(0.2, 0.85, 0.25, 1) both;

  &.is-leaving {
    animation: custom-slide-down-leave 0.26s cubic-bezier(0.3, 0, 1, 1) forwards !important;
  }

  .fixed-bottom-bar {
    position: relative !important;
    background: linear-gradient(0deg, #f7faf6 20%, rgba(247, 250, 246, 0) 100%) !important;
    box-shadow: none !important;
    border-top: none !important;
    padding: 40px 40px calc(24px + env(safe-area-inset-bottom)) 40px !important;
    z-index: 10 !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    margin-top: 32px !important;

    .btn-primary {
      width: 100% !important;
      height: 104px !important;
      background: linear-gradient(180deg, #457130 0%, #6ab24c 100%) !important;
      color: @white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 1000px !important;
      font-size: 36px !important;
      font-family: @font-medium !important;
      font-weight: bold !important;
      border: 0 !important;
      box-shadow: 0 8px 7.7px 0 rgba(255, 255, 255, 0.25) inset,
                  0 12px 24px rgba(69, 113, 48, 0.16) !important;
      outline: none !important;
      opacity: 1 !important;
    }
  }
}

@keyframes custom-slide-down-leave {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, 100%, 0);
  }
}

@keyframes portal-action-sheet-slide-up {
  from {
    transform: translate3d(0, 100%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes portal-action-sheet-mask-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes portal-action-sheet-mask-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.premium-action-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto !important;
  min-height: 56px;
  margin: 44px 24px 0 !important;
  border-bottom: none !important;
  background: transparent !important;
}

.premium-action-sheet-title {
  font-size: 36px !important;
  color: @text-color-dark !important;
  font-family: @font-medium !important;
  font-weight: bold !important;
  line-height: 56px !important;
  text-align: center;
}

.premium-action-sheet-close {
  position: absolute;
  right: 44px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 40px 40px;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 5L15 15M15 5L5 15' stroke='%23666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}

.premium-action-sheet-body {
  max-height: 620px !important;
  padding: 26px 24px 40px !important;
  background: transparent !important;
  display: flex;
  flex-direction: column;
  gap: 20px !important;
  overflow-y: auto;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;

  // Premium scroll fade-out gradient mask at top and bottom edges
  -webkit-mask-image: linear-gradient(180deg,
    transparent 0%,
    #000000 32px,
    #000000 calc(100% - 48px),
    transparent 100%
  ) !important;
  mask-image: linear-gradient(180deg,
    transparent 0%,
    #000000 32px,
    #000000 calc(100% - 48px),
    transparent 100%
  ) !important;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.premium-action-sheet-item {
  display: flex;
  align-items: center;
  justify-content: flex-start !important;
  position: relative;
  width: 100% !important;
  height: 136px !important;
  min-height: 136px !important;
  background: rgba(255, 255, 255, 0.66) !important;
  border: 2px solid #ffffff !important;
  border-radius: 32px !important;
  outline: none;
  font-size: 32px;
  color: @text-color-dark;
  font-family: @font-medium;
  font-weight: @font-weight-medium;
  padding: 20px 32px !important;
  box-sizing: border-box;
  box-shadow: 0 4px 10px #ecf5eb !important;
  transition: all 0.2s ease-out;

  .item-content-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    gap: 24px;
    height: 100%;
    width: 100%;
  }

  .item-simple-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 120px;
  }

  .item-avatar {
    width: 96px !important;
    height: 96px !important;
    border-radius: 50% !important;
    margin-right: 24px !important;
    flex-shrink: 0;
    align-self: center;
    border: none !important;
    box-shadow: none !important;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    height: auto !important;
  }

  .item-name-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  .item-card-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  .item-text {
    font-size: 32px !important;
    font-weight: bold !important;
    color: @text-color-dark !important;
    line-height: 44px !important;

    &.is-active {
      color: @blue !important;
    }
  }

  .item-tag {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    padding: 2px 12px !important;
    font-size: 20px !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    line-height: 28px !important;
    flex-shrink: 0;

    &.is-yibao,
    &.is-yb {
      border: 2px solid rgba(69, 113, 48, 0.35) !important;
      background: rgba(69, 113, 48, 0.06) !important;
      color: #457130 !important;
      box-sizing: border-box;
    }

    &.is-health,
    &.is-jkk {
      border: 2px solid rgba(0, 190, 140, 0.35) !important;
      background: rgba(0, 190, 140, 0.06) !important;
      color: #00be8c !important;
      box-sizing: border-box;
    }

    &.is-zifei,
    &.is-zf {
      border: 2px solid rgba(250, 140, 22, 0.35) !important;
      background: rgba(250, 140, 22, 0.06) !important;
      color: #fa8c16 !important;
      box-sizing: border-box;
    }
  }

  .item-card-no {
    font-size: 24px !important;
    color: @text-color !important;
    font-family: @font-regular;
    line-height: 32px !important;
    text-align: left;
  }

  .item-check {
    position: absolute;
    right: 32px !important;
    top: 50%;
    transform: translateY(-50%);
    color: @blue !important;
    font-size: 36px !important;
    font-weight: bold !important;
  }

  &.is-selected {
    background: #ffffff !important;
    border-color: #457130 !important;
    color: @blue !important;
    box-shadow: 0 4px 10px #ecf5eb !important;

    .item-text {
      color: @blue !important;
      font-weight: bold !important;
    }
  }

  &:active {
    transform: scale(0.985);
    background: rgba(0, 0, 0, 0.02) !important;
  }

  &.premium-action-sheet-item--hover {
    transform: scale(0.985) !important;
    background: rgba(0, 0, 0, 0.02) !important;
  }
}

.premium-action-sheet-popup.is-custom-content {
  background: linear-gradient(180deg, #eaf6e3 0%, #f7faf6 100%) !important;

  .premium-action-sheet-header,
  .premium-action-sheet-body {
    background: transparent !important;
  }

  .premium-action-sheet-header {
    border-bottom: 0 !important;
  }

  .premium-action-sheet-body {
    padding: 0 24px 0 !important;
  }
}

.premium-action-sheet-custom-body {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.premium-action-sheet-section-title {
  padding-left: 40px;
  color: @text-color;
  font-family: @font-medium;
  font-size: 28px;
  font-weight: @font-weight-medium;
  line-height: 40px;
}

.premium-action-sheet-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  margin-top: 32px;
  padding: 40px 40px calc(24px + env(safe-area-inset-bottom)) !important;
  box-sizing: border-box;
  border-top: none !important;
  background: linear-gradient(0deg, #f7faf6 20%, rgba(247, 250, 246, 0) 100%) !important;
}

.premium-action-sheet-footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  height: 104px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 1000px;
  box-sizing: border-box;
  font-family: @font-medium;
  font-size: 36px;
  font-weight: @font-weight-medium;
  line-height: 48px;

  transition: transform 0.15s ease-out, opacity 0.15s ease-out;

  &.premium-action-sheet-footer-btn--hover {
    transform: scale(0.96) !important;
    opacity: 0.85 !important;
  }

  &::after {
    display: none;
  }

  &.is-cancel {
    color: @blue;
    background: linear-gradient(0deg, #ECF6E7 0%, #E2F2DB 63.7%, #D8EDCE 100%);
    box-shadow:
      0 16px 60px rgba(69, 113, 48, 0.05),
      0 12px 40px rgba(69, 113, 48, 0.08),
      0 8px 20px rgba(69, 113, 48, 0.1),
      inset 0 0 40px #CBE7BF;
  }

  &.is-confirm {
    color: @white !important;
    background: linear-gradient(180deg, #457130 0%, #6ab24c 100%) !important;
    box-shadow: 0 8px 7.7px 0 rgba(255, 255, 255, 0.25) inset,
                0 12px 24px rgba(69, 113, 48, 0.16) !important;
    font-weight: bold !important;
  }
}
</style>
