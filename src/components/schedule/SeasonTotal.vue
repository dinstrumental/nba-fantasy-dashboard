<script setup>
defineProps({
  totalGames: { type: Number, required: true },
})
</script>

<template>
  <div class="season-total">
    <h2 class="season-total__title">
      Rest of season total: <span>{{ totalGames }}</span>
    </h2>
  </div>
</template>
