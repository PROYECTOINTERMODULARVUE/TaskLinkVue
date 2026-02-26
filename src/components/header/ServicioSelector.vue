<script setup>
import { usecategoriasStore } from '@/stores/categoria'
import { useSearchStore } from '@/stores/search'
import { computed, onMounted, ref, watch } from 'vue'

const categoriasStore = usecategoriasStore()
const searchStore = useSearchStore()
const textoCategoria = ref(
  searchStore.pending.servicio ? searchStore.pending.servicio.Nombre : 'Añade un servicio',
)
const verCategorias = ref(false)
const filtroCategoria = ref('')

onMounted(async () => {
  await categoriasStore.todasLasCategorias()
})

// Sync text if store changes (e.g. reset)
watch(
  () => searchStore.pending.servicio,
  (newServ) => {
    textoCategoria.value = newServ ? newServ.Nombre : 'Añade un servicio'
  },
)

const mostrarCategorias = () => {
  verCategorias.value = !verCategorias.value
  if (verCategorias.value) {
    filtroCategoria.value = ''
  }
}

const seleccionarCategoria = (cat) => {
  textoCategoria.value = cat.Nombre
  searchStore.setServicio(cat)
  verCategorias.value = false
  filtroCategoria.value = ''
}

const limpiarServicio = (e) => {
  e.stopPropagation()
  searchStore.setServicio(null)
  searchStore.triggerSearch() // Update results immediately
  verCategorias.value = false
}

const categoriasFiltradas = computed(() => {
  const busqueda = filtroCategoria.value.toLowerCase().trim()
  let result = categoriasStore.categorias

  if (busqueda) {
    result = result.filter((cat) => cat.Nombre.toLowerCase().includes(busqueda))
  }

  return result
})
</script>

<template>
  <div class="servicioSelectorWrapper" tabindex="0" @blur="verCategorias = false">
    <!-- Trigger Text -->
    <div class="selector-trigger" @click="mostrarCategorias">
      <div class="display-content">
        <span :class="{ 'has-value': searchStore.pending.servicio }">{{ textoCategoria }}</span>
        <button v-if="searchStore.pending.servicio" class="clear-btn" @click.stop="limpiarServicio">
          ✕
        </button>
      </div>
    </div>

    <!-- Dropdown -->
    <div v-if="verCategorias" class="categoriaSuggestions" @mousedown.prevent>
      <!-- Internal Search Input -->
      <div class="search-container">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="filtroCategoria"
          type="text"
          placeholder="Buscar servicios..."
          class="inputInternal"
          @click.stop
        />
      </div>

      <div class="list-container">
        <div
          v-for="categoria in categoriasFiltradas"
          :key="categoria.id"
          class="list-option"
          @click.stop="seleccionarCategoria(categoria)"
        >
          <div class="icon-circle">
            <!-- Using tags icon for services -->
            <i class="bi bi-tags-fill"></i>
          </div>
          <span>{{ categoria.Nombre }}</span>
        </div>

        <div v-if="categoriasFiltradas.length === 0 && filtroCategoria" class="no-results">
          No se encontraron servicios
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.servicioSelectorWrapper {
  position: relative;
  width: 100%;
  outline: none;
}

.selector-trigger {
  margin: 0;
  cursor: pointer;
  padding: 0; /* Remove padding to fill container */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.display-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.display-content span {
  font-size: 14px;
  color: #717171;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.display-content span.has-value {
  color: #222;
  font-weight: 600;
}

.clear-btn {
  background: #f7f7f7;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #717171;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #ebebeb;
  color: #222;
}

/* Dropdown */
.categoriaSuggestions {
  position: absolute;
  top: 60px;
  left: -20px;
  width: 360px;
  background: white;
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  margin-top: 10px;
  z-index: 100;
  animation: slideDown 0.25s cubic-bezier(0.2, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* Internal Search Input */
.search-container {
  display: flex;
  align-items: center;
  background: #f1f3f5;
  border-radius: 50px;
  padding: 14px 20px;
  gap: 12px;
  transition: background 0.2s;
}
.search-container:focus-within {
  background: #e9ecef;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.search-icon {
  font-size: 16px;
  color: #222;
  font-weight: bold;
}

.inputInternal {
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 500;
  color: #222;
  width: 100%;
  outline: none;
}

.inputInternal::placeholder {
  color: #717171;
  font-weight: 400;
}

/* List */
.list-container {
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 4px;
}
.list-container::-webkit-scrollbar {
  width: 6px;
}
.list-container::-webkit-scrollbar-track {
  background: transparent;
}
.list-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 10px;
}

.list-option {
  padding: 12px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  color: #222;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.list-option:hover {
  background: #f7f7f7;
  transform: translateX(4px);
}

.icon-circle {
  background: #eaf4ff;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  font-size: 18px;
  flex-shrink: 0;
}

.no-results {
  padding: 20px;
  color: #717171;
  text-align: center;
  font-size: 14px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 950px) {
  .categoriaSuggestions {
    width: 100%;
    left: 0;
    position: static;
    box-shadow: none;
    border: 1px solid #eee;
    margin-top: 10px;
    padding: 16px;
  }
}
</style>
