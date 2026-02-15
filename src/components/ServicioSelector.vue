<script setup>

import { usecategoriasStore } from '@/stores/categoria';
import { computed, onMounted, ref } from 'vue';

const categoriasStore = usecategoriasStore();
const textoCategoria = ref('Añade un servicio');
const filtro = ref('');
const mostrarSugerencias = ref(false);

onMounted(async () => {
    await categoriasStore.todasLasCategorias();
});


const categoriasFiltrados = computed(() => {
    const busqueda = filtro.value.toLowerCase().trim();
    const lista = categoriasStore.categorias;
    if (!busqueda) return lista;
    return lista.filter(categoria =>
        categoria.Nombre.toLowerCase().includes(busqueda)
    );
});

const seleccionarCategoria = (categoria) => {
    textoCategoria.value = categoria.Nombre;
    mostrarSugerencias.value = false;
    filtro.value = '';
}; 

const toggleSugerencias = () => {
    mostrarSugerencias.value = !mostrarSugerencias.value;
    if (mostrarSugerencias.value) {
        filtro.value = '';
    }
};
</script>
<template>
    <div class="searchBarCategoria" @click="toggleSugerencias" @blur="mostrarSugerencias = false" tabindex="0">
        <h5>Tipo de servicio</h5>
        <p id="zonaCategoria">{{ textoCategoria }}</p>

        <div v-if="mostrarSugerencias" class="categoriaSuggestions">
            <div class="categoria-container">
                <div class="categoria-results" id="categoriaResults">
                    <div v-for="categoria in categoriasFiltrados" :key="categoria.id" class="categoria-option"
                        @click.stop="seleccionarCategoria(categoria)">
                        {{ categoria.Nombre }}
                    </div>
                    <div v-if="categoriasFiltrados.length === 0 && filtro" class="no-results">
                        No se encontraron categorias
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.searchBarCategoria {
    position: relative;
    padding: 12px 16px;
    border-radius: 14px;
    background: #f5f9ff;
    border: 1px solid #d6e4ff;
    cursor: pointer;
    transition: all 0.25s ease;
}

.searchBarCategoria:hover {
    background: #eef4ff;
    border-color: #a9c6ff;
}

.categoriaSuggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 12px 35px rgba(0, 60, 160, 0.15);
    margin-top: 8px;
    z-index: 30;
    animation: slideDown 0.3s ease;
}

.categoriaInput {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 12px;
    box-sizing: border-box;
}

.categoria-option {
    padding: 10px 16px;
    border-radius: 12px;
    color: #2b4ea2;
    cursor: pointer;
    transition: background 0.2s;
}

.categoria-option:hover {
    background: #f0f6ff;
}

.no-results {
    padding: 10px;
    color: #888;
    font-style: italic;
    text-align: center;
}

h5 {
    margin: 0 0 6px 0;
    font-size: 12px;
    font-weight: 600;
    color: #2b4ea2;
}

#zonaCategoria {
    margin: 0;
    font-size: 14px;
    color: #2b4ea2;
}

@keyframes slideDown {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>