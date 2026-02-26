<script setup>
import CategoriasComponent from '@/components/CategoriasComponent.vue'
import ServicioCard from '@/components/ServicioCard.vue'
import QuickBookingModal from '@/components/QuickBookingModal.vue'
import { usecategoriasStore } from '@/stores/categoria'
import { useserviciosStore } from '@/stores/servicio'
import { useSearchStore } from '@/stores/search'
import { usezonasStore } from '@/stores/zona'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { format, parseISO } from 'date-fns'

const categoriaStore = usecategoriasStore()
const serviciosStore = useserviciosStore()
const searchStore = useSearchStore()
const zonasStore = usezonasStore()
const router = useRouter()

// Modal state
const showQuickBooking = ref(false)
const selectedService = ref(null)

// Refs for scroll containers
const catListRef = ref(null)
const servListRef = ref(null)
const catRefs = ref({})

onMounted(async () => {
  categoriaStore.todasLasCategorias()
  serviciosStore.todasLasServicios()
  if (zonasStore.zonas.length === 0) {
    zonasStore.todasLasZonas()
  }
  // Intentar obtener la ubicación del usuario para ordenar por proximidad por defecto
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userCoords.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
      },
      (err) => console.log('Ubicación no disponible:', err.message),
    )
  }
})

const userCoords = ref(null)

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

const getDaysInRange = (start, end) => {
  const days = new Set()
  if (!start) return days

  // Usar parseISO para evitar desfases de zona horaria al crear el objeto Date
  const startDate = typeof start === 'string' && start.includes('-') ? parseISO(start) : new Date(start)
  const endDate = end && typeof end === 'string' && end.includes('-') ? parseISO(end) : (end ? new Date(end) : startDate)

  const current = new Date(startDate)
  const stop = new Date(endDate)

  let limit = 0
  while (current <= stop && limit < 31) {
    days.add(current.getDay())
    current.setDate(current.getDate() + 1)
    limit++
  }
  return days
}

// Filtramos los servicios según el store de búsqueda
const serviciosFiltrados = computed(() => {
  let list = [...serviciosStore.servicios]

  if (searchStore.isSearchActive) {
    // Usamos searchStore.active para que solo se actualice al pulsar "Buscar"
    const { servicio, zona, fechas } = searchStore.active

    // 1. Filtrar por categoría
    if (servicio) {
      const catIdBuscado = servicio.IDCategoria || servicio.id || servicio.idCategoria
      list = list.filter((s) => {
        const sCatId =
          s.idCategoria ||
          s.IDCategoria ||
          (s.categoria ? s.categoria.IDCategoria || s.categoria.id || s.categoria.idCategoria : null)
        return Number(sCatId) === Number(catIdBuscado)
      })
    }

    // 2. Filtrar por Fechas (disponibilidad)
    if (fechas && fechas.inicio) {
      const requestedDays = getDaysInRange(fechas.inicio, fechas.fin)
      list = list.filter((s) => {
        let availability = s.disponibilidad || s.disponibilidades || []
        
        // Manejar si la disponibilidad viene como string JSON (a veces ocurre en Laravel)
        if (typeof availability === 'string') {
          try {
            availability = JSON.parse(availability)
          } catch (e) {
            availability = []
          }
        }
        
        if (!Array.isArray(availability) || availability.length === 0) {
          return false // Si no tiene disponibilidad configurada, no sale si buscamos por fecha
        }
        
        return availability.some((slot) => {
          const diaSlot = Number(slot.dia_semana)
          return requestedDays.has(diaSlot)
        })
      })
    }

    // 3. Procesar ubicación (filtro y ordenación)
    const zLat = zona ? parseFloat(zona.lat) : null
    const zLng = zona ? parseFloat(zona.lng) : null
    const uLat = userCoords.value?.lat
    const uLng = userCoords.value?.lng

    // Calculamos distancias por separado para mapear a la lista
    list = list.map((s) => {
      const sLat = parseFloat(s.lat)
      const sLng = parseFloat(s.lng)
      const hasCoords = !isNaN(sLat) && !isNaN(sLng)
      
      let distZona = null
      let distUsuario = null
      
      if (hasCoords) {
        if (!isNaN(zLat) && !isNaN(zLng)) {
          distZona = calcularDistancia(sLat, sLng, zLat, zLng)
        }
        if (uLat && uLng) {
          distUsuario = calcularDistancia(sLat, sLng, uLat, uLng)
        }
      }
      
      return { 
        ...s, 
        distanciaZona: distZona, 
        distanciaUsuario: distUsuario,
        distanciaCalculada: distZona !== null ? distZona : distUsuario 
      }
    })

    // Filtro explícito por Zona si el usuario la seleccionó
    if (zona) {
      const zonaID = Number(zona.id)
      list = list.filter((s) => {
        const matchID = s.idZona && Number(s.idZona) === zonaID
        let matchDistancia = false
        if (s.distanciaZona !== null) {
          const radio = parseFloat(s.radio_km) || 50
          matchDistancia = s.distanciaZona <= radio
        }
        return matchID || matchDistancia
      })
    }

    // Ordenación por proximidad
    list.sort((a, b) => {
      const dA = a.distanciaCalculada
      const dB = b.distanciaCalculada
      if (dA === null && dB === null) return 0
      if (dA === null) return 1
      if (dB === null) return -1
      return dA - dB
    })
  }

  return list
})

// Función para buscar al hacer clic en una categoría
const selectCategoryAndSearch = (categoria) => {
  searchStore.setServicio(categoria) // Actualiza el PENDING
  searchStore.triggerSearch() // Copia PENDING a ACTIVE y activa la búsqueda
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Agrupar servicios por categoría
const serviciosAgrupados = computed(() => {
  const grupos = {}
  serviciosFiltrados.value.forEach((servicio) => {
    if (servicio.categoria && servicio.categoria.Nombre) {
      const catNombre = servicio.categoria.Nombre
      if (!grupos[catNombre]) {
        grupos[catNombre] = {
          nombre: catNombre,
          servicios: [],
        }
      }
      grupos[catNombre].servicios.push(servicio)
    }
  })
  return Object.values(grupos)
})

// Universal scroll function
const scrollCarousel = (refName, direction) => {
  let container
  if (refName === 'cat') {
    container = catListRef.value
  } else if (refName === 'serv') {
    container = servListRef.value
  } else {
    container = catRefs.value[refName]
  }

  if (container) {
    const scrollAmount = 300 // Adjust scroll distance
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }
}

const openQuickBooking = (servicio) => {
  selectedService.value = servicio
  showQuickBooking.value = true
}

const handleBookingSuccess = (idReserva) => {
  showQuickBooking.value = false
  router.push(`/confirmacion-reserva/${idReserva}`)
}
</script>

<template>
  <div class="categorias-container">
    <h2>Categorías</h2>
    <div class="carousel-wrapper">
      <button class="nav-btn left" @click="scrollCarousel('cat', 'left')">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div class="categorias-list" ref="catListRef">
        <CategoriasComponent
          v-for="categoria in categoriaStore.categorias"
          :key="categoria.id"
          :categoria="categoria"
          @click="selectCategoryAndSearch(categoria)"
        />
      </div>
      <button class="nav-btn right" @click="scrollCarousel('cat', 'right')">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>

  <div class="servicios-container">
    <h2 v-if="!searchStore.isSearchActive">Servicios Destacados</h2>
    <h2 v-else>Resultados de búsqueda</h2>
    
    <div v-if="serviciosFiltrados.length === 0" class="no-results-container">
      <div class="no-results-content">
        <i class="bi bi-search"></i>
        <h3>No hemos encontrado servicios que coincidan</h3>
        <p>Prueba con otros filtros o una búsqueda más flexible.</p>
        <button class="btn btn-outline" @click="searchStore.resetFiltros()">Ver todos los servicios</button>
      </div>
    </div>

    <div v-else class="carousel-wrapper">
      <button v-if="serviciosFiltrados.length > 4" class="nav-btn left" @click="scrollCarousel('serv', 'left')">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div class="servicios-list" ref="servListRef">
        <ServicioCard
          v-for="servicio in serviciosFiltrados"
          :key="servicio.id"
          :servicio="servicio"
          @reservar-rapido="openQuickBooking"
        />
      </div>
      <button v-if="serviciosFiltrados.length > 4" class="nav-btn right" @click="scrollCarousel('serv', 'right')">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
  <div
    class="servicios-categorias-container"
    v-for="grupo in serviciosAgrupados"
    :key="grupo.nombre"
  >
    <div class="container-inner">
      <h2>Servicios de {{ grupo.nombre }}</h2>
      <div class="carousel-wrapper">
        <button class="nav-btn left" @click="scrollCarousel(grupo.nombre, 'left')">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="servicios-list" :ref="(el) => (catRefs[grupo.nombre] = el)">
          <ServicioCard
            v-for="servicio in grupo.servicios"
            :key="servicio.id"
            :servicio="servicio"
            @reservar-rapido="openQuickBooking"
          />
        </div>
        <button class="nav-btn right" @click="scrollCarousel(grupo.nombre, 'right')">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>

  <QuickBookingModal 
    v-if="selectedService"
    :show="showQuickBooking"
    :servicio="selectedService"
    @close="showQuickBooking = false"
    @success="handleBookingSuccess"
  />
</template>

<style scoped>
/* Container Styles */
.categorias-container,
.servicios-container {
  padding: 20px 80px; /* Even more side padding */
  max-width: 1600px;
  margin: 0 auto;
}

h2 {
  font-size: 28px; /* Slightly larger title */
  font-weight: 700;
  margin-bottom: 30px;
  color: #333;
  padding-left: 20px;
}

/* Carousel Wrapper for positioning buttons */
.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -20px; /* Allow contents to bleed slightly into padding */
}

/* List Styles (Scrollable Area) */
.categorias-list,
.servicios-list {
  display: flex;
  overflow-x: auto;
  gap: 30px; /* Increased gap */
  padding: 20px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  scrollbar-width: none;
}
/* Hide scrollbar completely for cleaner UI with buttons */
.categorias-list::-webkit-scrollbar,
.servicios-list::-webkit-scrollbar {
  display: none;
}

.servicios-list {
  gap: 24px;
}

/* Navigation Buttons */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #eee;
  width: 56px; /* Larger buttons */
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  z-index: 30;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #2b4ea2; /* Use theme blue for icons */
  font-size: 24px;
}

.nav-btn:hover {
  background: #2b4ea2;
  color: white;
  box-shadow: 0 8px 25px rgba(43, 78, 162, 0.3);
  transform: translateY(-50%) scale(1.1);
  border-color: #2b4ea2;
}

.nav-btn.left {
  left: -70px; /* Moved way out into the 80px padding */
}
.nav-btn.right {
  right: -70px; /* Moved way out into the 80px padding */
}

/* Hide buttons on mobile where touch scroll is natural */
@media (max-width: 950px) {
  .nav-btn {
    display: none;
  }
  .categorias-container,
  .servicios-container {
    padding: 10px 20px;
  }
  .carousel-wrapper {
    margin: 0;
  }
  .categorias-list {
    gap: 15px;
  }
}

.servicios-categorias-container {
  background-color: #f0f7ff; /* Fondo azul premium suave */
  padding: 40px 0;
  margin-bottom: 30px; /* Separación entre cada bloque de categoría */
  border-top: 1px solid #e1effe;
  border-bottom: 1px solid #e1effe;
  border-radius: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.container-inner {
  padding: 0 40px; /* Reducido un poco para que los botones entren más al centro */
  max-width: 1600px;
  margin: 0 auto;
}

.servicios-categorias-container .carousel-wrapper {
  margin: 0;
}

.servicios-categorias-container .servicios-list {
  padding-left: 40px; /* Empuja las cards más a la derecha al empezar */
}

/* Movemos los botones más al centro en las secciones azules */
.servicios-categorias-container .nav-btn.left {
  left: -20px;
}
.servicios-categorias-container .nav-btn.right {
  right: -20px;
}

.servicios-categorias-container h2 {
  color: #1e40af; /* Azul más intenso para que destaque sobre el fondo */
  margin-bottom: 25px;
  border-left: 5px solid #3b82f6;
  padding-left: 15px;
  margin-left: 40px; /* Alineado con las cards */
}

/* No Results Styling */
.no-results-container {
  padding: 60px 20px;
  text-align: center;
  background: white;
  border-radius: 24px;
  border: 2px dashed #e2e8f0;
  margin: 20px 0;
}

.no-results-content i {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
  display: block;
}

.no-results-content h3 {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 8px;
}

.no-results-content p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #2b4ea2;
  color: #2b4ea2;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f0f7ff;
}
</style>
