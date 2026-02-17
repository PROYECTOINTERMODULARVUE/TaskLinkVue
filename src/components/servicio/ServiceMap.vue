<script setup>
defineProps({
  urlMapaGoogle: String,
})
</script>

<template>
  <section class="location-section">
    <h3 class="section-title">Ubicación y cobertura</h3>
    <div v-if="urlMapaGoogle" class="map-container">
      <iframe
        :src="urlMapaGoogle"
        width="100%"
        height="100%"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      >
      </iframe>
    </div>
    <div v-else class="map-placeholder location-unavailable">
      <div class="map-overlay">
        <i class="bi bi-geo-alt"></i>
        <span>Ubicación no disponible</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}

.map-container {
  height: 400px;
  background: #f7f7f7;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.map-placeholder {
  height: 300px;
  background: #f7f7f7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.location-unavailable {
  background: #fffafa;
  border: 1px dashed #ff385c;
}

.map-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #717171;
}
.map-overlay i {
  font-size: 32px;
  color: #ff385c;
}
@media (max-width: 992px) {
  .map-container {
    height: 150px;
  }
}
</style>
