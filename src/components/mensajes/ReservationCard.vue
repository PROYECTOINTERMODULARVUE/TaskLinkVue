<script setup>
const props = defineProps({
  reserva: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-estado'])

const formatFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(fecha))
}

const formatSimple = (fecha) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha))
}

const getStatusClass = (estado) => {
  switch (estado) {
    case 'Confirmada':
      return 'status-confirmed'
    case 'Cancelada':
      return 'status-cancelled'
    case 'Pendiente':
      return 'status-pending'
    case 'Completada':
      return 'status-completed'
    default:
      return ''
  }
}

const handleAction = (nuevoEstado) => {
  emit('update-estado', props.reserva.IDReserva, nuevoEstado)
}
</script>

<template>
  <div class="reserva-card">
    <div class="reserva-header">
      <div class="customer-info">
        <img
          :src="reserva.usuario.foto_perfil_url"
          alt="Avatar del cliente"
          class="customer-avatar"
        />
        <div>
          <span class="customer-name">{{ reserva.usuario.Nombre }}</span>
          <span class="reserva-date">Realizada el {{ formatSimple(reserva.created_at) }}</span>
        </div>
      </div>
      <span class="status-badge" :class="getStatusClass(reserva.Estado)">
        {{ reserva.Estado }}
      </span>
    </div>

    <div class="reserva-body">
      <div class="service-detail">
        <span class="detail-label">SERVICIO</span>
        <span class="detail-value text-primary">{{ reserva.detalles[0]?.servicio?.Nombre }}</span>
      </div>
      <div class="reserva-time-info">
        <div class="detail-item">
          <span class="detail-label">FECHA</span>
          <span class="detail-value">{{ formatFecha(reserva.detalles[0]?.FechaServicio) }}</span>
        </div>
        <div class="detail-item" v-if="reserva.Estado !== 'Completada'">
          <span class="detail-label">HORA</span>
          <span class="detail-value">{{ reserva.detalles[0]?.HoraServicio.substring(0, 5) }}</span>
        </div>
      </div>
      <div class="reserva-location">
        <span class="detail-label">UBICACIÓN</span>
        <span class="detail-value">
          {{ reserva.detalles[0]?.servicio?.Direccion }},
          {{ reserva.detalles[0]?.servicio?.zona?.nombre }}
        </span>
      </div>
    </div>

    <div class="reserva-footer" v-if="reserva.Estado === 'Pendiente'">
      <button @click="handleAction('Confirmada')" class="btn-action btn-accept">
        Aceptar Reserva
      </button>
      <button @click="handleAction('Cancelada')" class="btn-action btn-decline">Cancelar</button>
    </div>
    <div class="reserva-footer" v-else-if="reserva.Estado === 'Confirmada'">
      <button @click="handleAction('Cancelada')" class="btn-action btn-decline btn-outline">
        Cancelar cita
      </button>
    </div>
  </div>
</template>

<style scoped>
.reserva-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.reserva-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.reserva-header {
  padding: 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.customer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.customer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.customer-name {
  display: block;
  font-weight: 700;
  color: #222;
}

.reserva-date {
  font-size: 12px;
  color: #717171;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.status-pending {
  background: #fff8e1;
  color: #f57f17;
}
.status-confirmed {
  background: #e8f5e9;
  color: #2e7d32;
}
.status-cancelled {
  background: #ffebee;
  color: #c62828;
}
.status-completed {
  background: #e3f2fd;
  color: #1565c0;
}

.reserva-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: #717171;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 15px;
  color: #222;
  font-weight: 500;
}

.text-primary {
  color: #007bff;
  font-weight: 700;
}

.reserva-time-info {
  display: flex;
  gap: 32px;
}

.reserva-footer {
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-accept {
  background: #007bff;
  color: white;
}
.btn-accept:hover {
  background: #0056b3;
}

.btn-decline {
  background: #f7f7f7;
  color: #222;
  border: 1px solid #ddd;
}
.btn-decline:hover {
  background: #eee;
}

.btn-outline {
  background: transparent;
  color: #c62828;
  border: 1px solid #f8d7da;
}
.btn-outline:hover {
  background: #fff5f5;
}
</style>
