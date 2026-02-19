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
const savedCards = ref([])
const loadingCards = ref(false)
const addingCard = ref(false)
const newCard = ref({
  nombre: '',
  numero: '',
  expiracion: '',
  cvv: '', // Just placeholders for UI
})

const fetchCards = async () => {
  loadingCards.value = true
  try {
    savedCards.value = await api.tarjetas.getAll()
  } catch (error) {
    console.error('Error loading cards', error)
  } finally {
    loadingCards.value = false
  }
}

const deleteCard = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) return
  try {
    await api.tarjetas.delete(id)
    savedCards.value = savedCards.value.filter((c) => c.IDTarjeta !== id)
  } catch (error) {
    console.error('Error deleting card', error)
    alert('Error al eliminar la tarjeta')
  }
}

const saveNewCard = async () => {
  const parts = newCard.value.expiracion.split('/')
  if (parts.length !== 2) {
    alert('Formato de fecha de expiración inválido. Debe ser MM/YY.')
    return
  }

  addingCard.value = true
  try {
    const mes = parts[0].trim().padStart(2, '0')
    const anio = parts[1].trim().padStart(2, '0')

    const card = await api.tarjetas.create({
      NombreTitular: newCard.value.nombre,
      NumeroTarjeta: newCard.value.numero,
      MesExpiracion: mes,
      AnioExpiracion: anio,
    })
    savedCards.value.push(card)
    newCard.value = { nombre: '', numero: '', expiracion: '', cvv: '' }
    alert('Tarjeta guardada correctamente')
  } catch (error) {
    console.error('Error saving card', error)
    alert('Error al guardar la tarjeta')
  } finally {
    addingCard.value = false
  }
}

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
  fetchCards()
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

      <!-- Saved Cards -->
      <div class="card">
        <div class="card-header">
          <h2>Métodos de Pago</h2>
          <p>Gestiona tus tarjetas guardadas para realizar reservas de forma más rápida.</p>
        </div>
        <div class="card-body">
          <div v-if="loadingCards" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary"></div>
          </div>
          <div v-else-if="savedCards.length > 0" class="cards-list mb-4">
            <div v-for="card in savedCards" :key="card.IDTarjeta" class="saved-card-item">
              <div class="card-info">
                <i class="bi bi-credit-card"></i>
                <div>
                  <p class="card-name">{{ card.NombreTitular }}</p>
                  <p class="card-number">**** **** **** {{ card.NumeroTarjeta.slice(-4) }}</p>
                  <p class="card-exp">Expira: {{ card.MesExpiracion }}/{{ card.AnioExpiracion }}</p>
                </div>
              </div>
              <button @click="deleteCard(card.IDTarjeta)" class="btn btn-outline-danger btn-sm">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div v-else class="alert alert-info py-2">No tienes tarjetas guardadas.</div>

          <hr />

          <h3 class="h6 mb-3">Añadir Nueva Tarjeta</h3>
          <form @submit.prevent="saveNewCard" class="new-card-form">
            <div class="mb-3">
              <label class="form-label">Nombre del Titular</label>
              <input
                v-model="newCard.nombre"
                type="text"
                class="form-control form-control-sm"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Número de Tarjeta</label>
              <input
                v-model="newCard.numero"
                type="text"
                class="form-control form-control-sm"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                required
              />
            </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label">Caducidad (MM/YY)</label>
                <input
                  v-model="newCard.expiracion"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="MM/YY"
                  maxlength="5"
                  required
                />
              </div>
              <div class="col">
                <label class="form-label">CVV</label>
                <input
                  v-model="newCard.cvv"
                  type="password"
                  class="form-control form-control-sm"
                  placeholder="***"
                  maxlength="3"
                  required
                />
              </div>
            </div>
            <button type="submit" class="btn btn-success btn-sm w-100" :disabled="addingCard">
              {{ addingCard ? 'Guardando...' : 'Guardar Tarjeta' }}
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

.saved-card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fafafa;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-info i {
  font-size: 1.5rem;
  color: #007bff;
}

.card-info p {
  margin: 0;
  line-height: 1.2;
}

.card-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.card-number {
  color: #666;
  font-size: 0.85rem;
}

.card-exp {
  font-size: 0.75rem;
  color: #999;
}

.new-card-form .form-label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
