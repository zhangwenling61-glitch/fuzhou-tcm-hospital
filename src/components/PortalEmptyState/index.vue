<template>
  <div class="portal-empty-state" :class="{ 'is-animated': animated }">
    <div class="portal-empty-state__visual">
      <span
        v-for="item in radarItems"
        :key="item"
        class="portal-empty-state__radar"
        :class="item"
      ></span>

      <div class="portal-empty-state__paper">
        <span
          v-for="item in paperLines"
          :key="item"
          class="portal-empty-state__line"
          :class="item"
        ></span>
      </div>

      <div class="portal-empty-state__card">
        <span
          v-for="item in cardLines"
          :key="item"
          class="portal-empty-state__card-line"
          :class="item"
        ></span>
      </div>
    </div>

    <div class="portal-empty-state__copy">
      <div class="portal-empty-state__title">{{ title }}</div>
      <div class="portal-empty-state__desc">{{ desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './index.less'

withDefaults(defineProps<{
  title?: string
  desc?: string
  animated?: boolean
}>(), {
  title: '暂无数据',
  desc: '这边文案你自己发挥',
  animated: true
})

const radarItems = ['is-one', 'is-two', 'is-three']
const paperLines = ['is-line-1', 'is-line-2', 'is-line-3', 'is-line-4', 'is-line-5']
const cardLines = ['is-card-line-1', 'is-card-line-2']
</script>
