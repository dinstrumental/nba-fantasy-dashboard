import { normalizeTricode } from './fantasyMath'

/**
 * Fetches full NBA season schedule from NBA CDN.
 */
export async function fetchLeagueSchedule() {
  const response = await fetch('/nba-cdn/static/json/staticData/scheduleLeagueV2.json')
  const data = await response.json()
  return data.leagueSchedule.gameDates
}

/**
 * Extracts player names from ESPN team objects handling nested position groups.
 */
function extractPlayerNames(teamData) {
  const athletes = teamData.team.athletes || []
  const names = []

  athletes.forEach((item) => {
    if (item.items && Array.isArray(item.items)) {
      item.items.forEach((p) => {
        if (p.fullName) names.push(p.fullName)
        else if (p.displayName) names.push(p.displayName)
      })
    } else if (item.fullName) {
      names.push(item.fullName)
    }
  })

  return names
}

/**
 * Fetches all NBA teams and their rosters sequentially from ESPN API.
 */
export async function fetchTeamsAndRosters() {
  const response = await fetch('/espn-api/apis/site/v2/sports/basketball/nba/teams')
  const data = await response.json()
  const teamsList = data.sports[0].leagues[0].teams.map((t) => t.team)
  const teamsWithRosters = []

  for (const team of teamsList) {
    try {
      const teamRes = await fetch(
        `/espn-api/apis/site/v2/sports/basketball/nba/teams/${team.id}?enable=roster`,
      )
      if (!teamRes.ok) throw new Error(`HTTP error: ${teamRes.status}`)
      const teamData = await teamRes.json()
      if (!teamData || !teamData.team) throw new Error('Missing team payload')

      teamsWithRosters.push({
        id: teamData.team.id,
        name: teamData.team.displayName,
        tricode: normalizeTricode(teamData.team.abbreviation),
        roster: extractPlayerNames(teamData),
      })
    } catch (error) {
      console.warn(`⚠️ Failed to load roster for team ${team.abbreviation || team.id}:`, error)
      teamsWithRosters.push({
        id: team.id,
        name: team.displayName || 'Unknown',
        tricode: normalizeTricode(team.abbreviation),
        roster: [],
      })
    }
  }

  return teamsWithRosters
}
