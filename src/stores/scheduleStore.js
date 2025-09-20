import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchLeagueSchedule, fetchTeamsAndRosters } from '@/utils/api'
import { assignTricodes, calculateOptimalSlots, normalizeTricode } from '@/utils/fantasyMath'
import { formatDate } from '@/utils/dateUtils'
import { useTeamStore } from './teamStore'

export const useScheduleStore = defineStore('schedule', () => {
  const isLoading = ref(false)
  const error = ref(null)
  const weeksData = ref([])
  const totalSeasonGames = ref(0)

  async function generateSchedule() {
    isLoading.value = true
    error.value = null

    try {
      const teamStore = useTeamStore()
      const [gameDates, teamsData] = await Promise.all([
        fetchLeagueSchedule(),
        fetchTeamsAndRosters(),
      ])

      assignTricodes(teamStore.myTeam, teamsData)
      teamStore.opponents.forEach((opp) => assignTricodes(opp.players, teamsData))

      const gamesByDateMap = {}
      gameDates.forEach((dateObj) => {
        const dateStr = formatDate(new Date(dateObj.gameDate))
        const playingTeams = new Set()

        dateObj.games.forEach((game) => {
          const homeTri = normalizeTricode(game.homeTeam?.teamTricode)
          const awayTri = normalizeTricode(game.awayTeam?.teamTricode)
          if (homeTri) playingTeams.add(homeTri)
          if (awayTri) playingTeams.add(awayTri)
        })

        gamesByDateMap[dateStr] = playingTeams
      })

      const startDate = new Date(2026, 9, 19)
      const endDate = new Date(2027, 3, 4)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const mergedWeekStarts = new Set(['2026-11-30', '2027-02-15'])

      const computedWeeks = []
      let currentDate = new Date(startDate)
      let weekNum = 1
      let calculatedTotalSeason = 0

      while (currentDate <= endDate) {
        const currentWeekStartStr = formatDate(currentDate)
        const daysInCurrentWeek = mergedWeekStarts.has(currentWeekStartStr) ? 14 : 7
        let weekTotalGames = 0
        let weekOpponentTotalGames = 0

        const myWeeklyGames = {}
        const oppWeeklyGames = {}
        const daysList = []

        const currentOpponent = teamStore.opponents.find((opp) => opp.weeks.includes(weekNum))

        for (let dayNum = 1; dayNum <= daysInCurrentWeek; dayNum++) {
          const dateStr = formatDate(currentDate)
          const checkDate = new Date(currentDate)
          checkDate.setHours(0, 0, 0, 0)
          const isPast = checkDate < today

          const playingTeamsToday = gamesByDateMap[dateStr] || new Set()

          const activePlayersToday = teamStore.myTeam.filter(
            (p) => p.tricode && playingTeamsToday.has(p.tricode),
          )
          const activeCount = activePlayersToday.length
          const finalCount = calculateOptimalSlots(activePlayersToday)

          if (!isPast) weekTotalGames += finalCount

          activePlayersToday.forEach((p) => {
            myWeeklyGames[p.name] = (myWeeklyGames[p.name] || 0) + 1
          })

          let activeOppPlayersToday = []
          let oppFinalCount = 0

          if (currentOpponent) {
            activeOppPlayersToday = currentOpponent.players.filter(
              (p) => p.tricode && playingTeamsToday.has(p.tricode),
            )
            oppFinalCount = calculateOptimalSlots(activeOppPlayersToday)

            if (!isPast) weekOpponentTotalGames += oppFinalCount

            activeOppPlayersToday.forEach((p) => {
              oppWeeklyGames[p.name] = (oppWeeklyGames[p.name] || 0) + 1
            })
          }

          const overflowCount = activeCount > finalCount ? activeCount - finalCount : 0

          daysList.push({
            dayNum,
            dateStr,
            isPast,
            activeCount,
            finalCount,
            overflowCount,
            activePlayersToday,
            activeOppPlayersToday,
            oppFinalCount,
          })

          currentDate.setDate(currentDate.getDate() + 1)
        }

        calculatedTotalSeason += weekTotalGames

        computedWeeks.push({
          weekNum,
          daysInCurrentWeek,
          weekTotalGames,
          weekOpponentTotalGames,
          hasOpponent: !!currentOpponent,
          days: daysList,
          myWeeklyGames,
          oppWeeklyGames,
          isPlayoff: false,
        })

        weekNum++
      }

      const PLAYOFF_WEEKS_COUNT = 3
      for (
        let i = Math.max(0, computedWeeks.length - PLAYOFF_WEEKS_COUNT);
        i < computedWeeks.length;
        i++
      ) {
        computedWeeks[i].isPlayoff = true
      }

      weeksData.value = computedWeeks
      totalSeasonGames.value = calculatedTotalSeason
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, weeksData, totalSeasonGames, generateSchedule }
})
