<script setup>
import { computed } from 'vue'
import { useTeamStore } from '@/stores/teamStore'
import { getShortName } from '@/utils/fantasyMath'
import { projections } from '@/data/projections'
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

// Function to calculate projected stats for the week
const calculateProjections = (days, isOpponent = false) => {
  const totals = {
    FGM: 0,
    FGA: 0,
    FTM: 0,
    FTA: 0,
    '3PM': 0,
    PTS: 0,
    REB: 0,
    AST: 0,
    STL: 0,
    BLK: 0,
    TO: 0,
  }

  days.forEach((day) => {
    // Get ONLY the players who made it into the active roster for this day
    const activePlayers = isOpponent ? day.activeOppPlayersToday : day.activePlayersToday
    if (!activePlayers) return

    activePlayers.forEach((player) => {
      const stats = projections[player.name]
      if (stats) {
        totals.FGM += stats.FGM || 0
        totals.FGA += stats.FGA || 0
        totals.FTM += stats.FTM || 0
        totals.FTA += stats.FTA || 0
        totals['3PM'] += stats['3PM'] || 0
        totals.PTS += stats.PTS || 0
        totals.REB += stats.REB || 0
        totals.AST += stats.AST || 0
        totals.STL += stats.STL || 0
        totals.BLK += stats.BLK || 0
        totals.TO += stats.TO || 0
      }
    })
  })

  // Calculate true team percentages for the week based on total attempts and makes
  const fgp = totals.FGA > 0 ? totals.FGM / totals.FGA : 0
  const ftp = totals.FTA > 0 ? totals.FTM / totals.FTA : 0

  return {
    fgp: (fgp * 100).toFixed(1) + '%',
    ftp: (ftp * 100).toFixed(1) + '%',
    '3PM': totals['3PM'].toFixed(0), // Rounding totals to whole numbers for cleaner UI
    PTS: totals.PTS.toFixed(0),
    REB: totals.REB.toFixed(0),
    AST: totals.AST.toFixed(0),
    STL: totals.STL.toFixed(0),
    BLK: totals.BLK.toFixed(0),
    TO: totals.TO.toFixed(0),
    // Save raw numbers for mathematical comparison (win/loss calculation)
    raw: { fgp, ftp, ...totals },
  }
}

// Computed properties for the template
const myStats = computed(() => calculateProjections(props.week.days, false))
const oppStats = computed(() =>
  props.week.hasOpponent ? calculateProjections(props.week.days, true) : null,
)

// Function to highlight cells (green = won category, red = lost category)
const getWinClass = (cat, isMyTeam) => {
  if (!oppStats.value) return ''

  let myVal = myStats.value.raw[cat]
  let oppVal = oppStats.value.raw[cat]

  if (myVal === oppVal) return '' // Tie - no color

  // Turnovers (TO) - lower value is better
  const iWin = cat === 'TO' ? myVal < oppVal : myVal > oppVal

  if (isMyTeam) return iWin ? 'stat-win' : 'stat-lose'
  return !iWin ? 'stat-win' : 'stat-lose'
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

    <!-- NEW PROJECTIONS BLOCK -->
    <div class="projections-box">
      <table class="proj-table">
        <thead>
          <tr>
            <th></th>
            <th>FG%</th>
            <th>FT%</th>
            <th>3PM</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>STL</th>
            <th>BLK</th>
            <th>TO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="proj-team-name">My Team</td>
            <td :class="getWinClass('fgp', true)">{{ myStats.fgp }}</td>
            <td :class="getWinClass('ftp', true)">{{ myStats.ftp }}</td>
            <td :class="getWinClass('3PM', true)">{{ myStats['3PM'] }}</td>
            <td :class="getWinClass('PTS', true)">{{ myStats.PTS }}</td>
            <td :class="getWinClass('REB', true)">{{ myStats.REB }}</td>
            <td :class="getWinClass('AST', true)">{{ myStats.AST }}</td>
            <td :class="getWinClass('STL', true)">{{ myStats.STL }}</td>
            <td :class="getWinClass('BLK', true)">{{ myStats.BLK }}</td>
            <td :class="getWinClass('TO', true)">{{ myStats.TO }}</td>
          </tr>
          <tr v-if="week.hasOpponent && oppStats">
            <td class="proj-team-name">Opponent</td>
            <td :class="getWinClass('fgp', false)">{{ oppStats.fgp }}</td>
            <td :class="getWinClass('ftp', false)">{{ oppStats.ftp }}</td>
            <td :class="getWinClass('3PM', false)">{{ oppStats['3PM'] }}</td>
            <td :class="getWinClass('PTS', false)">{{ oppStats.PTS }}</td>
            <td :class="getWinClass('REB', false)">{{ oppStats.REB }}</td>
            <td :class="getWinClass('AST', false)">{{ oppStats.AST }}</td>
            <td :class="getWinClass('STL', false)">{{ oppStats.STL }}</td>
            <td :class="getWinClass('BLK', false)">{{ oppStats.BLK }}</td>
            <td :class="getWinClass('TO', false)">{{ oppStats.TO }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="total">
      <span class="total__team">My team {{ week.weekTotalGames }}</span> :
      <span v-if="week.hasOpponent" class="total__opponent"
        >{{ week.weekOpponentTotalGames }} Opponent</span
      >
    </div>
  </div>
</template>

<style scoped>
.projections-box {
  margin: 20px 0;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.proj-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: center;
}

.proj-table th {
  padding: 8px 4px;
  color: #64748b;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid #e2e8f0;
}

.proj-table td {
  padding: 8px 19px;
  border-bottom: 1px solid #e2e8f0;
}

.proj-table tr:last-child td {
  border-bottom: none;
}

.proj-team-name {
  text-align: left;
  font-weight: 700;
  color: #0f172a;
}

/* Soft, eye-friendly colors for wins and losses */
.stat-win {
  background-color: rgba(34, 197, 94, 0.15); /* Soft green */
  color: #166534;
  font-weight: 700;
  border-radius: 4px;
}

.stat-lose {
  background-color: rgba(239, 68, 68, 0.1); /* Soft red */
  color: #991b1b;
}
</style>
