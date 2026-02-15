<script setup>
import FechaSelector from './FechaSelector.vue';
import ServicioSelector from './ServicioSelector.vue';
import ZonaSelector from './ZonaSelector.vue';

</script>

<template>
    <div class="buscador">
        <ZonaSelector />
        <FechaSelector />
        <ServicioSelector />
        <button class="buscarBtn">Buscar</button>
    </div>
</template>

<style scoped>
.buscador {
    display: flex;
    gap: 16px;
    width: 100%;
}

.buscador>* {
    flex: 1;
    min-width: 0;
}
.buscarBtn {
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.25s ease;
}
</style>