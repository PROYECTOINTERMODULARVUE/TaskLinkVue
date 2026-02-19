<script setup>
import ClientReservationCard from './ClientReservationCard.vue'

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

const emit = defineEmits(['cancelar'])
</script>

<template>
  <div class="reservations-container">
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando tus reservas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
    </div>

    <div v-else-if="reservas.length === 0" class="empty-state">
      <p>Aún no has realizado ninguna reserva.</p>
      <button @click="$router.push('/')" class="btn-explore">Explorar servicios</button>
    </div>

    <div v-else class="reservations-grid">
      <ClientReservationCard
        v-for="reserva in reservas"
        :key="reserva.IDReserva"
        :reserva="reserva"
        @cancelar="emit('cancelar', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.reservations-container {
  padding: 20px 0;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #eee;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
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

.btn-explore {
  margin-top: 16px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 480px) {
  .reservations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
