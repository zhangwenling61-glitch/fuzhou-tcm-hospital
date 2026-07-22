<template>
  <section :class="['yh-secondary-card', { 'is-focused': isCardFocused }]">
    <slot></slot>
  </section>
</template>

<script lang="ts">
export default {
  name: 'PortalFormCard',
  options: {
    addGlobalClass: true
  }
}
</script>

<script setup lang="ts">
import { ref, provide } from 'vue'

const isCardFocused = ref(false)

provide('formCardState', {
  setFocused: (val: boolean) => {
    isCardFocused.value = val
  }
})
</script>
