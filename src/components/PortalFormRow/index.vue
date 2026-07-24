<template>
  <!-- 文本/数字输入类型 -->
  <div v-if="type === 'input'" :class="['yh-secondary-row', 'is-input', { 'is-focused': isFocused }]" @click="onClick">
    <span class="yh-secondary-row__label">{{ label }}</span>
    <div style="position: relative; flex: 1 1 auto; display: flex; align-items: center; justify-content: flex-end; width: 100%;">
      <input
        :value="modelValue !== undefined ? modelValue : value"
        class="yh-secondary-row__input"
        :class="{ 'is-disabled': disabled }"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        placeholder-class="yh-secondary-row__input-placeholder"
        :adjust-position="adjustPosition"
        :cursor-spacing="cursorSpacing"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <!-- Transparent click overlay for disabled state to guarantee event bubbling across all mini-program platforms -->
      <div v-if="disabled" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 10; background: rgba(0, 0, 0, 0);" />
    </div>
    <!-- Gorgeous custom center-expanding neon green glowing divider line -->
    <div class="yh-secondary-row__focus-line" />
  </div>

  <!-- 纯展示键值对类型 -->
  <div v-else-if="type === 'key-value'" class="yh-secondary-row is-key-value" @click="onClick">
    <span class="yh-secondary-row__key">{{ label }}</span>
    <span class="yh-secondary-row__val">{{ modelValue !== undefined ? modelValue : value }}</span>
  </div>

  <!-- 下拉选择/动作跳转类型 -->
  <button v-else-if="type === 'select'" class="yh-secondary-row" type="button" @click="onClick">
    <div class="yh-secondary-row__left">
      <span class="yh-secondary-row__text no-icon">{{ label }}</span>
    </div>
    <div v-if="(modelValue !== undefined ? modelValue : value) || placeholder" class="yh-secondary-row__right-content">
      <span v-if="modelValue !== undefined ? modelValue : value" class="yh-secondary-row__right-val">{{ modelValue !== undefined ? modelValue : value }}</span>
      <span v-else class="yh-secondary-row__right-placeholder">{{ placeholder }}</span>
    </div>
    <PortalRowArrow v-if="showArrow" />
  </button>

  <!-- 左右加减步进器类型 -->
  <div v-else-if="type === 'stepper'" class="yh-secondary-row is-stepper">
    <div class="yh-secondary-row__left">
      <span class="yh-secondary-row__text no-icon">{{ label }}</span>
    </div>
    <div class="yh-secondary-row__right-content is-stepper-controls">
      <button
        class="stepper-btn is-minus"
        :class="{ 'is-disabled': Number(modelValue !== undefined ? modelValue : value) <= min || disabled }"
        type="button"
        @click="decrease"
      ></button>
      <span class="stepper-value">{{ modelValue !== undefined ? modelValue : value }}{{ suffix }}</span>
      <button
        class="stepper-btn is-plus"
        :class="{ 'is-disabled': Number(modelValue !== undefined ? modelValue : value) >= max || disabled }"
        type="button"
        @click="increase"
      ></button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalFormRow',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
import { ref, inject } from 'vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'

const formCardState = inject('formCardState', null) as any

const props = withDefaults(defineProps<{
  type?: 'input' | 'key-value' | 'select' | 'stepper'
  label: string
  modelValue?: string | number
  value?: string | number
  placeholder?: string
  disabled?: boolean
  inputType?: string
  showArrow?: boolean
  adjustPosition?: boolean
  cursorSpacing?: number | string
  min?: number
  max?: number
  suffix?: string
}>(), {
  type: 'input',
  modelValue: undefined,
  value: '',
  placeholder: '',
  disabled: false,
  inputType: 'text',
  showArrow: false,
  adjustPosition: true,
  cursorSpacing: 40,
  min: 1,
  max: 99,
  suffix: ''
})

const emit = defineEmits<{(e: 'update:modelValue', val: string | number): void
  (e: 'input', val: string | number): void
  (e: 'click'): void
  (e: 'focus', event: any): void
  (e: 'blur', event: any): void
}>()

const isFocused = ref(false)

const onInput = (e: any) => {
  const val = e.detail.value || e.target.value
  emit('update:modelValue', val)
  emit('input', val)
}

const onFocus = (e: any) => {
  isFocused.value = true
  if (formCardState) {
    formCardState.setFocused(true)
  }
  emit('focus', e)
}

const onBlur = (e: any) => {
  isFocused.value = false
  if (formCardState) {
    formCardState.setFocused(false)
  }
  emit('blur', e)
}

const onClick = () => {
  emit('click')
}

const increase = () => {
  if (props.disabled) return
  const current = Number(props.modelValue !== undefined ? props.modelValue : props.value) || 0
  if (current < props.max) {
    emit('update:modelValue', current + 1)
    emit('input', current + 1)
  }
}

const decrease = () => {
  if (props.disabled) return
  const current = Number(props.modelValue !== undefined ? props.modelValue : props.value) || 0
  if (current > props.min) {
    emit('update:modelValue', current - 1)
    emit('input', current - 1)
  }
}
</script>

<style lang="less">
.yh-secondary-row__text {
  color: @text-color !important;
}

.yh-secondary-row__right-content {
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 8px;
}

.yh-secondary-row__right-val {
  color: @text-color-dark;
  font-family: @font-regular;
  font-size: @font-size-body-md;
  line-height: @line-height-body-md;
}

.yh-secondary-row__right-placeholder {
  color: @text-color-placeholder;
  font-family: @font-regular;
  font-size: @font-size-body-md;
  line-height: @line-height-body-md;
}

.is-stepper-controls {
  flex: 0 0 auto !important;
  gap: 16px !important;
  margin-right: 0 !important;
  justify-content: flex-end !important;
}

.stepper-value {
  font-size: 32px;
  color: #222222;
  font-family: @font-medium;
  font-weight: bold;
  min-width: 48px;
  text-align: center;
}

.stepper-btn {
  position: relative;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #457130;
  border: 0;
  outline: none;
  box-shadow: inset -1px -1px 12px rgba(255, 255, 255, 0.25), inset 3px 3px 8px rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    opacity: 0.8;
    transform: scale(0.9);
  }

  &.is-disabled {
    background: #D8EFE8;
    box-shadow: none;
    pointer-events: none;
    opacity: 0.6;
  }

  &.is-minus::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3C/svg%3E") no-repeat center / contain;
  }

  &.is-plus::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'/%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3C/svg%3E") no-repeat center / contain;
  }
}
</style>
