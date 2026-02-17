<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useusuarioStore } from '@/stores/usuario'

const router = useRouter()
const usuarioStore = useusuarioStore()

const user = ref({
  Nombre: '',
  Apellidos: '',
  email: '',
})

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const loading = ref(false)
const savingInfo = ref(false)
const savingPassword = ref(false)

const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await api.usuarios.getUsuarioActual()
    user.value = {
      Nombre: res.Nombre,
      Apellidos: res.Apellidos,
      email: res.email,
    }
  } catch (error) {
    console.error('Error loading profile', error)
  } finally {
    loading.value = false
  }
}

const updateInfo = async () => {
  savingInfo.value = true
  try {
    await api.usuarios.updateProfile(user.value) // We need to check if this method exists or is 'updateProfile'
    alert('Perfil actualizado correctamente')
  } catch (error) {
    console.error('Error updating profile', error)
    alert('Error al actualizar perfil')
  } finally {
    savingInfo.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    alert('Las contraseñas nuevas no coinciden')
    return
  }

  savingPassword.value = true
  try {
    await api.usuarios.updatePassword({
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
      new_password_confirmation: passwordForm.value.new_password_confirmation,
    })
    alert('Contraseña actualizada correctamente')
    passwordForm.value = { current_password: '', new_password: '', new_password_confirmation: '' }
  } catch (error) {
    console.error('Error updating password', error)
    alert('Error al actualizar contraseña. Verifica tu contraseña actual.')
  } finally {
    savingPassword.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-edit-container">
    <div class="d-flex align-items-center mb-3">
      <router-link to="/perfil" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i> Volver al Perfil
      </router-link>
      <h1 class="page-title mb-0">Editar Perfil</h1>
    </div>

    <div class="forms-grid">
      <!-- Update Info Form -->
      <div class="card">
        <div class="card-header">
          <h2>Información del Perfil</h2>
          <p>Actualiza la información de tu cuenta y dirección de correo electrónico.</p>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateInfo">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="user.Nombre" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Apellidos</label>
              <input v-model="user.Apellidos" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="user.email" type="email" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="savingInfo">
              {{ savingInfo ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Update Password Form -->
      <div class="card">
        <div class="card-header">
          <h2>Actualizar Contraseña</h2>
          <p>
            Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerla
            segura.
          </p>
        </div>
        <div class="card-body">
          <form @submit.prevent="updatePassword">
            <div class="mb-3">
              <label class="form-label">Contraseña Actual</label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nueva Contraseña</label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                class="form-control"
                required
                minlength="8"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Confirmar Nueva Contraseña</label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                class="form-control"
                required
                minlength="8"
              />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="savingPassword">
              {{ savingPassword ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-edit-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

.page-title {
  margin-bottom: 30px;
  font-size: 2rem;
}

.forms-grid {
  display: grid;
  gap: 30px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.card-header h2 {
  font-size: 1.25rem;
  margin: 0 0 5px 0;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.card-body {
  padding: 20px;
}
</style>
