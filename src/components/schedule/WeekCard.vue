<script setup>
import { computed } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import { getShortName } from '@/utils/fantasyMath'
import DayItem from './DayItem.vue'

const props = defineProps({
  week: { type: Object, required: true },
})

const teamStore = useTeamStore()

const currentOpponent = computed(() => {
  return teamStore.opponents.find((opp) => opp.weeks.includes(props.week.weekNum))
})

const formatWeeklyGamesHtml = (playersList, countsObj) => {
  if (!playersList || !countsObj) return ''

  return playersList
    .filter((p) => p.tricode)
    .map((p) => {
      const count = countsObj[p.name] || 0
      const shortName = getShortName(p.name)

      if (count >= 4) {
        return `<span class="summary__high">${shortName} (${count})</span>`
      } else if (count <= 2) {
        return `<span class="summary__low">${shortName} (${count})</span>`
      }

      return `<span>${shortName} (${count})</span>`
    })
    .join(', ')
}
</script>

<template>
  <div class="week" :class="{ 'week--playoffs': week.isPlayoff }">
    <h3 class="week__title">
      Week {{ week.weekNum }}
      <template v-if="week.daysInCurrentWeek === 14">(14 days)</template>
      <span v-if="week.isPlayoff" class="week__tag">🔥 PLAYOFFS</span>
    </h3>

    <ul class="days">
      <DayItem v-for="day in week.days" :key="day.dateStr" :day="day" />
    </ul>

    <div class="summary">
      <span v-html="formatWeeklyGamesHtml(teamStore.myTeam, week.myWeeklyGames)"></span>

      <div class="summary__opponent" v-if="week.hasOpponent && currentOpponent">
        <span v-html="formatWeeklyGamesHtml(currentOpponent.players, week.oppWeeklyGames)"></span>
      </div>
    </div>

    <div class="total">
      <span class="total__team">My team {{ week.weekTotalGames }}</span> :
      <span v-if="week.hasOpponent" class="total__opponent"
        >{{ week.weekOpponentTotalGames }} Opponent</span
      >
    </div>
  </div>
</template>
