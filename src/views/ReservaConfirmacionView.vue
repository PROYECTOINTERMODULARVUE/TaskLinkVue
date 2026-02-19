<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usereservasStore } from '@/stores/reserva'

const route = useRoute()
const router = useRouter()
const reservaId = route.params.id

const reservaStore = usereservasStore()
const reserva = ref(null)
const cargando = ref(true)
const error = ref(null)

const detalle = computed(() => reserva.value?.detalles?.[0] || {})
const servicio = computed(() => detalle.value?.servicio || {})

onMounted(async () => {
  try {
    reserva.value = await reservaStore.unaReserva(reservaId)
    if (!reserva.value) {
      error.value = 'No se encontró la reserva seleccionada.'
    }
  } catch (err) {
    console.error('Error fetching reservation:', err)
    error.value = 'No se pudo cargar la información de la reserva.'
  } finally {
    cargando.value = false
  }
})

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const volverInicio = () => router.push('/')
const verMisReservas = () => router.push('/perfil') // Ajustar si hay una ruta específica
</script>

<template>
  <div class="confirmation-page">
    <div v-if="cargando" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="alert alert-danger">{{ error }}</div>
      <button @click="volverInicio" class="btn btn-primary">Volver al inicio</button>
    </div>

    <div v-else class="confirmation-content">
      <div class="success-header animate__animated animate__fadeIn">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h1 class="confirmation-title">¡Reserva Confirmada!</h1>
        <p class="confirmation-subtitle">
          Tu solicitud ha sido enviada correctamente al proveedor.
        </p>
      </div>

      <div class="summary-card animate__animated animate__fadeInUp">
        <div class="row g-0">
          <div class="col-md-4">
            <img
              :src="servicio.fotoPrincipal?.Url || servicio.categoria?.ImagenUrl"
              class="service-img"
              :alt="servicio.Nombre"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body p-4">
              <h2 class="h4 mb-3">{{ servicio.Nombre }}</h2>

              <div class="info-grid">
                <div class="info-item">
                  <span class="label text-muted">Fecha</span>
                  <span class="value">{{ formatearFecha(detalle.FechaServicio) }}</span>
                </div>
                <div class="info-item">
                  <span class="label text-muted">Hora</span>
                  <span class="value">{{ detalle.HoraServicio?.substring(0, 5) }}</span>
                </div>
                <div class="info-item">
                  <span class="label text-muted">Precio Total</span>
                  <span class="value price">{{ reserva.Total }}€</span>
                </div>
                <div class="info-item">
                  <span class="label text-muted">Proveedor</span>
                  <span class="value">{{ servicio.proveedor?.Nombre }}</span>
                </div>
              </div>

              <div class="location-box mt-4 p-3 bg-light rounded">
                <i class="bi bi-geo-alt-fill text-primary me-2"></i>
                <span class="small">{{ servicio.Direccion || 'Dirección no especificada' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-container">
        <button @click="verMisReservas" class="btn btn-primary btn-lg px-5 mb-3">
          Ver mis reservas
        </button>
        <button @click="volverInicio" class="btn btn-outline-secondary">
          Volver a la página principal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation-page {
  max-width: 800px;
  margin: 60px auto;
  padding: 20px;
  min-height: 70vh;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.success-header {
  text-align: center;
  margin-bottom: 40px;
}

.success-icon {
  font-size: 80px;
  color: #28a745;
  margin-bottom: 20px;
}

.confirmation-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
}

.confirmation-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.summary-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}

.service-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 250px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-item .value {
  font-weight: 600;
  color: #333;
}

.price {
  color: #007bff;
  font-size: 1.25rem;
}

.actions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .confirmation-title {
    font-size: 1.8rem;
  }
}
</style>
