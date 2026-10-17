<script setup>
import { RouterView } from 'vue-router'
import ScrollButtons from '@/components/common/ScrollButtons.vue'
import MyTeamRoster from '@/components/roster/MyTeamRoster.vue'
</script>

<template>
  <div class="page-container">
    <MyTeamRoster />
    <RouterView />
    <ScrollButtons />
  </div>
</template>
