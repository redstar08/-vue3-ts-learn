<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import AnimateView from './AnimateView.vue'
</script>

<template>
  <main>
    <TheWelcome />
    <div class="w-full h-100px flex flex-col justify-center items-center fixed top-0 left-0">
      <AnimateView />
    </div>
  </main>
</template>
