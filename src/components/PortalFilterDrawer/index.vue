<template>
  <PortalActionSheet
    :show="show"
    :title="title"
    show-close
    :show-cancel-button="false"
    :sheet-class="['custom-filter-drawer', sheetClass].join(' ')"
    @update:show="$emit('update:show', $event)"
  >
    <div class="premium-action-sheet-custom-body filter-drawer-body">
      <div
        v-for="field in fields"
        :key="field.key"
        class="filter-section"
      >
        <span class="filter-section-title">{{ field.label }}</span>

        <!-- Date Range Selector -->
        <template v-if="field.type === 'date-range'">
          <div class="date-range-field">
            <picker mode="date" :value="localForm.startDate" @change="onStartDateChange">
              <div class="date-range-field__date">{{ normalizeDate(localForm.startDate) || '开始日期' }}</div>
            </picker>
            <span class="date-range-field__divider">至</span>
            <picker mode="date" :value="localForm.endDate" @change="onEndDateChange">
              <div class="date-range-field__date is-right">{{ normalizeDate(localForm.endDate) || '结束日期' }}</div>
            </picker>
          </div>
          <div class="filter-options-grid is-time-options">
            <view
              v-for="chip in (field.timeChips || DEFAULT_TIME_CHIPS)"
              :key="chip.value"
              class="filter-option-btn"
              :class="{ 'is-selected': localForm.timeChip === chip.value }"
              hover-class="filter-option-btn--hover"
              @click="selectTimeChip(chip.value)"
            >
              {{ chip.label }}
            </view>
          </div>
        </template>

        <!-- Grid Options Selector -->
        <template v-else-if="field.type === 'options'">
          <div
            class="filter-options-grid"
            :style="field.cols ? { gridTemplateColumns: `repeat(${field.cols}, 1fr)` } : {}"
          >
            <view
              v-for="opt in field.options"
              :key="opt"
              class="filter-option-btn"
              :class="{ 'is-selected': localForm[field.key] === opt }"
              hover-class="filter-option-btn--hover"
              @click="localForm[field.key] = opt"
            >
              {{ opt }}
            </view>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="premium-action-sheet-footer">
        <button class="premium-action-sheet-footer-btn is-cancel" hover-class="premium-action-sheet-footer-btn--hover" type="button" @click="resetFilterForm">重置</button>
        <button class="premium-action-sheet-footer-btn is-confirm" hover-class="premium-action-sheet-footer-btn--hover" type="button" @click="confirmFilter">确认</button>
      </div>
    </template>
  </PortalActionSheet>
</template>

<script lang="ts">
export default {
  name: 'PortalFilterDrawer',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Taro from '@tarojs/taro'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'

interface FilterField {
  key: string
  label: string
  type: 'date-range' | 'options'
  options?: string[]
  cols?: number
  timeChips?: { label: string; value: string }[]
}

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  sheetClass?: string
  fields: FilterField[]
  modelValue: Record<string, any>
}>(), {
  title: '查询条件',
  sheetClass: '',
  fields: () => []
})

const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'confirm', val: Record<string, any>): void
}>()

const DEFAULT_TIME_CHIPS = [
  { label: '近一月', value: '1month' },
  { label: '近三月', value: '3months' },
  { label: '半年', value: '6months' },
  { label: '全部', value: 'all' }
]

const localForm = ref<Record<string, any>>({})

function formatDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDatesForChip(value: string) {
  if (!value || value === 'all') {
    return { startDate: '', endDate: '' }
  }
  const anchor = new Date()
  const endStr = formatDate(anchor)
  const start = new Date()

  if (value === '1month') {
    start.setMonth(anchor.getMonth() - 1)
  } else if (value === '3months') {
    start.setMonth(anchor.getMonth() - 3)
  } else if (value === '6months') {
    start.setMonth(anchor.getMonth() - 6)
  } else if (value === '1year') {
    start.setFullYear(anchor.getFullYear() - 1)
  }

  return {
    startDate: formatDate(start),
    endDate: endStr
  }
}

// Sync model values to draft state when drawer opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    localForm.value = { ...props.modelValue }
    // If a timeChip is active but dates are empty, populate them for visual synchronization
    if (localForm.value.timeChip && localForm.value.timeChip !== 'all' && (!localForm.value.startDate || !localForm.value.endDate)) {
      const { startDate, endDate } = getDatesForChip(localForm.value.timeChip)
      localForm.value.startDate = startDate
      localForm.value.endDate = endDate
    }
  }
}, { immediate: true })

function selectTimeChip(value: string) {
  localForm.value.timeChip = value
  const { startDate, endDate } = getDatesForChip(value)
  localForm.value.startDate = startDate
  localForm.value.endDate = endDate
}

function onStartDateChange(e: any) {
  localForm.value.startDate = e.detail.value
  localForm.value.timeChip = '' // Clear quick chip selection
}

function onEndDateChange(e: any) {
  localForm.value.endDate = e.detail.value
  localForm.value.timeChip = '' // Clear quick chip selection
}

function normalizeDate(date?: string): string {
  if (!date) return ''
  return date.replace(/-/g, '/')
}

function resetFilterForm() {
  const defaultChip = '3months'
  const { startDate, endDate } = getDatesForChip(defaultChip)
  localForm.value = {
    startDate,
    endDate,
    timeChip: defaultChip
  }
  props.fields.forEach(field => {
    if (field.type === 'options') {
      localForm.value[field.key] = '全部'
    }
  })
}

function confirmFilter() {
  emit('update:modelValue', { ...localForm.value })
  emit('confirm', { ...localForm.value })
  emit('update:show', false)
}
</script>

<style lang="less">
@import "@/assets/less/variables.less";

/* 筛选抽屉自定义布局 */
.custom-filter-drawer {
  background: linear-gradient(180deg, @bg-color-blue-1 0%, @bg-color-blue-2 100%) !important;
  border-top: 2px solid @white !important;
  border-left: 2px solid @white !important;
  border-right: 2px solid @white !important;
  border-radius: 60px 60px 0 0 !important;
  box-shadow: 0 -8px 32px rgba(161, 202, 251, 0.4) !important;

  .premium-action-sheet-close {
    top: 8px !important;
  }

  .premium-action-sheet-body {
    max-height: 720px !important; /* Expanded height to fit sections on normal screens */
    -webkit-mask-image: none !important; /* Remove fade-out mask to keep text fully clear */
    mask-image: none !important;
    padding-bottom: 16px !important; /* Minor padding since footer follows naturally in flow */
  }
}

.filter-drawer-body {
  padding-bottom: 16px !important; /* Spacing for bottom floating bar button */
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  + .filter-section {
    margin-top: 32px;
  }
}

.filter-section-title {
  color: @text-color;
  font-family: @font-medium;
  font-size: 28px;
  font-weight: 500;
  line-height: 40px;
}

.date-range-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 116px;
  padding: 0 40px;
  box-sizing: border-box;
  border: 2px solid #ffffff !important;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.66) !important;
  box-shadow: none !important;

  picker {
    flex: 0 0 220px;
    min-width: 0;
  }
}

.date-range-field__date,
.date-range-field__divider {
  color: @text-color-dark;
  font-family: @font-medium;
  font-size: 32px;
  font-weight: @font-weight-medium;
  line-height: 44px;
}

.date-range-field__date {
  width: 220px;
  text-align: left;

  &.is-right {
    text-align: right;
  }
}

.date-range-field__divider {
  color: @blue;
  text-align: center;
}

.filter-options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px !important;
  width: 100% !important;

  &.is-time-options {
    grid-template-columns: repeat(4, 1fr);
    margin-top: 16px;
  }
}

.filter-option-btn {
  width: 100% !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border: 2px solid #ffffff; /* Match white border style */
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.66); /* Match white/semi-transparent background */
  color: @text-color-dark;
  font-size: 26px;
  font-family: @font-medium;
  box-sizing: border-box;
  transition: all 0.15s ease-out;

  &.is-selected {
    background: #edf5ff !important;
    border-color: #457130 !important;
    color: @blue !important;
  }

  &:active {
    transform: scale(0.97);
  }

  &.filter-option-btn--hover {
    transform: scale(0.97) !important;
  }
}
</style>
