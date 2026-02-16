<script setup>
import { ref, onMounted } from 'vue';

import { onClickOutside } from '@vueuse/core';
import { useusuarioStore } from '@/stores/usuario';
import { useRouter } from 'vue-router';

const usuarioStore = useusuarioStore();

/*const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};*/
console.log(usuarioStore.datosUsuario);
const logout = () => {
  usuarioStore.cerrarSesion();
  //showDropdown.value = false;
};
</script>

<template>
  <div ref="dropdownRef" class="auth-container">
    <div v-if="usuarioStore.cargando" class="auth-loading">
      <span class="spinner"></span>
    </div>
    <template v-else>
      <div v-if="!usuarioStore.datosUsuario" class="auth-link" @click="$router.push('/login')">
        <a>Iniciar Sesión</a>
      </div>

      <div v-else="usuarioStore.datosUsuario" class="user-dropdown" @click="toggleDropdown">
        <strong>{{ usuarioStore.datosUsuario.NombreCompleto }}</strong>
        <img :src="usuarioStore.datosUsuario.FotoPerfilUrl" alt="Foto de perfil" class="foto-perfil" />
      </div>

    </template>

  </div>
</template>

<style scoped>
.auth-loading {
  padding: 8px 12px;
  min-width: 100px;
  /* Evita que el contenedor cambie de tamaño bruscamente */
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-dropdown{
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.foto-perfil {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2b4ea2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>