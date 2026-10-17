<script setup>
import { computed } from 'vue'
import { useTeamStore } from '@/stores/teamStore'

const teamStore = useTeamStore()
const myPlayers = computed(() => teamStore.myTeam)

const getShortName = (fullName) => {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0]
  const firstNameInitial = parts[0].charAt(0) + '.'
  const lastName = parts.slice(1).join(' ')
  return `${firstNameInitial} ${lastName}`
}

const getInitials = (fullName) => {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// New feature for generating NBA CDN links
const getAvatarUrl = (personId) => {
  if (!personId) return null
  return `https://cdn.nba.com/headshots/nba/latest/260x190/${personId}.png`
}

// Photo upload error handling feature (e.g., if a player doesn't have a photo yet)
const onImageError = (e) => {
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex' // Show initials
}
</script>

<template>
  <div class="container">
    <div class="roster-panel" v-if="myPlayers.length > 0">
      <h2 class="roster-panel__title">My Team</h2>
      <div class="roster-list">
        <div v-for="player in myPlayers" :key="player.name" class="roster-card">
          <div class="roster-card__avatar">
            <!-- Try to uplaod photo from CDN -->
            <img
              v-if="player.personId"
              :src="getAvatarUrl(player.personId)"
              :alt="player.name"
              @error="onImageError"
            />
            <!-- Initials placeholder (displayed if personId is missing or the photo fails to load) -->
            <span
              class="roster-card__initials"
              :style="{ display: player.personId ? 'none' : 'flex' }"
            >
              {{ getInitials(player.name) }}
            </span>
          </div>
          <div class="roster-card__name" :title="player.name">
            {{ getShortName(player.name) }}
          </div>
          <div class="roster-card__positions">
            <span v-for="pos in player.positions" :key="pos" class="pos-badge">
              {{ pos }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roster-panel {
  margin-bottom: 40px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .roster-panel {
    margin-bottom: 30px;
  }
}

.roster-panel__title {
  font-size: var(--font-size-h2);
  font-weight: var(--title-font-weight);
  margin-bottom: 20px;
  text-align: center;
}

@media (max-width: 767px) {
  .roster-panel__title {
    font-size: 25px;
  }
}

.roster-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.roster-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.roster-card__avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #fff;
  overflow: hidden;
}
.roster-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.roster-card__initials {
  font-weight: 700;
  font-size: 20px;
  color: #475569;
}

.roster-card__name {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

@media (max-width: 767px) {
  .roster-card__name {
    font-size: 14px;
  }
}

.roster-card__positions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.pos-badge {
  font-size: 11px;
  font-weight: 700;
  background-color: var(--color-black);
  color: var(--color-white);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
