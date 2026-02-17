<script setup>
defineProps({
  fotoPrincipal: String,
  fotosSecundarias: Array,
})
</script>

<template>
  <div class="gallery-grid">
    <div class="main-image-wrapper">
      <img :src="fotoPrincipal" alt="Principal" class="gallery-img main-img" />
    </div>
    <div class="secondary-images">
      <img
        v-for="(url, index) in fotosSecundarias"
        :key="index"
        :src="url"
        :alt="`Detalle ${index + 1}`"
        class="gallery-img"
      />
    </div>
  </div>
</template>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 480px;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 48px;
}

.main-image-wrapper {
  height: 100%;
}
.secondary-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
  cursor: pointer;
}

.gallery-img:hover {
  filter: brightness(0.9);
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
  .secondary-images {
    display: none;
  }
}
</style>
