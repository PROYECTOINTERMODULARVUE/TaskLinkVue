<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({
  precio: [Number, String],
  cargandoReserva: Boolean,
  esPropietario: Boolean,
  isLoggedIn: Boolean,
})

const emit = defineEmits(['reservar'])
const route = useRoute()
const router = useRouter();
const idServicio = route.params.id


const fechaSeleccionada = ref('')
const horaSeleccionada = ref('')
const slotsDisponibles = ref([])
const cargandoSlots = ref(false)

const today = new Date().toISOString().split('T')[0]

watch(fechaSeleccionada, async (nuevaFecha) => {
  if (nuevaFecha && !props.esPropietario) {
    cargandoSlots.value = true
    horaSeleccionada.value = ''
    try {
      slotsDisponibles.value = await api.servicios.getSlots(idServicio, nuevaFecha)
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

const handleReservar = () => {
  if (!props.isLoggedIn) {
    alert('Debes iniciar sesión para reservar.')
    return
  }
  if (!fechaSeleccionada.value || !horaSeleccionada.value) {
    alert('Por favor, selecciona una fecha y una hora.')
    return
  }

  router.push({
    name: 'pago-reserva',
    params: { id: idServicio },
    query: {
      fecha: fechaSeleccionada.value,
      hora: horaSeleccionada.value,
    },
  })
}
</script>

<template>
  <aside class="sidebar-column">
    <div class="booking-widget">
      <!-- Container para disposición flexible en móvil -->
      <div class="widget-header">
        <div class="widget-price">
          <span class="price">{{ precio }}€</span>
          <span class="per-session">/ sesión</span>
          <!-- Fecha visible en móvil debajo del precio -->
          <div class="mobile-date">
            {{ fechaSeleccionada || 'Seleccionar fecha' }}
            <span v-if="horaSeleccionada"> - {{ horaSeleccionada }}</span>
          </div>
        </div>
      </div>

      <!-- Propietario Info -->
      <div v-if="esPropietario" class="owner-notice">
        <p>✨ Eres el propietario de este servicio.</p>
        <p class="notice-desc">
          Puedes gestionar las reservas recibidas desde tu panel de mensajes.
        </p>
        <button @click="$router.push('/mensajes')" class="btn-manage">Ir a mis mensajes</button>
      </div>

      <!-- Selectores detallados (ocultos si es propietario o si se muestra el pago) -->
      <template v-else-if="!mostrarPago">
        <div class="desktop-selectors">
          <div class="booking-selectors">
            <div class="selector-item date-selector">
              <div class="selector-label">FECHA</div>
              <input type="date" v-model="fechaSeleccionada" :min="today" class="selector-input" />
            </div>
            <div class="selector-item time-selector" :class="{ disabled: !fechaSeleccionada }">
              <div class="selector-label">HORA</div>
              <select
                v-model="horaSeleccionada"
                class="selector-input"
                :disabled="!fechaSeleccionada || cargandoSlots"
              >
                <option value="" disabled>
                  {{ cargandoSlots ? 'Cargando...' : 'Seleccionar hora' }}
                </option>
                <option v-for="slot in slotsDisponibles" :key="slot.inicio" :value="slot.inicio">
                  {{ slot.inicio.substring(0, 5) }}
                </option>
                <option
                  v-if="!cargandoSlots && fechaSeleccionada && slotsDisponibles.length === 0"
                  disabled
                >
                  No hay horas disponibles
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Botón de reserva (Fuera de desktop-selectors para que se vea en móvil) -->
        <div class="booking-actions-wrapper">
          <button
            @click="handleReservar"
            class="btn-reservar"
            :disabled="cargandoReserva || !fechaSeleccionada || !horaSeleccionada"
          >
            {{ cargandoReserva ? '...' : isLoggedIn ? 'Reservar' : 'Inicia sesión para reservar' }}
          </button>
        </div>

        <div class="price-summary-desktop">
          <p class="no-charge-info">No se te cobrará nada aún</p>
          <div class="total-row">
            <span>Total</span>
            <span class="total-price">{{ precio }}€</span>
          </div>
        </div>
      </template>

      <!-- Formulario de Pago -->
      <div v-else class="payment-form animate__animated animate__fadeIn">
        <div class="payment-header">
          <button @click="cancelarPago" class="btn-back">
            <i class="bi bi-chevron-left"></i> Volver
          </button>
          <h4>Datos de Pago</h4>
        </div>

        <div class="card-inputs">
          <div class="input-group">
            <label>TITULAR DE LA TARJETA</label>
            <input
              type="text"
              v-model="datosTarjeta.nombre"
              placeholder="Nombre como aparece en la tarjeta"
            />
          </div>
          <div class="input-group">
            <label>NÚMERO DE TARJETA</label>
            <div class="card-number-wrapper">
              <i class="bi bi-credit-card"></i>
              <input
                type="text"
                v-model="datosTarjeta.numero"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
              />
            </div>
          </div>
          <div class="row g-2">
            <div class="col-7">
              <div class="input-group">
                <label>CADUCIDAD</label>
                <input
                  type="text"
                  v-model="datosTarjeta.expiracion"
                  placeholder="MM/YY"
                  maxlength="5"
                />
              </div>
            </div>
            <div class="col-5">
              <div class="input-group">
                <label>CVV</label>
                <input type="password" v-model="datosTarjeta.cvv" placeholder="123" maxlength="4" />
              </div>
            </div>
          </div>
        </div>

        <div class="payment-footer">
          <div class="total-row mini">
            <span>Total a pagar</span>
            <span>{{ precio }}€</span>
          </div>
          <button
            @click="confirmarPagoYReservar"
            class="btn-confirm-payment"
            :disabled="cargandoReserva"
          >
            {{ cargandoReserva ? 'Procesando...' : 'Confirmar y Pagar' }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.booking-widget {
  position: sticky;
  top: 100px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  background: white;
  z-index: 100;
}

.widget-price {
  margin-bottom: 24px;
}
.price {
  font-size: 22px;
  font-weight: 600;
}
.per-session {
  font-size: 16px;
  font-weight: 400;
}

.mobile-date {
  display: none;
  font-size: 14px;
  text-decoration: underline;
  color: #222;
  font-weight: 600;
}

.booking-selectors {
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  margin-bottom: 24px;
}
.selector-item {
  padding: 10px 12px;
}
.selector-label {
  font-size: 10px;
  font-weight: 800;
}
.selector-value {
  font-size: 14px;
  color: #717171;
}

.btn-reservar {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: transform 0.1s ease;
}

.error {
  color: red;
}

.btn-reservar:active {
  transform: scale(0.96);
}

.btn-reservar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.no-charge-info {
  text-align: center;
  font-size: 14px;
  color: #717171;
  margin-top: 12px;
  margin-bottom: 24px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #dddddd;
  font-size: 18px;
  font-weight: 600;
}

.selector-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #222;
  padding: 0;
  outline: none;
  cursor: pointer;
}

.selector-input:disabled {
  cursor: not-allowed;
  color: #b0b0b0;
}

.date-selector {
  border-bottom: 1px solid #b0b0b0;
}

.time-selector.disabled {
  background-color: #f7f7f7;
  opacity: 0.6;
}

.owner-notice {
  text-align: center;
  padding: 24px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.owner-notice p {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.notice-desc {
  font-size: 14px;
  color: #666;
  margin-top: 8px !important;
  font-weight: 400 !important;
}

.btn-manage {
  margin-top: 20px;
  background: #222;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}

.btn-manage:hover {
  background: #000;
}

/* Versión Móvil Fija */
@media (max-width: 992px) {
  .sidebar-column {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border-top: 1px solid #ddd;
    padding: 0;
  }

  .booking-widget {
    position: relative;
    top: 0;
    border: none;
    border-radius: 0;
    padding: 16px 24px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .widget-header {
    flex: 1;
  }

  .widget-price {
    margin-bottom: 0;
  }

  .price {
    font-size: 18px;
  }

  .per-session {
    font-size: 14px;
  }

  .mobile-date {
    display: block;
  }

  .booking-actions-wrapper {
    flex: 0 0 auto;
    min-width: 140px;
    margin-top: 0;
  }

  .desktop-selectors, 
  .no-charge-info, 
  .total-row {
    display: none !important;
  }

  .btn-reservar {
    padding: 12px 20px;
  }
}
</style>
