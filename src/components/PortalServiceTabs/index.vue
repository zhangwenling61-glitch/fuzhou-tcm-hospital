<template>
  <div class="portal-service-tabs">
    <button
      v-for="(tab, index) in normalizedTabs"
      :key="tab.key"
      :class="['portal-service-tabs__item', { 'is-active': isActive(tab.value, index) }]"
      type="button"
      @tap="handleSelect(tab, index)"
    ><span>{{ tab.label }}</span><div class="portal-service-tabs__mark yh-portal-title-mark"></div></button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import './index.less'

interface ServiceTabObject {
  title?: string
  label?: string
  value?: string | number
  [key: string]: any
}

type ServiceTab = string | ServiceTabObject

interface NormalizedServiceTab {
  key: string
  label: string
  value: string | number
  raw: ServiceTab
}

const props = withDefaults(defineProps<{
  tabs: ServiceTab[]
  modelValue?: string | number
}>(), {
  tabs: () => [],
  modelValue: 0
})

const emit = defineEmits(['update:modelValue', 'change'])

const normalizedTabs = computed((): NormalizedServiceTab[] => {
  return props.tabs.map((item, index) => {
    if (typeof item === 'string') {
      return {
        key: `${index}-${item}`,
        label: item,
        value: index,
        raw: item
      }
    }

    const value = item.value ?? index
    const label = item.title || item.label || String(value)

    return {
      key: `${index}-${value}`,
      label,
      value,
      raw: item
    }
  })
})

const isActive = (value: string | number, index: number) => {
  return props.modelValue === value || props.modelValue === index
}

const handleSelect = (tab: NormalizedServiceTab, index: number) => {
  emit('update:modelValue', tab.value)
  emit('change', {
    value: tab.value,
    index,
    item: tab.raw
  })
}
</script>
