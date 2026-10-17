<script setup>
import { ref, onMounted } from 'vue'
import { useTeamStore } from '@/stores/teamStore'

const teamStore = useTeamStore()
const isVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
    teamStore.setAppLoaded(true)
  }, 2000)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="basketball-loader">
      <div class="ball">
        <div class="lines"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.basketball-loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-bg);
}

.ball {
  width: 100px;
  height: 100px;
  background-color: #ff6b00;
  border-radius: 50%;
  position: relative;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: spin 2s linear infinite;
}

.ball::before,
.ball::after,
.lines::before,
.lines::after {
  content: '';
  position: absolute;
  border: 4px solid #000;
  border-radius: 50%;
}

.ball::before {
  width: 100%;
  height: 4px;
  background: #000;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border: none;
  border-radius: 0;
}

.ball::after {
  width: 4px;
  height: 100%;
  background: #000;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  border: none;
  border-radius: 0;
}

.lines::before {
  width: 70px;
  height: 100px;
  left: -25px;
  top: -4px;
}

.lines::after {
  width: 70px;
  height: 100px;
  right: -25px;
  top: -4px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>
