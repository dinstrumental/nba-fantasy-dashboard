<script setup>
import { RouterView } from 'vue-router'
import ScrollButtons from '@/components/common/ScrollButtons.vue'
</script>

<template>
  <div class="page-container">
    <RouterView />
    <ScrollButtons />
  </div>
</template>
