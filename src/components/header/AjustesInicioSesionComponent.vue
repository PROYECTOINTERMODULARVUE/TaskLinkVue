<script setup>
import { ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useusuarioStore } from '@/stores/usuario'
import { useRolStore } from '@/stores/rol' // Import rol store
import { usereservasStore } from '@/stores/reserva'
import { useRouter } from 'vue-router'

const usuarioStore = useusuarioStore()
const rolStore = useRolStore() // Initialize rol store
const reservaStore = usereservasStore()
const router = useRouter() // Ensure router is available
const showDropdown = ref(false)
const dropdownRef = ref(null)
const fileInput = ref(null)

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

onMounted(() => {
  usuarioStore.cargarUsuario()
  reservaStore.fetchReservasRecibidas()
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const logout = async () => {
  await usuarioStore.cerrarSesion()
  showDropdown.value = false
  router.push('/')
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const result = await usuarioStore.actualizarFotoPerfil(file)
    if (!result.success) {
      alert(result.message || 'Error al actualizar la foto de perfil')
    }
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
    <div v-if="!usuarioStore.datosUsuario" class="auth-link">
      <router-link to="/login" class="login-btn">Iniciar Sesión</router-link>
    </div>

    <div v-else class="user-dropdown-wrapper">
      <div class="user-trigger" @click="toggleDropdown">
        <span class="user-name">{{
          usuarioStore.datosUsuario.NombreCompleto || usuarioStore.datosUsuario.name
        }}</span>
        <img
          :src="usuarioStore.datosUsuario.FotoPerfilUrl || '/src/assets/img/default-avatar.png'"
          class="profile-icon-mini"
          alt="Perfil"
        />
      </div>

      <div v-if="showDropdown" class="dropdown-menu-custom">
        <h2>Mi cuenta</h2>

        <div class="dropdown-user-info">
          <div class="profile-upload" @click="triggerFileInput">
            <img
              :src="usuarioStore.datosUsuario.FotoPerfilUrl || '/src/assets/img/default-avatar.png'"
              class="profile-dropdown-icon"
              alt="Foto de perfil"
            />
            <div class="edit-overlay"><i class="bi bi-camera"></i></div>
          </div>
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
            <a @click="$router.push('/perfil')"><span>👤 </span> Perfil</a>
          </li>
          <li>
            <a @click="$router.push('/favoritos')"><span>❤️</span> Favoritos</a>
          </li>
          <li>
            <a @click="$router.push('/mensajes')" class="menu-item-with-badge">
              <div class="menu-item-content"><span>💬</span> Mensajes</div>
              <span v-if="reservaStore.pendientesCount > 0" class="pending-badge">
                {{ reservaStore.pendientesCount }}
              </span>
            </a>
          </li>
          <li>
            <a @click="$router.push('/mis-compras')"><span>🧾</span> Mis compras</a>
          </li>

          <li v-if="rolStore.isAdmin">
            <a @click="$router.push('/admin/configuracion-web')"
              ><span>👥</span> Configuración Web</a
            >
          </li>

          <li v-if="rolStore.canCreateService">
            <a @click="$router.push('/servicios/crear')"><span>➕</span> Añadir Servicio</a>
          </li>
        </ul>

        <div class="divider"></div>

        <ul class="menu-list">
          <li>
            <a @click="$router.push('/ayuda')"><span>❓</span> Centro de ayuda</a>
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
  color: #222;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 14px;
}
.login-btn:hover {
  background-color: #f7f7f7;
  border-color: #222;
}

/* Trigger Styles */
.user-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 24px;
  transition: background 0.2s;
}
.user-trigger:hover {
  background-color: #f5f5f5;
}

.profile-icon-mini {
  width: 80px;
  height: 80px;
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
  cursor: pointer;
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

.menu-item-with-badge {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px !important;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pending-badge {
  background-color: #007bff;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 950px) {
  .user-trigger {
    padding: 2px 4px;
    gap: 4px;
  }
  .user-name {
    display: none;
  }
  .profile-icon-mini {
    width: 32px;
    height: 32px;
  }
  .dropdown-user-info .profile-upload {
    display: none;
  }
  .login-btn {
    padding: 6px 10px;
    font-size: 13px;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
  }
}
</style>
