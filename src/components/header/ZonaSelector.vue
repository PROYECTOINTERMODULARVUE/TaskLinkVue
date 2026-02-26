<script setup>
import { usezonasStore } from '@/stores/zona'
import { useSearchStore } from '@/stores/search'
import { computed, onMounted, ref, watch } from 'vue'

const zonasStore = usezonasStore()
const searchStore = useSearchStore()
const textoZona = ref(searchStore.pending.zona ? searchStore.pending.zona.nombre : 'Buscar destinos')
const verZonas = ref(false)
const filtroZona = ref('')

onMounted(async () => {
  await zonasStore.todasLasZonas()
})

// Sync text if store changes (e.g. reset)
watch(
  () => searchStore.pending.zona,
  (newZona) => {
    textoZona.value = newZona ? newZona.nombre : 'Buscar destinos'
  },
)

const mostrarZonas = () => {
  verZonas.value = !verZonas.value
  if (verZonas.value) {
    filtroZona.value = ''
    // Optional: Focus logic could go here if we had a ref to the input
  }
}

const seleccionarZona = (zona) => {
  textoZona.value = zona.nombre
  searchStore.setZona(zona)
  verZonas.value = false
  filtroZona.value = ''
}

const limpiarZona = (e) => {
  e.stopPropagation()
  searchStore.setZona(null)
  searchStore.triggerSearch() // Update results immediately
  verZonas.value = false
}

const zonasFiltradas = computed(() => {
  const busqueda = filtroZona.value.toLowerCase().trim()
  let result = zonasStore.zonas

  if (busqueda) {
    result = result.filter((zona) => zona.nombre.toLowerCase().includes(busqueda))
  }

  return result.slice(0, 10) // Limit to 10 results
})
</script>

<template>
  <div class="zonaSelectorWrapper" tabindex="0" @blur="verZonas = false">
    <!-- Trigger Text -->
    <div class="selector-trigger" @click="mostrarZonas">
      <div class="display-content">
        <span :class="{ 'has-value': searchStore.pending.zona }">{{ textoZona }}</span>
        <button v-if="searchStore.pending.zona" class="clear-btn" @click.stop="limpiarZona">✕</button>
      </div>
    </div>

    <!-- Dropdown -->
    <div class="zonaOptions" v-if="verZonas" @mousedown.prevent>
      <!-- Internal Search Input -->
      <div class="search-container">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="filtroZona"
          type="text"
          placeholder="Buscar zonas..."
          class="inputZonasInternal"
          @click.stop
        />
      </div>

      <div class="zonaList">
        <div
          class="zonaOpcion"
          v-for="zona in zonasFiltradas"
          :key="zona.id"
          @click="seleccionarZona(zona)"
        >
          <div class="icon-map-pin">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <span>{{ zona.nombre }}</span>
        </div>

        <div v-if="zonasFiltradas.length === 0 && filtroZona" class="no-results">
          No se encontraron zonas
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zonaSelectorWrapper {
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
.zonaOptions {
  position: absolute;
  top: 60px;
  left: -20px;
  width: 350px;
  background: white;
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  z-index: 100;
  animation: slideDown 0.2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Internal Search Input */
.search-container {
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 12px 16px;
  gap: 10px;
}

.search-icon {
  font-size: 16px;
  color: #222;
  font-weight: bold;
}

.inputZonasInternal {
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #222;
  width: 100%;
  outline: none;
}

.inputZonasInternal::placeholder {
  color: #717171;
  font-weight: 400;
}

/* List */
.zonaList {
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.zonaOpcion {
  padding: 12px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
  color: #222;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.zonaOpcion:hover {
  background: #f7f7f7;
}

.icon-map-pin {
  background: #ebebeb;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222;
}

.no-results {
  padding: 12px;
  color: #717171;
  text-align: center;
  font-size: 14px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 950px) {
  .zonaOptions {
    width: 100%;
    left: 0;
    position: static;
    box-shadow: none;
    border: 1px solid #eee;
    margin-top: 10px;
  }
}
</style>
