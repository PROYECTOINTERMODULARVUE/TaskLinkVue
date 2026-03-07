<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useusuarioStore } from '@/stores/usuario'

const router = useRouter()
const route = useRoute()
const usuarioStore = useusuarioStore()

onMounted(async () => {
  // Since we are using session-based login, the backend has already set the cookie.
  // We just need to load the user data into the store and redirect home.
  await usuarioStore.cargarUsuario()
  router.push('/')
})
</script>

<template>
  <div class="callback-container">
    <div class="loader"></div>
    <p>Autenticando con Google...</p>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2b4ea2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
