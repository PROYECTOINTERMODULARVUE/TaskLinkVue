<script setup>
import AjustesInicioSesionComponent from './AjustesInicioSesionComponent.vue'
import BuscadorComponent from './BuscadorComponent.vue'
</script>

<template>
  <div class="logo-container">
    <img :src="'/src/assets/img/logo.png'" alt="Logo" class="logo" @click="$router.push('/')" />
  </div>
  <div class="searchBar">
    <BuscadorComponent />
  </div>
  <div>
    <AjustesInicioSesionComponent />
  </div>
</template>
<style scoped>
.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 150px;
  height: 75px;
}

.searchBar {
  width: 100%;
  /* Let the component handle max-width */
  display: flex;
  justify-content: center;
  padding: 0 16px;
}
@media (max-width: 600px) {
  .logo-container {
    img {
      width: 60px;
      height: 30px;
    }
  }
  .searchBar {
    padding: 0 12px;
  }
}
</style>
