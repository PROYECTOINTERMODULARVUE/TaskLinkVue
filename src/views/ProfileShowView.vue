<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useusuarioStore } from '@/stores/usuario'
import { useRolStore } from '@/stores/rol' // Assuming we might need this for explicit checks

const router = useRouter()
const usuarioStore = useusuarioStore()
const rolStore = useRolStore()

const user = ref(null)
const loading = ref(true)
const activeTab = ref('stats') // stats, servicios, reservas

const stats = computed(() => {
  if (!user.value) return { servicios: 0, reservas: 0 }
  return {
    servicios: user.value.servicios ? user.value.servicios.length : 0,
    reservas: user.value.reservas ? user.value.reservas.length : 0,
  }
})

const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await api.usuarios.getUsuarioActual()
    user.value = res
  } catch (error) {
    console.error('Error loading profile', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (value) => {
  return parseFloat(value).toFixed(2) + ' €'
}
const getBadgeClass = (estado) => {
  switch (estado ? estado.toLowerCase() : '') {
    case 'confirmada':
      return 'bg-success'
    case 'pendiente':
      return 'bg-warning text-dark'
    case 'cancelada':
      return 'bg-danger'
    case 'completada':
      return 'bg-primary'
    default:
      return 'bg-secondary'
  }
}
const toggleService = async (servicio) => {
  if (
    !confirm(
      `¿Estás seguro de que quieres ${servicio.Activo ? 'deshabilitar' : 'habilitar'} este servicio?`,
    )
  ) {
    return
  }

  try {
    await api.proveedor.updateServicioJson(servicio.IDServicio, {
      Activo: !servicio.Activo,
    })
    // Refresh list
    await fetchProfile()
    alert(`Servicio ${servicio.Activo ? 'deshabilitado' : 'habilitado'} correctamente`)
  } catch (error) {
    console.error('Error toggling service', error)
    alert('Error al cambiar el estado del servicio')
  }
}

const saveRoles = async () => {
  // TODO: Implement role update
  alert('Funcionalidad de roles no implementada aún en frontend Vue')
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-container" v-if="user">
    <div class="d-flex align-items-center mb-3">
      <router-link to="/" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i> Volver a Inicio
      </router-link>
      <h1 class="profile-title mb-0">Mi Perfil</h1>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        <img :src="user.FotoPerfilUrl" alt="Foto de perfil" class="profile-avatar animated" />
        <div class="profile-info">
          <h2 class="profile-name">{{ user.Nombre }} {{ user.Apellidos }}</h2>
          <p class="profile-email">{{ user.email }}</p>

          <!-- Admin Role Management (Only for Rol 1) -->
          <div v-if="user.idRol === 1" class="role-management mt-4">
            <!-- Placeholder for checkboxes logic -->
            <p class="text-muted">Panel de Roles (WIP)</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs mt-6">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          Resumen
        </button>
        <button
          v-if="user.servicios && user.servicios.length > 0"
          class="tab-button"
          :class="{ active: activeTab === 'servicios' }"
          @click="activeTab = 'servicios'"
        >
          Mis Servicios
        </button>
        <button
          v-if="user.reservas && user.reservas.length > 0"
          class="tab-button"
          :class="{ active: activeTab === 'reservas' }"
          @click="activeTab = 'reservas'"
        >
          Mis Reservas
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content mt-6">
        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats'" class="tab-pane active">
          <div class="stats-grid">
            <div class="stat-item cursor-pointer" @click="activeTab = 'servicios'">
              <h3 class="stat-title">Servicios activos</h3>
              <p class="stat-value">{{ stats.servicios }}</p>
            </div>
            <div class="stat-item cursor-pointer" @click="activeTab = 'reservas'">
              <h3 class="stat-title">Reservas</h3>
              <p class="stat-value">{{ stats.reservas }}</p>
            </div>
          </div>
        </div>

        <!-- Servicios Tab -->
        <div v-if="activeTab === 'servicios'" class="tab-pane active">
          <h3 class="section-subtitle">Mis Servicios</h3>
          <div class="services-list mt-4">
            <div v-if="user.servicios.length === 0" class="alert alert-info">
              No has creado ningún servicio aún.
            </div>
            <div
              v-else
              v-for="servicio in user.servicios"
              :key="servicio.IDServicio"
              class="service-item"
            >
              <div class="d-flex justify-content-between">
                <h4 class="service-title">{{ servicio.Nombre }}</h4>
                <span class="badge" :class="servicio.Activo ? 'bg-success' : 'bg-danger'">
                  {{ servicio.Activo ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <p class="service-category">
                Categoría: {{ servicio.categoria ? servicio.categoria.Nombre : 'Sin categoría' }}
              </p>
              <p class="service-price">Precio: {{ formatCurrency(servicio.Precio) }}</p>
              <p class="service-duration">Duración: {{ servicio.Duracion }} min</p>

              <div class="mt-3">
                <!-- Edit Link -->
                <router-link
                  :to="{ name: 'crear-servicio', query: { edit: servicio.IDServicio } }"
                  class="btn btn-sm btn-outline-primary me-2"
                >
                  <i class="bi bi-pencil"></i> Editar
                </router-link>
                <!-- Toggle Active -->
                <button
                  class="btn btn-sm"
                  :class="servicio.Activo ? 'btn-danger' : 'btn-success'"
                  @click="toggleService(servicio)"
                >
                  <i class="bi" :class="servicio.Activo ? 'bi-x-circle' : 'bi-check-circle'"></i>
                  {{ servicio.Activo ? 'Deshabilitar' : 'Habilitar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reservas Tab -->
        <div v-if="activeTab === 'reservas'" class="tab-pane active">
          <h3 class="section-subtitle">Mis Reservas</h3>
          <div class="reservations-list mt-4">
            <div v-if="user.reservas.length === 0" class="alert alert-info">
              No tienes reservas realizadas.
            </div>
            <div
              v-else
              v-for="reserva in user.reservas"
              :key="reserva.IDReserva"
              class="reservation-item"
            >
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h4 class="reservation-title mb-0">Reserva #{{ reserva.IDReserva }}</h4>
                <span class="badge" :class="getBadgeClass(reserva.Estado)">{{
                  reserva.Estado
                }}</span>
              </div>

              <p class="reservation-date">
                <i class="bi bi-calendar-event"></i> Fecha: {{ formatDate(reserva.FechaReserva) }}
              </p>

              <p class="reservation-total">
                <i class="bi bi-currency-euro"></i> Total:
                <strong>{{ formatCurrency(reserva.Total) }}</strong>
              </p>

              <!-- Detalles de la reserva -->
              <div
                v-if="reserva.detalles && reserva.detalles.length > 0"
                class="mt-2 p-2 bg-light rounded"
              >
                <small class="d-block text-muted mb-1">Servicios reservados:</small>
                <ul class="list-unstyled mb-0 ms-2">
                  <li v-for="detalle in reserva.detalles" :key="detalle.IDReservaDetalle">
                    {{ detalle.servicio ? detalle.servicio.Nombre : 'Servicio no disponible' }}
                    - {{ formatDate(detalle.FechaServicio) }} {{ detalle.HoraServicio }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-actions mt-8">
        <router-link to="/perfil/editar" class="btn btn-primary">Editar perfil</router-link>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-5">
    <div v-if="loading" class="spinner-border text-primary" role="status"></div>
    <div v-else>No se pudo cargar el perfil</div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.profile-email {
  color: #666;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #0d6efd;
  border-bottom-color: #0d6efd;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #0d6efd;
  margin: 0;
}

.service-item,
.reservation-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}
</style>
