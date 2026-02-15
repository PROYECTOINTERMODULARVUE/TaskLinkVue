<script setup>
import { usezonasStore } from '@/stores/zona';
import { computed, onMounted, ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate'


const zonasStore = usezonasStore();
const textoZona = ref('Buscar destinos');
const verZonas = ref(false);
const filtroZona = ref('');

onMounted(async () => {
    await zonasStore.todasLasZonas();
});


const mostrarZonas = () => {
    verZonas.value = !verZonas.value;
    if (verZonas.value) {
        filtroZona.value = '';
    }
};

const zonasFiltradas = computed(() => {
    const busqueda = filtroZona.value.toLowerCase().trim();
    if (!busqueda) {
        return zonasStore.zonas;
    }
    return zonasStore.zonas.filter(zona =>
        zona.nombre.toLowerCase().includes(busqueda)
    );
});


</script>

<template>
    <div class="searchBarZona" @click="mostrarZonas" @blur="verZonas = false" tabindex="0">
        <h5>Zonas</h5>
        <div>
            <p id="zonaTexto">{{ textoZona }}</p>
        </div>

        <div v-if="verZonas" class="zonaOptions">
            <Field v-model="filtroZona" type="text" placeholder="Buscar zona..." @click.stop  class="inputZonas"/>

            <div class="zonaOpcion" v-for="zona in zonasFiltradas" :key="zona.id" @click.stop="() => {
                textoZona = zona.nombre;
                verZonas = false;
                filtro = '';
            }">
                {{ zona.nombre }}
            </div>

            <div v-if="zonasFiltradas.length === 0 && filtro" class="no-results">
                No se encontraron zonas
            </div>
        </div>
    </div>
</template>
<style scoped>
.searchBarZona {
    position: relative;
    flex: 1;
    padding: 12px 16px;
    border-radius: 14px;
    background: #f5f9ff;
    border: 1px solid #d6e4ff;
    cursor: pointer;
    transition: all 0.25s ease;
}

.searchBarZona:hover {
    background: #eef4ff;
    border-color: #a9c6ff;
}

.zonaOptions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 12px 35px rgba(0, 60, 160, 0.15);
    margin-top: 9px;
    z-index: 30;
    animation: slideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    min-width: 520px;
}

.zonaOpcion {
    padding: 10px 16px;
    border-radius: 12px;
    transition: all 0.2s ease;
    color: #2b4ea2;
    border: 1px solid transparent;
}

h5 {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: #2b4ea2;
}

p {
    margin: 0;
    font-size: 14px;
    color: #2b4ea2;
}

.inputZonas{
    width: 100%;
    padding: 10px 16px;
    margin-bottom: 12px;
    border-radius: 12px;
    border: 1px solid #d6e4ff;
    transition: all 0.2s ease;
    color: #2b4ea2;
}
.inputZonas:focus {
    outline: none;
    border-color: #a9c6ff;
}


@keyframes slideDown {
    0% {
        opacity: 0;
        transform: translateY(-12px) scale(0.96);
    }

    60% {
        opacity: 1;
        transform: translateY(4px) scale(1.01);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}
</style>




