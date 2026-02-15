<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <router-link to="/">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 80px;
}

.not-found h1 {
  font-size: 5rem;
  color: #ef4444;
}

.not-found a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: bold;
}
</style>
