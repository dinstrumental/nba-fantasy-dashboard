/**
 * Normalizes NBA team tricodes across ESPN and NBA CDN data sources.
 * @param {string} tri
 * @returns {string} Normalized tricode
 */
export function normalizeTricode(tri) {
  if (!tri) return ''
  const map = {
    NOP: 'NO',
    UTAH: 'UTA',
    GSW: 'GS',
    SAS: 'SA',
    NYK: 'NY',
    BKN: 'BK',
    WSH: 'WAS',
  }
  return map[tri] || tri
}

/**
 * Deeply cleans a string for accurate name matching (e.g., Jokić -> jokic, P.J. -> pj).
 * @param {string} str
 * @returns {string} Normalized alphanumeric string
 */
export function cleanName(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Abbreviates full player names (e.g., "Karl-Anthony Towns" -> "K. Towns").
 * @param {string} fullName
 * @returns {string} Shortened name string
 */
export function getShortName(fullName) {
  if (!fullName) return ''
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return fullName
  const firstInitial = parts[0].charAt(0)
  const lastName = parts.slice(1).join(' ')
  return `${firstInitial}. ${lastName}`
}

/**
 * Calculates maximum roster slot utilization using Maximum Bipartite Matching.
 * Active slot layout: [Guard, Forward, Center, UTIL1, UTIL2, UTIL3]
 * @param {Array<Object>} activePlayers
 * @returns {number} Maximum filled active slots count
 */
export function calculateOptimalSlots(activePlayers) {
  const slots = ['G', 'F', 'C', 'UTIL1', 'UTIL2', 'UTIL3']

  function canPlace(player, slot) {
    if (slot === 'G') return player.positions.includes('G')
    if (slot === 'F') return player.positions.includes('F')
    if (slot === 'C') return player.positions.includes('C')
    return true
  }

  const slotMatch = {}

  function findMatching(playerIdx, visitedSlots) {
    const player = activePlayers[playerIdx]
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]
      if (canPlace(player, slot) && !visitedSlots[i]) {
        visitedSlots[i] = true
        if (slotMatch[i] === undefined || findMatching(slotMatch[i], visitedSlots)) {
          slotMatch[i] = playerIdx
          return true
        }
      }
    }
    return false
  }

  let filledCount = 0
  for (let p = 0; p < activePlayers.length; p++) {
    const visitedSlots = new Array(slots.length).fill(false)
    if (findMatching(p, visitedSlots)) {
      filledCount++
    }
  }

  return filledCount
}

/**
 * Assigns team tricodes to players based on ESPN team rosters.
 * @param {Array<Object>} playersArray
 * @param {Array<Object>} teamsData
 */
export function assignTricodes(playersArray, teamsData) {
  playersArray.forEach((player) => {
    const cleanSearchName = cleanName(player.name)
    let foundTeam = teamsData.find((t) =>
      t.roster.some((rName) => cleanName(rName) === cleanSearchName),
    )

    if (!foundTeam) {
      foundTeam = teamsData.find((t) =>
        t.roster.some((rName) => {
          const cleanRosterName = cleanName(rName)
          return (
            cleanRosterName.length > 4 &&
            (cleanRosterName.includes(cleanSearchName) || cleanSearchName.includes(cleanRosterName))
          )
        }),
      )
    }

    if (foundTeam) {
      player.tricode = foundTeam.tricode
    } else {
      console.warn(`⚠️ Player "${player.name}" not found in ESPN rosters.`)
    }
  })
}
