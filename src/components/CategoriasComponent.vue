<script setup>
import { usecategoriasStore } from '@/stores/categoria'
import { onMounted } from 'vue'

const categoriaStore = usecategoriasStore()

const props = defineProps({
  categoria: {
    type: Object,
    required: true,
  },
})

onMounted(async () => {
  categoriaStore.todasLasCategorias()
})
</script>

<template>
  <div class="categoria">
    <img :src="categoria.imagen_url" alt="" />
    <h3>{{ categoria.Nombre }}</h3>
  </div>
</template>

<style scoped>
.categoria {
  flex: 0 0 auto; /* Don't shrink */
  width: 160px; /* Increased from 120px */
  text-align: center;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.2s;
  padding: 10px;
}

.categoria:hover {
  transform: translateY(-5px);
}

.categoria img {
  width: 120px; /* Increased from 80px */
  height: 120px; /* Increased from 80px */
  border-radius: 50%; /* Circle images */
  object-fit: cover;
  margin-bottom: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  border: 4px solid white;
}

.categoria h3 {
  font-size: 16px; /* Increased from 14px */
  font-weight: 700;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
