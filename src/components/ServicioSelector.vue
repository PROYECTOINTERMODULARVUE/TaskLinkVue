<script setup>
import { usecategoriasStore } from '@/stores/categoria'
import { computed, onMounted, ref } from 'vue'

const categoriasStore = usecategoriasStore()
const textoCategoria = ref('Añade un servicio')
const filtro = ref('')
const mostrarSugerencias = ref(false)

onMounted(async () => {
  await categoriasStore.todasLasCategorias()
})

const categoriasFiltrados = computed(() => {
  const busqueda = filtro.value.toLowerCase().trim()
  let lista = categoriasStore.categorias
  if (busqueda) {
    lista = lista.filter((categoria) => categoria.Nombre.toLowerCase().includes(busqueda))
  }
  return lista.slice(0, 10)
})

const seleccionarCategoria = (categoria) => {
  textoCategoria.value = categoria.Nombre
  mostrarSugerencias.value = false
  filtro.value = ''
}

const toggleSugerencias = () => {
  mostrarSugerencias.value = !mostrarSugerencias.value
  if (mostrarSugerencias.value) {
    filtro.value = ''
  }
}
</script>

<template>
  <div class="servicioSelectorWrapper" tabindex="0" @blur="mostrarSugerencias = false">
    <!-- Trigger -->
    <p class="selector-trigger" @click="toggleSugerencias">{{ textoCategoria }}</p>

    <!-- Dropdown -->
    <div v-if="mostrarSugerencias" class="categoriaSuggestions" @mousedown.prevent>
      <!-- Internal Search Input -->
      <div class="search-container">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="filtro"
          type="text"
          placeholder="Buscar servicios..."
          class="inputInternal"
          @click.stop
        />
      </div>

      <div class="list-container">
        <div
          v-for="categoria in categoriasFiltrados"
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

        <div v-if="categoriasFiltrados.length === 0 && filtro" class="no-results">
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
  font-size: 14px;
  color: #717171;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 0;
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
