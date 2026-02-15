<script setup>
import AjustesInicioSesionComponent from './AjustesInicioSesionComponent.vue';
import BuscadorComponent from './BuscadorComponent.vue';

</script>

<template>
    <div class="logo-container">
        <img :src="'/src/assets/img/logo.png'" alt="Logo" class="logo" @click="$router.push('/')">
    </div>
    <div class="searchBar">
        <BuscadorComponent />
    </div>
    <div>
        <AjustesInicioSesionComponent />
    </div>

</template>
<style scoped>
.logo-container {
    display: flex;
    align-items: center;
}

.logo {
    width: 150px;
    height: 75px;
}

.searchBar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background-color: #fdfcff;
    border-radius: 20px;
    box-shadow: 0 6px 15px rgba(0, 60, 160, 0.08);
    max-width: 700px;
    flex: 1;
    transition: all 0.25s ease;
    cursor: pointer;
}
</style>