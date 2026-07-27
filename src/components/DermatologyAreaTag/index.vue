<template>
  <view :class="['dermatology-area-tag', { 'is-wusibei': isWusibei }]">
    <image :src="isWusibei ? mapPinOrangeIcon : mapPinGreenIcon" mode="aspectFit" />
    <text>{{ area }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import mapPinGreenIcon from '@/pages/dermatology/orders/map-pin-green.svg'
import mapPinOrangeIcon from '@/pages/dermatology/orders/map-pin-orange.svg'

const props = defineProps<{ area: string }>()
const isWusibei = computed(() => props.area.includes('五四北'))
</script>

<style lang="less">
.dermatology-area-tag {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-radius: 16px;
  box-sizing: border-box;
  background: #eaf7ef;
  color: #147b49;
}

.dermatology-area-tag.is-wusibei {
  background: #fff1df;
  color: #c36a12;
}

.dermatology-area-tag image {
  width: 24px;
  height: 24px;
  flex: none;
}

.dermatology-area-tag text {
  color: inherit;
  font-size: 23px;
  font-weight: 600;
  line-height: 32px;
  white-space: nowrap;
}
</style>
