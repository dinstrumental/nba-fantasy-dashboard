<script setup>
import { useTeamStore } from '@/stores/teamStore'
import { getShortName } from '@/utils/fantasyMath'
import DayItem from './DayItem.vue'

const props = defineProps({
  week: { type: Object, required: true },
})

const teamStore = useTeamStore()

function formatSummary(playersList, countsObj) {
  return playersList
    .filter((p) => p.tricode)
    .map((p) => {
      const count = countsObj[p.name] || 0
      let colorClass = ''
      if (count >= 4) colorClass = 'summary__high'
      else if (count <= 2) colorClass = 'summary__low'
      return { name: getShortName(p.name), count, colorClass }
    })
}

const formatWeeklyGames = (gamesObj) => {
  if (!gamesObj) return ''

  return Object.entries(gamesObj)
    .map(([name, count]) => {
      const shortName = getShortName(name)
      return `${shortName} (${count})`
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
      <template
        v-for="(item, idx) in formatSummary(teamStore.myTeam, week.myWeeklyGames)"
        :key="idx"
      >
        <span :class="item.colorClass">{{ item.name }} ({{ item.count }})</span>
        <template v-if="idx < teamStore.myTeam.length - 1">, </template>
      </template>

      <div class="summary__opponent" v-if="week.hasOpponent">
        {{ formatWeeklyGames(week.oppWeeklyGames) }}
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
