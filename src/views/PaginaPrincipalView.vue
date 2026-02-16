<script setup>
import CategoriasComponent from '@/components/CategoriasComponent.vue'
import ServicioCard from '@/components/ServicioCard.vue'
import { usecategoriasStore } from '@/stores/categoria'
import { useserviciosStore } from '@/stores/servicio'
import { onMounted, ref, computed } from 'vue'

const categoriaStore = usecategoriasStore()
const serviciosStore = useserviciosStore()

// Refs for scroll containers
const catListRef = ref(null)
const servListRef = ref(null)
const catRefs = ref({})

onMounted(async () => {
  categoriaStore.todasLasCategorias()
  serviciosStore.todasLasServicios()
})

// Agrupar servicios por categoría
const serviciosAgrupados = computed(() => {
  const grupos = {}
  serviciosStore.servicios.forEach((servicio) => {
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
        />
      </div>
      <button class="nav-btn right" @click="scrollCarousel('cat', 'right')">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>

  <div class="servicios-container">
    <h2>Servicios Destacados</h2>
    <div class="carousel-wrapper">
      <button class="nav-btn left" @click="scrollCarousel('serv', 'left')">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div class="servicios-list" ref="servListRef">
        <ServicioCard
          v-for="servicio in serviciosStore.servicios"
          :key="servicio.id"
          :servicio="servicio"
        />
      </div>
      <button class="nav-btn right" @click="scrollCarousel('serv', 'right')">
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
          />
        </div>
        <button class="nav-btn right" @click="scrollCarousel(grupo.nombre, 'right')">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
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
</style>
