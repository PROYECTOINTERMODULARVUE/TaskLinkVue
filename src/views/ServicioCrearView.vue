<template>
  <div class="crear-servicio-container">
    <div class="d-flex align-items-center mb-4">
      <router-link to="/perfil" class="btn btn-outline-secondary me-3">
        <i class="bi bi-arrow-left"></i> Volver
      </router-link>
      <h1 class="page-title mb-0">{{ isEditing ? 'Editar Servicio' : 'Crear Nuevo Servicio' }}</h1>
    </div>

    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <form v-else @submit.prevent="submitForm" class="service-form card p-4 shadow-sm">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre del Servicio *</label>
        <input
          v-model="form.Nombre"
          type="text"
          class="form-control"
          id="nombre"
          required
          minlength="3"
          maxlength="200"
        />
      </div>

      <div class="mb-3">
        <label for="descripcion" class="form-label">Descripción *</label>
        <textarea
          v-model="form.Descripcion"
          class="form-control"
          id="descripcion"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="precio" class="form-label">Precio (€) *</label>
          <input
            v-model.number="form.Precio"
            type="number"
            step="0.01"
            class="form-control"
            id="precio"
            required
            min="0"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label for="duracion" class="form-label">Duración (minutos) *</label>
          <input
            v-model.number="form.Duracion"
            type="number"
            class="form-control"
            id="duracion"
            required
            min="1"
          />
        </div>
      </div>

      <div class="mb-3">
        <label for="categoria" class="form-label">Categoría *</label>
        <select v-model="form.idCategoria" class="form-select" id="categoria" required>
          <option value="" disabled>Selecciona una categoría</option>
          <option v-for="cat in categorias" :key="cat.IDCategoria" :value="cat.IDCategoria">
            {{ cat.Nombre }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="direccion" class="form-label">Dirección (Opcional)</label>
        <input
          v-model="form.Direccion"
          type="text"
          class="form-control"
          id="direccion"
          placeholder="Calle, Ciudad..."
        />
        <div class="form-text">Si el servicio es a domicilio o en una ubicación específica.</div>
      </div>

      <!-- Hidden lat/lng for now, could be added with a map picker later -->

      <div class="mb-4">
        <label for="foto" class="form-label">Foto del Servicio (Opcional)</label>
        <input
          @change="handleFileUpload"
          type="file"
          class="form-control"
          id="foto"
          accept="image/*"
        />
        <div v-if="previewUrl" class="mt-3">
          <img
            :src="previewUrl"
            alt="Vista previa"
            class="img-thumbnail"
            style="max-height: 200px"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <router-link to="/perfil" class="btn btn-secondary">Cancelar</router-link>
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Guardando...' : isEditing ? 'Actualizar Servicio' : 'Crear Servicio' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => !!route.query.edit)
const loading = ref(true)
const submitting = ref(false)
const categorias = ref([])
const previewUrl = ref(null)

const form = ref({
  Nombre: '',
  Descripcion: '',
  Precio: 0,
  Duracion: 60,
  idCategoria: '',
  Direccion: '',
  foto: null,
})

const fetchCategories = async () => {
  try {
    const res = await api.categorias.getAll()
    categorias.value = res
  } catch (error) {
    console.error('Error fetching categories', error)
  }
}

const fetchService = async (id) => {
  try {
    const res = await api.servicios.getOne(id)
    form.value.Nombre = res.Nombre
    form.value.Descripcion = res.Descripcion
    form.value.Precio = res.Precio
    form.value.Duracion = res.Duracion
    form.value.idCategoria = res.idCategoria || (res.categoria ? res.categoria.IDCategoria : '')
    form.value.Direccion = res.Direccion || '' // Field might not exist in public API, need check

    // If existing photo, showing as preview might be tricky without direct URL,
    // but normally we can use res.ImagenUrl
    if (res.ImagenUrl) {
      previewUrl.value = res.ImagenUrl
    }
  } catch (error) {
    console.error('Error fetching service', error)
    alert('No se pudo cargar el servicio')
    router.push('/perfil')
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.foto = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      // Update
      // If checking for file upload, we might need different handling (JSON vs FormData)
      // api.proveedor.updateServicio expects FormData if utilizing the method I added that sets _method=PUT
      const formData = new FormData()
      formData.append('Nombre', form.value.Nombre)
      formData.append('Descripcion', form.value.Descripcion)
      formData.append('Precio', form.value.Precio)
      formData.append('Duracion', form.value.Duracion)
      formData.append('idCategoria', form.value.idCategoria)
      if (form.value.Direccion) formData.append('Direccion', form.value.Direccion)
      if (form.value.foto) formData.append('foto', form.value.foto) // Only append if new file

      // Note: updateServicio in api.js uses POST with _method=PUT to support files
      // But if we want to update ONLY text fields using PUT JSON, we could.
      // However, FormData is safer for all-in-one.
      await api.proveedor.updateServicio(route.query.edit, formData)
      alert('Servicio actualizado correctamente')
    } else {
      // Create
      const formData = new FormData()
      formData.append('Nombre', form.value.Nombre)
      formData.append('Descripcion', form.value.Descripcion)
      formData.append('Precio', form.value.Precio)
      formData.append('Duracion', form.value.Duracion)
      formData.append('idCategoria', form.value.idCategoria)
      if (form.value.Direccion) formData.append('Direccion', form.value.Direccion)
      if (form.value.foto) formData.append('foto', form.value.foto)

      await api.proveedor.createServicio(formData)
      alert('Servicio creado correctamente')
    }
    router.push('/perfil')
  } catch (error) {
    console.error('Error saving service', error)
    alert('Error al guardar el servicio. Revisa los datos.')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  if (isEditing.value) {
    await fetchService(route.query.edit)
  }
  loading.value = false
})
</script>

<style scoped>
.crear-servicio-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.service-form {
  background-color: white;
  border-radius: 8px;
  border: none;
}
</style>
