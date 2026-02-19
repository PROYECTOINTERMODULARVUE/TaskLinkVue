<script setup>
import { computed } from 'vue'

const props = defineProps({
  reserva: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['cancelar'])

// La API devuelve detalles como un array
const detalle = computed(() => props.reserva.detalles?.[0] || {})
const servicio = computed(() => detalle.value.servicio || {})
const proveedor = computed(() => servicio.value.proveedor || {})

const formatFecha = (fecha) => {
  if (!fecha) return ''
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha))
}

const statusClass = computed(() => {
  const status = props.reserva.Estado?.toLowerCase()
  return {
    'status-pending': status === 'pendiente',
    'status-confirmed': status === 'confirmada',
    'status-completed': status === 'completada',
    'status-cancelled': status === 'cancelada',
  }
})

const canCancel = computed(() => {
  const status = props.reserva.Estado?.toLowerCase()
  return status === 'pendiente' || status === 'confirmada'
})
</script>

<template>
  <div class="client-reserva-card">
    <div class="reserva-header">
      <div class="service-info">
        <img
          :src="servicio.foto_principal?.Url || 'https://via.placeholder.com/150'"
          alt="Servicio"
          class="service-img"
        />
        <div class="service-details">
          <h3>{{ servicio.Nombre }}</h3>
          <p class="provider-name">Proveedor: {{ proveedor.NombreCompleto || proveedor.Nombre }}</p>
        </div>
      </div>
      <div class="reserva-status" :class="statusClass">
        {{ reserva.Estado }}
      </div>
    </div>

    <div class="reserva-body">
      <div class="info-grid">
        <div class="info-item">
          <span class="label">📅 Fecha:</span>
          <span class="value">{{ formatFecha(detalle.FechaServicio) }}</span>
        </div>
        <div class="info-item" v-if="reserva.Estado !== 'Completada'">
          <span class="label">⏰ Hora:</span>
          <span class="value">{{ detalle.HoraServicio }}</span>
        </div>
        <div class="info-item">
          <span class="label">💰 Total:</span>
          <span class="value">{{ reserva.Total }}€</span>
        </div>
      </div>
    </div>

    <div class="reserva-footer">
      <button v-if="canCancel" @click="emit('cancelar', reserva.IDReserva)" class="btn-cancel">
        Cancelar Reserva
      </button>
      <span v-else-if="reserva.Estado === 'Cancelada'" class="cancelled-text">
        Esta reserva ha sido cancelada
      </span>
      <span v-else-if="reserva.Estado === 'Completada'" class="completed-text">
        Servicio completado
      </span>
    </div>
  </div>
</template>

<style scoped>
.client-reserva-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s;
}

.client-reserva-card:hover {
  transform: translateY(-2px);
}

.reserva-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.service-info {
  display: flex;
  gap: 12px;
}

.service-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.service-details h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.provider-name {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.reserva-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fff3e0;
  color: #ef6c00;
}
.status-confirmed {
  background: #e8f5e9;
  color: #2e7d32;
}
.status-completed {
  background: #e3f2fd;
  color: #1565c0;
}
.status-cancelled {
  background: #ffebee;
  color: #c62828;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.8rem;
  color: #888;
  font-weight: 600;
}

.value {
  font-size: 0.95rem;
  color: #333;
}

.reserva-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.btn-cancel {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #fff1f3;
}

.cancelled-text {
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
}
.completed-text {
  color: #2e7d32;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
