<script setup>
import { ref, onMounted } from 'vue'
import { usezonasStore } from '@/stores/zona'

const props = defineProps({
  servicio: {
    type: Object,
    required: true,
  },
})

const zonasStore = usezonasStore()
const direccion = ref('Cargando ubicación...')

/**
 * Calcula la distancia entre dos puntos (haversine formula)
 */
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const obtenerDireccion = async () => {
  try {
    // Si no hay zonas cargadas, las cargamos
    if (zonasStore.zonas.length === 0) {
      await zonasStore.todasLasZonas()
    }

    const { lat: sLat, lng: sLng, radio_km } = props.servicio

    if (!sLat || !sLng) {
      direccion.value = 'Dirección sin Establecer'
      return
    }

    // Buscamos la zona que esté dentro del rango
    const zonaEncontrada = zonasStore.zonas.find((zona) => {
      if (!zona.lat || !zona.lng) return false
      const distancia = calcularDistancia(sLat, sLng, parseFloat(zona.lat), parseFloat(zona.lng))
      return distancia <= radio_km
    })

    if (zonaEncontrada) {
      direccion.value = zonaEncontrada.nombre
    } else {
      direccion.value = '' // Según requisitos, si no está en rango, nada
    }
  } catch (error) {
    console.error('Error al obtener la dirección:', error)
    direccion.value = ''
  }
}

onMounted(() => {
  obtenerDireccion()
  console.log(props.servicio)
})
</script>

<template>
  <div class="servicio-card">
    <div class="servicio-image">
      <img :src="servicio.imagen_url" alt="Servicio" />
      <span class="price-tag">{{ servicio.Precio }}€</span>
    </div>

    <div class="servicio-info">
      <h3>{{ servicio.Nombre }}</h3>
      <p v-if="direccion && direccion !== 'Dirección sin Establecer'" class="servicio-location">
        <i class="bi bi-geo-alt-fill"></i> {{ direccion }}
      </p>

      <!-- Rating placeholder -->
      <div class="servicio-rating">
        <i class="bi bi-star-fill"></i> <span>{{ servicio.promedio_valoracion }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.servicio-card {
  flex: 0 0 auto;
  width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  scroll-snap-align: start;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.servicio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.servicio-image {
  width: 100%;
  height: 180px;
  position: relative;
}

.servicio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.servicio-info {
  padding: 16px;
}

.servicio-info h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.servicio-location {
  font-size: 14px;
  color: #717171;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.servicio-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
}
.servicio-rating i {
  color: #ffc107;
}
</style>
