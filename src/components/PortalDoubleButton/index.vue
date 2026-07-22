<template>
  <div class="fixed-bottom-bar is-transparent is-double">
    <div class="btn-group">
      <button class="btn-secondary" type="button" @click="handleLeft">
        {{ leftText }}
      </button>
      <button
        class="btn-primary"
        :class="{ 'is-disabled': disabled }"
        type="button"
        :style="disabled ? 'pointer-events: auto;' : ''"
        @click="handleRight"
      >
        {{ rightText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalDoubleButton',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
withDefaults(defineProps<{
  leftText?: string
  rightText?: string
  disabled?: boolean
}>(), {
  leftText: '返回',
  rightText: '确认',
  disabled: false
})

const emit = defineEmits<{
  (e: 'left-click'): void
  (e: 'right-click'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const handleLeft = () => {
  emit('left-click')
  emit('cancel')
}

const handleRight = () => {
  emit('right-click')
  emit('confirm')
}
</script>

<style lang="less">
.fixed-bottom-bar {
  &.is-transparent {
    background-color: transparent !important;
    background: linear-gradient(0deg, @bg-color-blue-1 80%, fade(@bg-color-blue-1, 0%) 100%) !important;
    box-shadow: none;
    border-radius: 0;
  }

  .btn-primary,
  .btn-secondary {
    height: 104px !important;
    line-height: 104px !important;
    font-size: 32px !important;
    font-family: @font-medium !important;
    font-weight: bold !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
}
</style>

