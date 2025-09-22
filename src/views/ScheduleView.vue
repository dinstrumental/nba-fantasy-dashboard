<script setup>
import { onMounted } from 'vue'
import { useScheduleStore } from '@/stores/scheduleStore'
import SeasonTotal from '@/components/schedule/SeasonTotal.vue'
import WeekCard from '@/components/schedule/WeekCard.vue'

const scheduleStore = useScheduleStore()

onMounted(() => {
  scheduleStore.generateSchedule()
})
</script>

<template>
  <div class="container">
    <div v-if="scheduleStore.isLoading" class="loading">
      Calculating schedule and active slot optimization...
    </div>

    <div v-else-if="scheduleStore.error" class="error">
      Failed to load schedule: {{ scheduleStore.error }}
    </div>

    <div v-else class="fantasy-schedule">
      <SeasonTotal :total-games="scheduleStore.totalSeasonGames" />
      <WeekCard v-for="week in scheduleStore.weeksData" :key="week.weekNum" :week="week" />
    </div>
  </div>
</template>

<style scoped>
.loading,
.error {
  margin: 60px 0;
  text-align: center;
  font-size: 24px;
}
.error {
  color: #c62828;
}
</style>
