<!-- components/AuthStatus.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/usuario' // Case sensitive check
// Note: The file view showed 'useUsuarioStore' import but store definition exported 'useusuarioStore'.
// I will start by importing what was there effectively or what matches the file content.
// Looking at store file: `export const useusuarioStore = defineStore('usuario', ...)`
// So I should import `useusuarioStore`.
import { useusuarioStore } from '@/stores/usuario'
import { onClickOutside } from '@vueuse/core'

const usuarioStore = useusuarioStore()
const showDropdown = ref(false)
const dropdownRef = ref(null)
const fileInput = ref(null)

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

onMounted(() => {
  usuarioStore.cargarUsuario()
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = async () => {
  await usuarioStore.cerrarSesion()
  showDropdown.value = false
  // Redirect usually happens here or in global guard, assuming reload or router push
  window.location.href = '/'
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // TODO: Implement actual upload logic
    console.log('File selected:', file)
    // usuarioStore.actualizarFotoPerfil(file);
  }
}
</script>

<template>
  <div v-if="usuarioStore.cargando" class="auth-loading">
    <div class="spinner-border text-primary spinner-sm" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>

  <div v-else ref="dropdownRef" class="auth-container">
    <!-- Si NO está autenticado -->
    <div v-if="!usuarioStore.datosUsuario" class="auth-link">
      <router-link to="/login" class="login-btn">Iniciar Sesión</router-link>
    </div>

    <!-- Si SÍ está autenticado -->
    <div v-else class="user-dropdown-wrapper">
      <!-- Trigger: Avatar + Name -->
      <div class="user-trigger" @click="toggleDropdown">
        <img
          :src="usuarioStore.datosUsuario.foto_perfil_url || '/src/assets/img/default-avatar.png'"
          class="profile-icon-mini"
          alt="Perfil"
        />
        <span class="user-name">{{
          usuarioStore.datosUsuario.NombreCompleto || usuarioStore.datosUsuario.name
        }}</span>
      </div>

      <!-- Dropdown Menu -->
      <div v-if="showDropdown" class="dropdown-menu-custom">
        <h2>Mi cuenta</h2>

        <div class="dropdown-user-info">
          <!-- Profile Picture Upload -->
          <div class="profile-upload" @click="triggerFileInput">
            <img
              :src="
                usuarioStore.datosUsuario.foto_perfil_url || '/src/assets/img/default-avatar.png'
              "
              class="profile-dropdown-icon"
              alt="Foto de perfil"
            />
            <div class="edit-overlay"><i class="bi bi-camera"></i></div>
          </div>
          <!-- Hidden Input -->
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />

          <div class="user-greeting">
            <p>
              <strong
                >¡Hola,
                {{
                  usuarioStore.datosUsuario.NombreCompleto || usuarioStore.datosUsuario.name
                }}!</strong
              >
            </p>
          </div>
        </div>

        <div class="divider"></div>

        <ul class="menu-list">
          <li>
            <router-link to="/profile"><span>👤</span> Perfil</router-link>
          </li>
          <li>
            <router-link to="/favoritos"><span>❤️</span> Favoritos</router-link>
          </li>
          <li>
            <router-link to="/mensajes"><span>💬</span> Mensajes</router-link>
          </li>
          <li>
            <router-link to="/mis-compras"><span>🧾</span> Mis compras</router-link>
          </li>

          <!-- Role Logic: idRol != 2 (assuming 2 is Client, or whatever logic user implied 'auth()->user()->idRol != 2') -->
          <li v-if="usuarioStore.datosUsuario.idRol !== 2">
            <router-link to="/servicios/crear"><span>➕🛠️</span> Añadir Servicio</router-link>
          </li>
        </ul>

        <div class="divider"></div>

        <ul class="menu-list">
          <li>
            <router-link to="/ayuda"><span>❓</span> Centro de ayuda</router-link>
          </li>
        </ul>

        <div class="divider"></div>

        <ul class="menu-list">
          <li>
            <a href="#" @click.prevent="logout" class="logout-link">
              <span>➜</span> Cerrar sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  position: relative;
  display: inline-block;
}

.login-btn {
  text-decoration: none;
  color: #2b4ea2;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: background 0.2s;
}
.login-btn:hover {
  background-color: #f0f6ff;
}

/* Trigger Styles */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 24px;
  transition: background 0.2s;
}
.user-trigger:hover {
  background-color: #f5f5f5;
}

.profile-icon-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}
.user-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

/* Dropdown Menu Styles */
.dropdown-menu-custom {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 280px;
  z-index: 1000;
  padding: 20px;
  border: 1px solid #f0f0f0;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu-custom h2 {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #222;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.profile-upload {
  position: relative;
  cursor: pointer;
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.profile-dropdown-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
}
.profile-upload:hover .edit-overlay {
  opacity: 1;
}

.user-greeting {
  text-align: center;
  font-size: 15px;
  color: #333;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

/* Menu List */
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  text-decoration: none;
  color: #444;
  font-size: 14px;
  border-radius: 8px;
  transition: background 0.2s;
}

.menu-list li a:hover {
  background-color: #f5f7fa;
  color: #007bff;
}

.menu-list li a span {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.logout-link {
  color: #d9534f !important;
}
.logout-link:hover {
  background-color: #fff5f5 !important;
  color: #c9302c !important;
}
</style>
