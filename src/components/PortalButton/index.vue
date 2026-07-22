<template>
  <div class="fixed-bottom-bar is-transparent">
    <button
      class="btn-primary"
      :class="{ 'is-disabled': disabled }"
      type="button"
      :style="disabled ? 'pointer-events: auto;' : ''"
      @click="handleClick"
    >
      <slot>{{ text }}</slot>
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalButton',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
  disabled?: boolean
}>(), {
  text: '确认',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style lang="less">
.fixed-bottom-bar {
  &.is-transparent {
    background-color: transparent !important;
    background: linear-gradient(0deg, @bg-color-blue-1 80%, fade(@bg-color-blue-1, 0%) 100%);
    box-shadow: none;
    border-radius: 0;
  }

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
                0 12px 24px rgba(69, 113, 48, 0.25) !important;
    outline: none !important;
    opacity: 1 !important;
  }
}
</style>

