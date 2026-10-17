<script setup>
import { RouterView } from 'vue-router'
import ScrollButtons from '@/components/common/ScrollButtons.vue'
import MyTeamRoster from '@/components/roster/MyTeamRoster.vue'
import BasketballLoader from '@/components/common/BasketballLoader.vue'
</script>

<template>
  <BasketballLoader />

  <div class="page-container">
    <MyTeamRoster />
    <RouterView />
    <ScrollButtons />
  </div>
</template>
