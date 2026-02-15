<!-- components/AuthStatus.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useUsuarioStore } from '@/stores/usuario';
import { onClickOutside } from '@vueuse/core';

const usuarioStore = useUsuarioStore();
const showDropdown = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});

onMounted(() => {
  usuarioStore.cargarUsuario();
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = () => {
  usuarioStore.cerrarSesion();
  showDropdown.value = false;
};
</script>

<template>
  <div v-if="usuarioStore.cargando" class="auth-loading">...</div>

  <div v-else ref="dropdownRef" class="auth-container">
    <!-- Si NO está autenticado -->
    <div v-if="!usuarioStore.datos" class="auth-link">
      <router-link to="/login">Iniciar Sesión</router-link>
    </div>

    <!-- Si SÍ está autenticado -->
    <div v-else class="user-dropdown" @click="toggleDropdown">
      <span>{{ usuarioStore.datos.NombreCompleto }}</span>
      <div v-if="showDropdown" class="dropdown-menu">
        <router-link to="/profile">Perfil</router-link>
        <a href="#" @click.prevent="logout">Cerrar sesión</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  position: relative;
  display: inline-block;
}

.user-dropdown {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f9ff;
  color: #2b4ea2;
  font-weight: 500;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d6e4ff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 60, 160, 0.12);
  min-width: 160px;
  z-index: 100;
  margin-top: 8px;
  overflow: hidden;
}

.dropdown-menu a,
.dropdown-menu router-link {
  display: block;
  padding: 10px 16px;
  color: #2b4ea2;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-menu a:hover,
.dropdown-menu router-link:hover {
  background: #f0f6ff;
}

.auth-link a {
  color: #2b4ea2;
  text-decoration: none;
  font-weight: 500;
}
</style>