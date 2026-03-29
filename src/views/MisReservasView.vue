<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStores } from '@/stores'
import ReservationList from '@/components/mensajes/ReservationList.vue'
import ClientReservationList from '@/components/mensajes/ClientReservationList.vue'

const stores = useStores()

const cargando = ref(false)
const error = ref(null)

const isCliente = computed(() => stores.rol.isCliente)
const isGestorOrAdmin = computed(() => stores.rol.isGestor || stores.rol.isAdmin)

const reservasRecibidas = computed(() => stores.reserva.reservasRecibidas)
const reservasHechas = computed(() => stores.reserva.reservasHechas)

onMounted(async () => {
  await fetchReservas()
})

const fetchReservas = async () => {
  cargando.value = true
  error.value = null
  try {
    if (isGestorOrAdmin.value) {
      await stores.reserva.fetchReservasRecibidas()
    }
    if (isCliente.value) {
      await stores.reserva.fetchReservasHechas()
    }
  } catch (err) {
    error.value = 'No se pudieron cargar las reservas. Por favor, inténtalo de nuevo.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const handleUpdateEstado = async ({ id, estado }) => {
  try {
    await stores.reserva.actualizarEstadoReserva(id, estado)
  } catch (err) {
    alert('Error al actualizar el estado de la reserva')
  }
}

const handleCancelarCliente = async (id) => {
  if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
    try {
      await stores.reserva.cancelarReservaCliente(id)
    } catch (err) {
      alert('Error al cancelar la reserva')
    }
  }
}
</script>

<template>
  <div class="mensajes-view">
    <div class="header-section">
      <h1>{{ isGestorOrAdmin ? 'Gestión de Reservas' : 'Mis Reservas' }}</h1>
      <p class="subtitle">
        {{
          isGestorOrAdmin
            ? 'Administra las solicitudes de tus servicios y mantén el control de tu agenda.'
            : 'Consulta el estado de tus reservas y gestiona tus citas.'
        }}
      </p>
    </div>

    <!-- Vista para Gestores/Admins -->
    <div v-if="isGestorOrAdmin" class="gestor-view">
      <ReservationList
        :reservas="reservasRecibidas"
        :cargando="cargando"
        :error="error"
        @update-estado="handleUpdateEstado"
      />
    </div>

    <!-- Vista para Clientes -->
    <div v-if="isCliente" class="cliente-view" :class="{ 'with-divider': isGestorOrAdmin }">
      <h2 v-if="isGestorOrAdmin" class="section-title">Como cliente</h2>
      <ClientReservationList
        :reservas="reservasHechas"
        :cargando="cargando"
        :error="error"
        @cancelar="handleCancelarCliente"
      />
    </div>
  </div>
</template>

<style scoped>
.mensajes-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header-section {
  margin-bottom: 40px;
}

.header-section h1 {
  font-size: 2.5rem;
  color: #222;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.section-title {
  margin: 40px 0 20px;
  font-size: 1.5rem;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #eee;
}

.with-divider {
  border-top: 1px solid #eee;
  margin-top: 60px;
  padding-top: 20px;
}

@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }
}
</style>
