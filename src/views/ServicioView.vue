<script setup>
import { useserviciosStore } from '@/stores/servicio'
import { useusuarioStore } from '@/stores/usuario'
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Importar subcomponentes
import ServiceHeader from '@/components/servicio/ServiceHeader.vue'
import ServiceGallery from '@/components/servicio/ServiceGallery.vue'
import ServiceInfo from '@/components/servicio/ServiceInfo.vue'
import ServiceMap from '@/components/servicio/ServiceMap.vue'
import ServiceReviews from '@/components/servicio/ServiceReviews.vue'
import ServiceBookingWidget from '@/components/servicio/ServiceBookingWidget.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const servicioStore = useserviciosStore()
const usuarioStore = useusuarioStore()
const { servicioPasado } = storeToRefs(servicioStore)
const { datosUsuario } = storeToRefs(usuarioStore)
const cargandoReserva = ref(false)

const urlMapaGoogle = computed(() => {
  if (!servicioPasado.value?.lat || !servicioPasado.value?.lng) return null
  return `https://maps.google.com/maps?q=${servicioPasado.value.lat},${servicioPasado.value.lng}&hl=es&z=14&output=embed`
})

onMounted(async () => {
  const servicio = await servicioStore.unaServicio(id)
  servicioStore.setServicioPasado(servicio)
  if (!datosUsuario.value) {
    await usuarioStore.cargarUsuario()
  }
})

const getInicial = (nombre) => {
  return nombre ? nombre.charAt(0).toUpperCase() : '?'
}

const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha))
}

const reseñasVisibles = computed(() => {
  return servicioPasado.value?.valoraciones?.slice(0, 5) || []
})

const yaHaComentado = computed(() => {
  if (!datosUsuario.value || !servicioPasado.value?.valoraciones) return false
  return servicioPasado.value.valoraciones.some((v) => v.idUsuario === datosUsuario.value.id)
})

const fotoPrincipal = computed(() => {
  const fotos = servicioPasado.value?.fotos || []
  const principal = fotos.find((f) => f.EsPrincipal === 1)
  return (
    principal?.Url ||
    principal?.ImagenUrl ||
    servicioPasado.value?.ImagenUrl ||
    servicioPasado.value?.categoria?.ImagenUrl
  )
})

const fotosSecundarias = computed(() => {
  const fotos = servicioPasado.value?.fotos || []
  // Filtramos la que ya estamos usando como principal (si existe en el array)
  const principal = fotos.find((f) => f.EsPrincipal === 1)
  const filtradas = fotos.filter((f) => f !== principal)

  // Si no hay secundarias, podemos repetir la principal o dejarlo vacío
  // Pero para el diseño Airbnb, mejor rellenar con lo que tengamos
  const resultado = filtradas.slice(0, 4).map((f) => f.Url || f.ImagenUrl)

  // Fallback: si no hay suficientes secundarios, rellenar con la principal o categoría
  while (resultado.length < 4) {
    resultado.push(servicioPasado.value?.ImagenUrl || servicioPasado.value?.categoria?.ImagenUrl)
  }
  return resultado
})

const reservarServicio = async () => {
  if (!datosUsuario.value) {
    alert('Debes iniciar sesión para reservar este servicio.')
    return
  }

  cargandoReserva.value = true
  // Simulamos una acción de reserva
  setTimeout(() => {
    alert(`¡Solicitud de reserva enviada para: ${servicioPasado.value.Nombre}!`)
    cargandoReserva.value = false
  }, 1000)
}

const irALogin = () => {
  router.push('/login')
}
</script>

<template>
  <div v-if="servicioPasado" class="main-container">
    <ServiceHeader
      :nombre="servicioPasado.Nombre"
      :puntuacion="servicioPasado.PromedioValoracion"
      :total-reseñas="servicioPasado.valoraciones?.length || 0"
      :zona-nombre="servicioPasado.zona?.nombre"
    />

    <ServiceGallery :foto-principal="fotoPrincipal" :fotos-secundarias="fotosSecundarias" />

    <div class="content-wrapper">
      <div class="main-column">
        <ServiceInfo
          :proveedor="servicioPasado.proveedor"
          :descripcion="servicioPasado.Descripcion"
          :get-inicial="getInicial"
        />

        <section class="section-divider"></section>

        <ServiceMap :url-mapa-google="urlMapaGoogle" />

        <section class="section-divider"></section>

        <ServiceReviews
          :datos-usuario="datosUsuario"
          :reseñas-visibles="reseñasVisibles"
          :ya-ha-comentado="yaHaComentado"
          :get-inicial="getInicial"
          :formatear-fecha="formatearFecha"
          @ir-a-login="irALogin"
        />
      </div>

      <ServiceBookingWidget
        :precio="servicioPasado.Precio"
        :cargando-reserva="cargandoReserva"
        @reservar="reservarServicio"
      />
    </div>
  </div>
  <div v-else class="loading-state">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p>Cargando información del servicio...</p>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 80px;
}

.section-divider {
  border-bottom: 1px solid #dddddd;
  margin: 32px 0;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 100px;
  color: #717171;
}

@media (max-width: 992px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .main-container {
    padding-bottom: 100px; /* Espacio para el widget fijo inferior */
  }
}
</style>
