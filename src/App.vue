<script setup>
import { useRoute } from 'vue-router'
import AppMenu from './components/header/AppMenu.vue'
import { useusuarioStore } from './stores/usuario'
import { onMounted } from 'vue'
import FooterComponent from './components/FooterComponent.vue'
const route = useRoute()

const usuarioStore = useusuarioStore()

const rutasSinHeader = ['/login', '/registro', '/restablecer-contraseña']

onMounted(async () => {
  if (!usuarioStore.datosUsuario) {
    await usuarioStore.cargarUsuario()
  }
})
</script>

<template>
  <header v-if="!rutasSinHeader.includes(route.path)">
    <AppMenu />
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer v-if="!rutasSinHeader.includes(route.path)">
    <FooterComponent />
  </footer>
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
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
