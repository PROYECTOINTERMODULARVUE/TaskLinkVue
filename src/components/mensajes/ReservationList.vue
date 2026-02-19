<script setup>
import ReservationCard from './ReservationCard.vue'

defineProps({
  reservas: {
    type: Array,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['reintentar', 'update-estado'])

const handleUpdateEstado = (id, nuevoEstado) => {
  emit('update-estado', id, nuevoEstado)
}

const handleReintentar = () => {
  emit('reintentar')
}
</script>

<template>
  <div class="reservas-section">
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando tus reservas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="handleReintentar" class="btn-retry">Reintentar</button>
    </div>

    <div v-else-if="reservas.length === 0" class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No tienes reservas aún</h3>
      <p>Cuando un cliente reserve uno de tus servicios, aparecerá aquí.</p>
    </div>

    <div v-else class="reservas-grid">
      <ReservationCard
        v-for="reserva in reservas"
        :key="reserva.IDReserva"
        :reserva="reserva"
        @update-estado="handleUpdateEstado"
      />
    </div>
  </div>
</template>

<style scoped>
.reservas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 24px;
}

@media (max-width: 600px) {
  .reservas-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: #f9f9f9;
  border-radius: 16px;
  border: 1px dashed #ddd;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  color: #222;
  margin-bottom: 8px;
}

.empty-state p {
  color: #717171;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.btn-retry {
  margin-top: 12px;
  padding: 8px 24px;
  background: #222;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
</style>
