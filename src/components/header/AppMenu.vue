<script setup>
import { useRoute } from 'vue-router'
import AjustesInicioSesionComponent from './AjustesInicioSesionComponent.vue'
import BuscadorComponent from './BuscadorComponent.vue'

const route = useRoute()
</script>

<template>
  <div class="logo-container">
    <!-- Logo para escritorio -->
    <img
      :src="'/src/assets/img/logo.png'"
      alt="Logo"
      class="logo logo-desktop"
      @click="$router.push('/')"
    />
    <!-- Logo para móvil (icono) -->
    <img :src="'/icono.png'" alt="Logo" class="logo logo-mobile" @click="$router.push('/')" />
  </div>
  <div class="searchBar" v-if="route.path === '/'">
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
  cursor: pointer;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-desktop {
  width: 150px;
  height: 75px;
  object-fit: contain;
}

.logo-mobile {
  display: none; /* Oculto por defecto */
}

.searchBar {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

@media (max-width: 950px) {
  .logo-desktop {
    display: none; /* Ocultar versión completa en móvil */
  }

  .logo-mobile {
    display: block; /* Mostrar icono en móvil */
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .searchBar {
    flex: 1;
    padding: 0 8px;
    margin: 0;
    display: flex;
    justify-content: center;
  }
}
</style>
