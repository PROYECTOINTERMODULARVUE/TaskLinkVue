<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { usereservasStore } from '@/stores/reserva'

const route = useRoute()
const router = useRouter()
const reservaStore = usereservasStore()

const idServicio = route.params.id
const fecha = route.query.fecha
const hora = route.query.hora

const servicio = ref(null)
const cargando = ref(true)
const procesandoReserva = ref(false)
const guardarTarjeta = ref(false)
const tarjetasGuardadas = ref([])
const tarjetaSeleccionada = ref('')

const datosTarjeta = ref({
  numero: '',
  expiracion: '',
  cvv: '',
  nombre: '',
})

onMounted(async () => {
  if (!idServicio || !fecha || !hora) {
    router.push('/')
    return
  }

  try {
    const [servicioData, tarjetasData] = await Promise.all([
      api.servicios.getOne(idServicio),
      api.tarjetas.getAll(),
    ])
    servicio.value = servicioData
    tarjetasGuardadas.value = tarjetasData
  } catch (error) {
    console.error('Error fetching initial data:', error)
    // No redirigimos si fallan las tarjetas, solo si falla el servicio
    if (!servicio.value) router.push('/')
  } finally {
    cargando.value = false
  }
})

watch(tarjetaSeleccionada, (newId) => {
  if (newId) {
    const tarjeta = tarjetasGuardadas.value.find((t) => t.IDTarjeta == newId)
    if (tarjeta) {
      datosTarjeta.value = {
        numero: tarjeta.NumeroTarjeta,
        expiracion: tarjeta.MesExpiracion + '/' + tarjeta.AnioExpiracion,
        cvv: '', // CVV nunca se guarda por seguridad
        nombre: tarjeta.NombreTitular,
      }
    }
  } else {
    datosTarjeta.value = { numero: '', expiracion: '', cvv: '', nombre: '' }
  }
})

const confirmarYReservar = async () => {
  if (!datosTarjeta.value.numero || !datosTarjeta.value.expiracion || !datosTarjeta.value.cvv) {
    alert('Por favor, completa los datos de la tarjeta.')
    return
  }

  procesandoReserva.value = true
  try {
    // 1. Guardar tarjeta si el usuario lo marcó
    if (guardarTarjeta.value) {
      const parts = datosTarjeta.value.expiracion.split('/')
      if (parts.length !== 2) {
        alert('Formato de fecha de expiración inválido. Debe ser MM/YY.')
        procesandoReserva.value = false
        return
      }

      const mes = parts[0].trim().padStart(2, '0')
      const anio = parts[1].trim().padStart(2, '0')

      await api.tarjetas.create({
        NombreTitular: datosTarjeta.value.nombre,
        NumeroTarjeta: datosTarjeta.value.numero,
        MesExpiracion: mes,
        AnioExpiracion: anio,
      })
    }

    // 2. Crear la reserva
    const horaFormateada = hora.includes(':') && hora.split(':').length === 2 ? `${hora}:00` : hora
    const nuevaReserva = await api.reservas.create({
      idServicio: idServicio,
      FechaServicio: fecha,
      HoraServicio: horaFormateada,
      Estado: 'Pendiente',
    })

    router.push(`/confirmacion-reserva/${nuevaReserva.IDReserva}`)
  } catch (error) {
    console.error('Error al procesar reserva:', error)
    alert('Hubo un error al procesar tu reserva o guardar la tarjeta. Inténtalo de nuevo.')
  } finally {
    procesandoReserva.value = false
  }
}

const volver = () => {
  router.back()
}
</script>

<template>
  <div class="pago-view">
    <div v-if="cargando" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando detalles de la reserva...</p>
    </div>

    <div v-else class="pago-container">
      <div class="back-nav">
        <button @click="volver" class="btn-text">
          <i class="bi bi-arrow-left"></i> Volver al servicio
        </button>
      </div>

      <div class="pago-grid">
        <!-- Columna Formulario -->
        <div class="pago-main">
          <div v-if="tarjetasGuardadas.length > 0" class="saved-cards-top-box">
            <div class="input-group full saved-cards-selector">
              <label>SELECCIONA UNA TARJETA GUARDADA PARA PAGAR</label>
              <select v-model="tarjetaSeleccionada" class="select-input">
                <option value="">Nueva tarjeta...</option>
                <option v-for="t in tarjetasGuardadas" :key="t.IDTarjeta" :value="t.IDTarjeta">
                  {{ t.NombreTitular }} - **** **** **** {{ t.NumeroTarjeta.slice(-4) }}
                </option>
              </select>
            </div>
            <div class="card-separator">
              <span>O completa los datos manualmente</span>
            </div>
          </div>

          <section class="pago-section">
            <h2>Método de Pago</h2>
            <p class="section-desc">Todas las transacciones son seguras y están encriptadas.</p>

            <div class="card-form">
              <div class="input-group full">
                <label>TITULAR DE LA TARJETA</label>
                <input type="text" v-model="datosTarjeta.nombre" placeholder="Nombre completo" />
              </div>

              <div class="input-group full">
                <label>NÚMERO DE TARJETA</label>
                <div class="input-card-wrapper">
                  <i class="bi bi-credit-card"></i>
                  <input
                    type="text"
                    v-model="datosTarjeta.numero"
                    placeholder="0000 0000 0000 0000"
                    maxlength="19"
                  />
                </div>
              </div>

              <div class="input-row">
                <div class="input-group">
                  <label>FECHA CADUCIDAD</label>
                  <input
                    type="text"
                    v-model="datosTarjeta.expiracion"
                    placeholder="MM/YY"
                    maxlength="5"
                  />
                </div>
                <div class="input-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    v-model="datosTarjeta.cvv"
                    placeholder="123"
                    maxlength="4"
                  />
                </div>
              </div>
              <div class="input-group checkbox-group">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="guardarTarjeta" />
                  <span class="checkmark"></span>
                  Guardar esta tarjeta para futuras compras
                </label>
              </div>
            </div>
          </section>

          <div class="actions">
            <button @click="confirmarYReservar" class="btn-pay" :disabled="procesandoReserva">
              <span v-if="procesandoReserva">Procesando...</span>
              <span v-else>Confirmar reserva y pagar</span>
            </button>
          </div>
        </div>

        <!-- Columna Resumen -->
        <div class="pago-sidebar">
          <div class="resumen-card">
            <h3>Resumen de la reserva</h3>
            <div class="servicio-preview">
              <img :src="servicio.imagen_url || servicio.categoria?.imagen_url" alt="Servicio" />
              <div class="servicio-meta">
                <h4>{{ servicio.Nombre }}</h4>
                <p><i class="bi bi-calendar-event"></i> {{ fecha }}</p>
                <p><i class="bi bi-clock"></i> {{ hora.substring(0, 5) }}</p>
              </div>
            </div>

            <div class="precio-desglose">
              <div class="precio-row">
                <span>Servicio</span>
                <span>{{ servicio.Precio }}€</span>
              </div>
              <div class="precio-row">
                <span>Gastos de gestión</span>
                <span>0€</span>
              </div>
              <div class="precio-row total">
                <span>Total</span>
                <span>{{ servicio.Precio }}€</span>
              </div>
            </div>

            <div class="pago-garantia">
              <i class="bi bi-shield-check"></i>
              <p>Pago 100% seguro con encriptación SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pago-view {
  min-height: 90vh;
  background-color: #f8f9fa;
  padding: 40px 20px;
}

.pago-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-nav {
  margin-bottom: 24px;
}

.btn-text {
  background: none;
  border: none;
  color: #007bff;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.pago-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

.pago-main {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pago-section h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-desc {
  color: #717171;
  margin-bottom: 32px;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.saved-cards-selector {
  margin-bottom: 12px;
}

.saved-cards-top-box {
  background: #f0f7ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border: 1px solid #cce3ff;
}

.saved-cards-top-box label {
  color: #0056b3;
  font-weight: 700;
  margin-bottom: 8px;
  display: block;
}

.select-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  background-color: white;
}

.card-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #717171;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.card-separator::before,
.card-separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.card-separator span {
  padding: 0 10px;
}

.checkbox-group {
  margin-top: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #444;
}

.input-group label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #717171;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.input-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.input-card-wrapper {
  position: relative;
}

.input-card-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #717171;
  font-size: 18px;
}

.input-card-wrapper input {
  padding-left: 44px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.actions {
  margin-top: 40px;
}

.btn-pay {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 86, 179, 0.3);
}

.btn-pay:active {
  transform: scale(0.98);
}

.btn-pay:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Sidebar styles */
.resumen-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

.resumen-card h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.servicio-preview {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.servicio-preview img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.servicio-meta h4 {
  font-size: 16px;
  margin: 0 0 8px 0;
}

.servicio-meta p {
  font-size: 14px;
  color: #717171;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.precio-desglose {
  border-top: 1px solid #eee;
  padding-top: 20px;
  margin-bottom: 24px;
}

.precio-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #444;
}

.precio-row.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f8f9fa;
  font-weight: 700;
  font-size: 20px;
  color: #222;
}

.pago-garantia {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f0f7ff;
  border-radius: 12px;
  color: #0056b3;
}

.pago-garantia i {
  font-size: 24px;
}

.pago-garantia p {
  font-size: 12px;
  margin: 0;
  font-weight: 600;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 850px) {
  .pago-grid {
    grid-template-columns: 1fr;
  }
  .pago-sidebar {
    order: -1;
  }
}
</style>
