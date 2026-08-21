<template>
  <div class="portal-success-result" :class="{ 'is-green': theme === 'green' }">
    <div class="portal-success-result__status-card">
      <div class="portal-success-result__status-header">
        <div class="portal-success-result__icon">
          <img class="portal-success-result__icon-img" mode="aspectFit" :src="icon || defaultSuccessIcon" alt="成功" />
        </div>
        <h2 class="portal-success-result__title">{{ title }}</h2>
        <p class="portal-success-result__desc">{{ desc }}</p>
      </div>
    </div>

    <div class="portal-success-result__details-card">
      <div
        v-for="(row, index) in rows"
        :key="row.label"
        class="portal-success-result__row"
        :class="{ 'no-border': index === rows.length - 1 }"
      >
        <span class="portal-success-result__row-key">{{ row.label }}</span>
        <span
          class="portal-success-result__row-val"
          :class="{ 'is-highlight': row.highlight, 'is-status': row.status }"
        >
          {{ row.value }}
        </span>
      </div>
    </div>

    <PortalDoubleButton
      class="portal-success-result__actions"
      :class="{ 'is-inline': inlineActions }"
      :left-text="leftText"
      :right-text="rightText"
      @cancel="$emit('cancel')"
      @confirm="$emit('confirm')"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'PortalSuccessResult',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
import PortalDoubleButton from '@/components/PortalDoubleButton/index.vue'
import defaultSuccessIcon from '@/assets/images/结算缴费/pay-success.png'
import './index.less'

interface PortalSuccessResultRow {
  label: string
  value: string | number
  highlight?: boolean
  status?: boolean
}

withDefaults(defineProps<{
  title?: string
  desc?: string
  rows: PortalSuccessResultRow[]
  icon?: string
  leftText?: string
  rightText?: string
  theme?: 'default' | 'green'
  inlineActions?: boolean
}>(), {
  title: '操作成功',
  desc: '操作已完成',
  icon: '',
  leftText: '返回首页',
  rightText: '查看详情',
  theme: 'default',
  inlineActions: false
})

defineEmits(['cancel', 'confirm'])
</script>
