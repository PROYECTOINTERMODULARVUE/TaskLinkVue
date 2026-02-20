<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useusuarioStore } from '@/stores/usuario'
import { usereservasStore } from '@/stores/reserva'

const props = defineProps({
  servicio: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])
const router = useRouter()
const usuarioStore = useusuarioStore()
const reservaStore = usereservasStore()

const procesandoReserva = ref(false)
const fechaSeleccionada = ref('')
const horaSeleccionada = ref('')
const slotsDisponibles = ref([])
const cargandoSlots = ref(false)
const tarjetasGuardadas = ref([])
const tarjetaSeleccionada = ref('')
const cargandoTarjetas = ref(true)

const today = new Date().toISOString().split('T')[0]

onMounted(async () => {
  try {
    tarjetasGuardadas.value = await api.tarjetas.getAll()
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    cargandoTarjetas.value = false
  }
})

watch(fechaSeleccionada, async (nuevaFecha) => {
  if (nuevaFecha) {
    cargandoSlots.value = true
    horaSeleccionada.value = ''
    try {
      slotsDisponibles.value = await api.servicios.getSlots(props.servicio.IDServicio, nuevaFecha)
    } catch (error) {
      console.error('Error fetching slots:', error)
      slotsDisponibles.value = []
    } finally {
      cargandoSlots.value = false
    }
  } else {
    slotsDisponibles.value = []
    horaSeleccionada.value = ''
  }
})

const confirmarReserva = async () => {
  if (!fechaSeleccionada.value || !horaSeleccionada.value || !tarjetaSeleccionada.value) {
    alert('Por favor, completa todos los campos (fecha, hora y tarjeta).')
    return
  }

  procesandoReserva.value = true
  try {
    // 1. Crear la reserva
    const nuevaReserva = await reservaStore.anyadirReserva({
      idServicio: props.servicio.IDServicio,
      FechaServicio: fechaSeleccionada.value,
      HoraServicio: horaSeleccionada.value,
    })

    // 2. Notificar a n8n
    try {
      await api.n8n.confirmarCompra({
        status: 'paid',
        email: usuarioStore.datosUsuario?.email,
        cliente_nombre: usuarioStore.datosUsuario?.name || usuarioStore.datosUsuario?.Nombre,
        servicio_nombre: props.servicio.Nombre,
        precio: props.servicio.Precio,
        fecha: fechaSeleccionada.value
      })
    } catch (n8nError) {
      console.warn('Error al notificar a n8n:', n8nError)
    }

    // 3. Éxito
    emit('success', nuevaReserva.IDReserva)
  } catch (error) {
    console.error('Error al procesar reserva rápida:', error)
    alert('Hubo un error al procesar tu reserva. Inténtalo de nuevo.')
  } finally {
    procesandoReserva.value = false
  }
}

const cerrar = () => emit('close')
const irAPerfil = () => router.push('/perfil/editar')
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="cerrar">
    <div class="modal-card animate__animated animate__zoomIn animate__faster">
      <div class="modal-header">
        <h2>Reserva Rápida</h2>
        <button @click="cerrar" class="btn-close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="service-preview">
        <img :src="servicio.imagen_url || servicio.categoria?.imagen_url" alt="Servicio" />
        <div class="service-details">
          <h3>{{ servicio.Nombre }}</h3>
          <p class="price">{{ servicio.Precio }}€ / sesión</p>
        </div>
      </div>

      <div class="booking-form">
        <div class="form-group">
          <label>FECHA DEL SERVICIO</label>
          <input 
            type="date" 
            v-model="fechaSeleccionada" 
            :min="today" 
            class="form-control"
          />
        </div>

        <div class="form-group" v-if="fechaSeleccionada">
          <label>HORA DISPONIBLE</label>
          <div v-if="cargandoSlots" class="small-loader">Buscando horas...</div>
          <select 
            v-else-if="slotsDisponibles.length > 0" 
            v-model="horaSeleccionada" 
            class="form-select"
          >
            <option value="" disabled>Selecciona una hora</option>
            <option v-for="slot in slotsDisponibles" :key="slot.inicio" :value="slot.inicio">
              {{ slot.inicio.substring(0, 5) }}
            </option>
          </select>
          <p v-else class="error-text">No hay horas disponibles para este día.</p>
        </div>

        <div class="form-group payment-section">
          <label>MÉTODO DE PAGO (Tarjeta Guardada)</label>
          <div v-if="cargandoTarjetas" class="small-loader">Cargando tus tarjetas...</div>
          <div v-else-if="tarjetasGuardadas.length > 0">
            <select v-model="tarjetaSeleccionada" class="form-select">
              <option value="" disabled>Selecciona una tarjeta</option>
              <option v-for="t in tarjetasGuardadas" :key="t.IDTarjeta" :value="t.IDTarjeta">
                {{ t.NombreTitular }} - **** {{ t.NumeroTarjeta.slice(-4) }}
              </option>
            </select>
          </div>
          <div v-else class="no-cards-notice">
            <p>No tienes tarjetas guardadas para el pago rápido.</p>
            <button @click="irAPerfil" class="btn-link">
              <i class="bi bi-credit-card"></i> Añadir una tarjeta en mi perfil
            </button>
          </div>
        </div>

        <button 
          @click="confirmarReserva" 
          class="btn-confirm" 
          :disabled="procesandoReserva || !horaSeleccionada || !tarjetaSeleccionada"
        >
          <span v-if="procesandoReserva">Procesando...</span>
          <span v-else>Confirmar reserva</span>
        </button>
      </div>

      <p class="disclaimer">Pago seguro 100% gestionado por TaskLink.</p>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 480px;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.btn-close {
  background: #f0f2f5;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #e4e6e9;
}

.service-preview {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid #eee;
}

.service-preview img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}

.service-details h3 {
  font-size: 16px;
  margin: 0 0 4px 0;
}

.service-details .price {
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #717171;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.form-control, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.2s;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  background-color: #fff;
  outline: none;
}

.payment-section {
  border-top: 1px solid #eee;
  padding-top: 18px;
}

.no-cards-notice {
  text-align: center;
  padding: 12px;
  background: #fff5f5;
  border: 1px dashed #feb2b2;
  border-radius: 12px;
}

.no-cards-notice p {
  font-size: 13px;
  color: #c53030;
  margin-bottom: 8px;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
}

.btn-confirm {
  margin-top: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 86, 179, 0.3);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.small-loader {
  font-size: 12px;
  color: #007bff;
  font-style: italic;
}

.error-text {
  color: #e53e3e;
  font-size: 13px;
  margin: 4px 0 0 0;
}

.disclaimer {
  text-align: center;
  font-size: 11px;
  color: #a0aec0;
  margin-top: 24px;
}
</style>
