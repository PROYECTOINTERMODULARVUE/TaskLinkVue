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
const zonas = ref([])
const previewUrl = ref(null)
const previewExtraUrls = ref([])

const form = ref({
  Nombre: '',
  Descripcion: '',
  Precio: 0,
  Duracion: 60,
  idCategoria: '',
  idZona: '',
  lat: null,
  lng: null,
  foto: null,
  fotos: [],
  disponibilidades: [],
})

const newSlot = ref({
  dia_semana: 1,
  hora_inicio: '09:00',
  hora_fin: '14:00',
})

const diasSemana = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

const addSlot = () => {
  if (!newSlot.value.hora_inicio || !newSlot.value.hora_fin) return

  form.value.disponibilidades.push({
    ...newSlot.value,
    activo: true,
  })

  // Reset para el siguiente
  newSlot.value = {
    dia_semana: 1,
    hora_inicio: '09:00',
    hora_fin: '14:00',
  }
}

const removeSlot = (index) => {
  form.value.disponibilidades.splice(index, 1)
}

const getDiaLabel = (value) => {
  return diasSemana.find((d) => d.value === value)?.label || 'Desconocido'
}

const fetchCategories = async () => {
  try {
    const res = await api.categorias.getAll()
    categorias.value = res
  } catch (error) {
    console.error('Error fetching categories', error)
  }
}

const fetchZonas = async () => {
  try {
    const res = await api.zonas.getAll()
    zonas.value = res
  } catch (error) {
    console.error('Error fetching zones', error)
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
    form.value.idZona = res.idZona || (res.zona ? res.zona.id : '')
    form.value.lat = res.lat
    form.value.lng = res.lng

    if (res.ImagenUrl) {
      previewUrl.value = res.ImagenUrl
    }

    if (res.disponibilidad && res.disponibilidad.length > 0) {
      form.value.disponibilidades = res.disponibilidad.map((d) => ({
        dia_semana: d.dia_semana,
        hora_inicio: d.hora_inicio,
        hora_fin: d.hora_fin,
        activo: !!d.activo,
      }))
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

const handleExtraFilesUpload = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 15) {
    alert('Máximo 15 fotos permitidas')
    event.target.value = '' // Clear input
    return
  }
  form.value.fotos = files

  // Create previews
  previewExtraUrls.value = files.map((file) => URL.createObjectURL(file))
}

// Sync coordinates when zone changes
const handleZonaChange = () => {
  const selectedZona = zonas.value.find((z) => z.id === form.value.idZona)
  if (selectedZona) {
    form.value.lat = selectedZona.lat
    form.value.lng = selectedZona.lng
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('Nombre', form.value.Nombre)
    formData.append('Descripcion', form.value.Descripcion)
    formData.append('Precio', form.value.Precio)
    formData.append('Duracion', form.value.Duracion)
    formData.append('idCategoria', form.value.idCategoria)
    formData.append('idZona', form.value.idZona)

    if (form.value.lat) formData.append('lat', form.value.lat)
    if (form.value.lng) formData.append('lng', form.value.lng)

    if (form.value.foto) formData.append('foto', form.value.foto)

    if (form.value.fotos && form.value.fotos.length > 0) {
      form.value.fotos.forEach((file, index) => {
        formData.append(`fotos[${index}]`, file)
      })
    }

    if (form.value.disponibilidades && form.value.disponibilidades.length > 0) {
      formData.append('disponibilidad', JSON.stringify(form.value.disponibilidades))
    }

    if (isEditing.value) {
      // For editing, we might need to handle existing photos vs new ones differently depending on backend
      // Assuming for now simple update logic
      // Note: method spoofing for Laravel might be needed if using POST for PUT with files
      await api.proveedor.updateServicio(route.query.edit, formData)
      alert('Servicio actualizado correctamente')
    } else {
      await api.proveedor.createServicio(formData)
      alert('Servicio creado correctamente')
    }
    router.push('/perfil')
  } catch (error) {
    console.error('Error saving service', error)
    if (error.response && error.response.status === 422) {
      console.log('Validation Errors:', error.response.data.errors)
      alert('Error de validación: ' + JSON.stringify(error.response.data.errors))
    } else {
      alert('Error al guardar el servicio. Revisa los datos.')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchZonas()])
  if (isEditing.value) {
    await fetchService(route.query.edit)
  }
  loading.value = false
})
</script>

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

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="categoria" class="form-label">Categoría *</label>
          <select v-model="form.idCategoria" class="form-select" id="categoria" required>
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="cat in categorias" :key="cat.IDCategoria" :value="cat.IDCategoria">
              {{ cat.Nombre }}
            </option>
          </select>
        </div>

        <div class="col-md-6 mb-3">
          <label for="zona" class="form-label">Zona *</label>
          <select
            v-model="form.idZona"
            @change="handleZonaChange"
            class="form-select"
            id="zona"
            required
          >
            <option value="" disabled>Selecciona una zona</option>
            <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
              {{ zona.nombre }}
            </option>
          </select>
        </div>
      </div>

      <div class="mb-4">
        <label for="foto" class="form-label">Foto Principal (Opcional)</label>
        <input
          @change="handleFileUpload"
          type="file"
          class="form-control"
          id="foto"
          accept="image/jpeg, image/png, image/jpg, image/webp"
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

      <div class="mb-4">
        <label for="fotos-extra" class="form-label">Más fotos (Máximo 15)</label>
        <input
          @change="handleExtraFilesUpload"
          type="file"
          class="form-control"
          id="fotos-extra"
          accept="image/jpeg, image/png, image/jpg, image/webp"
          multiple
        />
        <div v-if="previewExtraUrls.length" class="mt-3 d-flex flex-wrap gap-2">
          <img
            v-for="(url, index) in previewExtraUrls"
            :key="index"
            :src="url"
            alt="Vista previa extra"
            class="img-thumbnail"
            style="width: 100px; height: 100px; object-fit: cover"
          />
        </div>
        <div class="form-text">Selecciona hasta 15 fotos para la galería de tu servicio.</div>
      </div>

      <div class="availability-section mb-4 p-3 border rounded">
        <h3 class="h5 mb-3">Disponibilidad Horaria</h3>

        <div class="row g-2 mb-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label small">Día</label>
            <select v-model="newSlot.dia_semana" class="form-select form-select-sm">
              <option v-for="dia in diasSemana" :key="dia.value" :value="dia.value">
                {{ dia.label }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small">Inicio</label>
            <input v-model="newSlot.hora_inicio" type="time" class="form-control form-control-sm" />
          </div>
          <div class="col-md-3">
            <label class="form-label small">Fin</label>
            <input v-model="newSlot.hora_fin" type="time" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2">
            <button type="button" @click="addSlot" class="btn btn-sm btn-outline-primary w-100">
              <i class="bi bi-plus-lg"></i> Añadir
            </button>
          </div>
        </div>

        <div v-if="form.disponibilidades.length" class="slots-list mt-3">
          <div
            v-for="(slot, index) in form.disponibilidades"
            :key="index"
            class="slot-item d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded border"
          >
            <div>
              <span class="fw-bold me-2">{{ getDiaLabel(slot.dia_semana) }}:</span>
              <span
                >{{ slot.hora_inicio.substring(0, 5) }} - {{ slot.hora_fin.substring(0, 5) }}</span
              >
            </div>
            <button
              type="button"
              @click="removeSlot(index)"
              class="btn btn-sm btn-link text-danger p-0"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div v-else class="text-muted small italic">
          No has añadido franjas de disponibilidad. Los usuarios no podrán reservar.
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
