<script setup>
import { ref, onMounted } from 'vue';

import { onClickOutside } from '@vueuse/core';
import { useusuarioStore } from '@/stores/usuario';

const usuarioStore = useusuarioStore();
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
  <div ref="dropdownRef" class="auth-container">
    <!-- Si NO está autenticado -->
    <div v-if="!usuarioStore.datos && !usuarioStore.cargando" class="auth-link">
      <router-link to="/login">Iniciar Sesión</router-link>
    </div>

    <!-- Si SÍ está autenticado -->
    <div v-else-if="usuarioStore.datos" class="user-dropdown" @click="toggleDropdown">
      <span>{{ usuarioStore.datos.NombreCompleto }}</span>
      
      <div v-if="showDropdown" class="dropdown-menu">
        <h2>Mi cuenta</h2>
        <ul>
          <li>
            <router-link to="/profile">
              <span>👤</span> Perfil
            </router-link>
          </li>
          <li>
            <router-link to="/favoritos">
              <span>❤️</span> Favoritos
            </router-link>
          </li>
          <li>
            <router-link to="/mensajes">
              <span>💬</span> Mensajes
            </router-link>
          </li>
          <li>
            <router-link to="/reservas">
              <span>🧾</span> Mis compras
            </router-link>
          </li>
          <li>
            <a href="#" @click.prevent="logout">
              <span>🚪</span> Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mientras carga -->
    <div v-else class="auth-loading">
      ...
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  position: relative;
  display: inline-block;
}

.auth-link a {
  color: #2b4ea2;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f9ff;
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
  min-width: 220px;
  z-index: 100;
  margin-top: 8px;
  padding: 12px;
  overflow: hidden;
}

.dropdown-menu h2 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #2b4ea2;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  margin: 6px 0;
}

.dropdown-menu a,
.dropdown-menu router-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #2b4ea2;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}

.dropdown-menu a:hover,
.dropdown-menu router-link:hover {
  background: #f0f6ff;
}

.auth-loading {
  padding: 8px 12px;
  color: #888;
}
</style>