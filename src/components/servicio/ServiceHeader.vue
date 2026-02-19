<script setup>
defineProps({
  nombre: String,
  puntuacion: [Number, String],
  totalReseñas: Number,
  zonaNombre: String,
  servicioZona: String,
})
</script>

<template>
  <header class="servicio-header">
    <h1>{{ nombre }}</h1>
    <div class="header-info">
      <div class="rating-item">
        <i class="bi bi-star-fill"></i>
        <span class="rating-value">{{ puntuacion }}</span>
        <span class="dot">·</span>
        <span class="reviews-count">{{ totalReseñas }} reseñas</span>
      </div>
      <span class="dot">·</span>
      <div class="location-item">
        <a href="#mapa" class="location-text">{{
          zonaNombre || servicioZona || 'Sin Ubicación Disponible'
        }}</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.servicio-header {
  margin-bottom: 24px;
}

.servicio-header h1 {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bi-star-fill {
  color: #ffc107;
  font-size: 12px;
}

.dot {
  font-weight: 400;
}

.reviews-count,
.location-text {
  text-decoration: underline;
  cursor: pointer;
  color: inherit;
}
</style>
