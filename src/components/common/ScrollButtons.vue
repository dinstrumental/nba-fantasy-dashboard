<script setup>
import { useScroll } from '@/composables/useScroll'

const { scrollToTop, scrollToPlayoffs } = useScroll()
</script>

<template>
  <button class="scroll-button" @click="scrollToTop" title="Scroll to top">
    <svg viewBox="0 0 24 24">
      <path
        d="M5 15L12 9L19 15"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <button
    class="scroll-button scroll-button--bottom"
    @click="scrollToPlayoffs"
    title="Scroll to playoffs"
  >
    <svg viewBox="0 0 24 24">
      <path d="M19 9L12 15L5 9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
