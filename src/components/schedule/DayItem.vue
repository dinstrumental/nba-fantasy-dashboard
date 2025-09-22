<script setup>
import { computed } from 'vue'
import { getShortName } from '@/utils/fantasyMath'

const props = defineProps({
  day: { type: Object, required: true },
})

const isNoGamesForBoth = computed(() => {
  return props.day.activeCount === 0 && props.day.activeOppPlayersToday.length === 0
})

const myPlayersStr = computed(() => {
  if (props.day.activeCount === 0) return '—'
  return props.day.activePlayersToday
    .map((p) => `${getShortName(p.name)} (${p.positions.join(', ')})`)
    .join(', ')
})

const oppPlayersStr = computed(() => {
  if (!props.day.activeOppPlayersToday.length) return '—'
  return props.day.activeOppPlayersToday
    .map((p) => `${getShortName(p.name)} (${p.positions.join(', ')})`)
    .join(', ')
})
</script>

<template>
  <li
    class="day"
    :class="{
      full: !day.isPast && day.finalCount === 6,
      overflow: !day.isPast && day.overflowCount > 0,
      disabled: day.isPast,
      'no-games': isNoGamesForBoth,
    }"
  >
    <span class="day__label">day {{ day.dayNum }} ({{ day.dateStr }}):</span>

    <template v-if="isNoGamesForBoth">
      <span class="day__no-games">no games!</span>
    </template>

    <template v-else>
      <span class="day__players">
        <span class="day__count">
          [{{ day.finalCount }}]
          <span v-if="day.isPast" class="day__status">✓ played</span>
        </span>
        {{ myPlayersStr }}
        <span v-if="!day.isPast && day.overflowCount > 0" class="day__overflow">
          (+{{ day.overflowCount }} on bench)
        </span>
        <span v-if="day.activeOppPlayersToday.length" class="day__opponent">
          <b>[{{ day.oppFinalCount }}]</b> {{ oppPlayersStr }}
        </span>
      </span>
    </template>
  </li>
</template>
