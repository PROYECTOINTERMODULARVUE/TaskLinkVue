<script setup>
import { useRoute } from 'vue-router';
import AppMenu from './components/AppMenu.vue';
const route =useRoute();

</script>

<template>
  <header v-if="route.path !== '/login'">
    <AppMenu />
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 100px;
  background-color: #cce6ff75;
  margin-bottom: 20px;
  gap: 10px;
  border: 1px solid lightgrey;
  border-radius: 20px;
}
</style>
