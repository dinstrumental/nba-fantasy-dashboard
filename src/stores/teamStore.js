import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initialMyTeam, initialOpponents } from '@/utils/mockTeams'

export const useTeamStore = defineStore('team', () => {
  const myTeam = ref(initialMyTeam)
  const opponents = ref(initialOpponents)

  function updateMyTeam(newRoster) {
    myTeam.value = newRoster
  }

  return { myTeam, opponents, updateMyTeam }
})
