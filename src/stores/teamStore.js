import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initialMyTeam, initialOpponents } from '@/utils/mockTeams'

export const useTeamStore = defineStore('team', () => {
  const myTeam = ref(initialMyTeam)
  const opponents = ref(initialOpponents)

  const isAppLoaded = ref(false)

  function updateMyTeam(newRoster) {
    myTeam.value = newRoster
  }

  function setAppLoaded(status) {
    isAppLoaded.value = status
  }

  return {
    myTeam,
    opponents,
    isAppLoaded,
    updateMyTeam,
    setAppLoaded,
  }
})
