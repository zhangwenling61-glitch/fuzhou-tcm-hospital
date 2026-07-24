<template>
  <div class="yh-filter-header">
    <div class="yh-filter-header__title">{{ summaryText }}</div>
    <view class="yh-filter-header__btn" hover-class="yh-filter-header__btn--hover" @click="$emit('filter')">
      <span class="filter-icon"></span>
      <text>筛选</text>
    </view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalFilterHeader'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: Record<string, any>
  fields: any[]
  defaultTimeLabel?: string
}>(), {
  defaultTimeLabel: '全部'
})

defineEmits<{
  (e: 'filter'): void
}>()

const DEFAULT_TIME_CHIPS = [
  { label: '近一月', value: '1month' },
  { label: '近三月', value: '3months' },
  { label: '半年', value: '6months' },
  { label: '全部', value: 'all' }
]

const getShortcutLabel = (value: string): string => {
  if (!value) return ''
  const map: Record<string, string> = {
    '1month': '近一月',
    '3months': '近三月',
    'three_months': '近三月',
    '6months': '近半年',
    'half_year': '近半年',
    'one_year': '近一年',
    '1year': '近一年'
  }
  return map[value] || ''
}

const summaryText = computed(() => {
  let timeLabel = ''
  
  const shortcutLabel = getShortcutLabel(props.modelValue.timeChip)
  if (shortcutLabel) {
    timeLabel = shortcutLabel
  } else if (props.modelValue.startDate || props.modelValue.endDate) {
    const start = props.modelValue.startDate ? props.modelValue.startDate.replace(/-/g, '/') : '开始'
    const end = props.modelValue.endDate ? props.modelValue.endDate.replace(/-/g, '/') : '结束'
    timeLabel = `${start}至${end}`
  } else {
    timeLabel = props.defaultTimeLabel
  }

  let summary = timeLabel

  props.fields.forEach(field => {
    if (field.type === 'options') {
      const val = props.modelValue[field.key]
      if (val && val !== '全部') {
        summary += ` · ${val}`
      }
    }
  })

  return summary
})
</script>

<style lang="less">
@import "@/assets/less/variables.less";

.yh-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px;
  margin-bottom: -8px;

  .yh-filter-header__title {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-left: 32px;
    color: @text-color-secondary;
    font-family: @font-regular;
    font-size: 26px;
    font-weight: @font-weight-regular;
    line-height: 36px;
  }

  .yh-filter-header__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 52px;
    padding: 0 20px;
    border: 2px solid #ffffff;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 12px rgba(166, 186, 214, 0.1);
    color: @blue !important;
    font-size: 22px;
    font-family: @font-medium;
    font-weight: 500;
    transition: all 0.15s ease;
    margin: 0;
    outline: none;

    &::after {
      display: none !important;
    }

    &:active {
      background: rgba(255, 255, 255, 0.8);
      transform: scale(0.96);
    }

    &.yh-filter-header__btn--hover {
      background: rgba(255, 255, 255, 0.8) !important;
      transform: scale(0.96) !important;
    }

    .filter-icon {
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 24px 24px;
      background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 3.5H13.5L9.25 8.1V12L6.75 13.1V8.1L2.5 3.5Z' stroke='%233186ff' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E");
    }
  }
}
</style>
