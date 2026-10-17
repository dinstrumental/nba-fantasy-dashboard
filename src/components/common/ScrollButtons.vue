<script setup>
import { useScroll } from '@/composables/useScroll'
import { useTeamStore } from '@/stores/teamStore'
import { useScheduleStore } from '@/stores/scheduleStore'

const { scrollToTop, scrollToPlayoffs } = useScroll()
const teamStore = useTeamStore()
const scheduleStore = useScheduleStore()
</script>

<template>
  <Transition name="fade-slow">
    <div v-if="teamStore.isAppLoaded && !scheduleStore.isLoading" class="scroll-buttons-container">
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
          <path
            d="M19 9L12 15L5 9"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.5s ease;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}
</style>
