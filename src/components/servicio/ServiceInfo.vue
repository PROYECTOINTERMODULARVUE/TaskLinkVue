<script setup>
const props = defineProps({
  proveedor: Object,
  descripcion: String,
})

const getInicial = (nombre) => {
  return nombre ? nombre.charAt(0).toUpperCase() : '?'
}
</script>

<template>
  <section class="service-info">
    <section class="host-info">
      <div class="host-text">
        <h2>Servicio ofrecido por {{ proveedor?.Nombre || 'el proveedor' }}</h2>
        <p>Experiencia verificada en TaskLink</p>
      </div>
      <div class="host-image-container">
        <img
          v-if="proveedor?.FotoPerfil"
          :src="proveedor.FotoPerfil"
          class="host-profile-img"
          alt="Foto del proveedor"
        />
        <div v-else class="host-profile-img placeholder-avatar">
          {{ getInicial(proveedor?.Nombre) }}
        </div>
      </div>
    </section>

    <section class="section-divider"></section>

    <section class="description-section">
      <h3 class="section-title">Sobre este servicio</h3>
      <p class="description-text">{{ descripcion }}</p>
    </section>
  </section>
</template>

<style scoped>
.host-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.host-info h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}
.host-info p {
  color: #717171;
  font-size: 16px;
}

.host-profile-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}
.placeholder-avatar {
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #717171;
  font-size: 20px;
}

.section-divider {
  border-bottom: 1px solid #dddddd;
  margin: 32px 0;
}
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}

.description-text {
  font-size: 16px;
  line-height: 24px;
  color: #222;
  white-space: pre-line;
}
</style>
