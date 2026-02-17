<template>
  <div class="admin-users-container">
    <h1>Administración de Usuarios</h1>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        class="form-control"
        placeholder="Buscar por nombre o email..."
      />
    </div>

    <!-- Users Table -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="users.length === 0" class="alert alert-info">No se encontraron usuarios.</div>

    <table v-else class="table table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.IDUsuario">
          <td>{{ user.IDUsuario }}</td>
          <td>{{ user.Nombre }} {{ user.Apellidos }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="getRoleBadgeClass(user.Rol)">
              {{ user.Rol || 'Desconocido' }}
            </span>
          </td>
          <td>
            <button @click="openEditModal(user)" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-pencil"></i> Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination (Simple Previous/Next if implementing full pagination, here simplifying) -->
    <!-- For simplicity, assuming backend returns all or simple pagination. 
         If backend paginates, we need page controls. 
         Let's assume simple implementation first. -->

    <!-- Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editar Usuario</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateUser">
            <div class="mb-3">
              <label for="editNombre" class="form-label">Nombre</label>
              <input
                v-model="editingUser.Nombre"
                type="text"
                class="form-control"
                id="editNombre"
                required
              />
            </div>
            <div class="mb-3">
              <label for="editApellidos" class="form-label">Apellidos</label>
              <input
                v-model="editingUser.Apellidos"
                type="text"
                class="form-control"
                id="editApellidos"
              />
            </div>
            <div class="mb-3">
              <label for="editEmail" class="form-label">Email</label>
              <input
                v-model="editingUser.email"
                type="email"
                class="form-control"
                id="editEmail"
                required
              />
            </div>
            <div class="mb-3">
              <label for="editRol" class="form-label">Rol</label>
              <select v-model="editingUser.idRol" class="form-select" id="editRol" required>
                <!-- Assuming standard IDs, better to fetch roles from API if possible -->
                <option :value="2">Usuario (Cliente)</option>
                <option :value="3">Creador de Servicio (Gestor)</option>
                <option :value="1">Administrador</option>
              </select>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api' // Ensure this path is correct

const users = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const saving = ref(false)
const editingUser = ref(null)

// Placeholder for roles list if we want to dynamic load them
const roles = ref([])

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    const response = await api.usuarios.getAll(params)
    // Backend returns paginated response object: { data: [...], ... } or just array depending on implementation
    // Implemented backend returns paginated object: response.data
    // Wait, axios extractData returns response.data already.
    // If Laravel returns paginate(), the JSON structure is { data: [...], links: ..., meta: ... }
    // So `response` is that object. `response.data` is the array.
    users.value = response.data || response
  } catch (error) {
    console.error('Error fetching users:', error)
    alert('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers()
  }, 300)
}

const openEditModal = (user) => {
  editingUser.value = { ...user } // Clone
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const updateUser = async () => {
  if (!editingUser.value) return

  saving.value = true
  try {
    const payload = {
      Nombre: editingUser.value.Nombre,
      Apellidos: editingUser.value.Apellidos,
      email: editingUser.value.email,
      idRol: editingUser.value.idRol,
    }

    await api.usuarios.update(editingUser.value.IDUsuario, payload)
    alert('Usuario actualizado correctamente')
    closeModal()
    fetchUsers() // Refresh list
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Error al actualizar usuario')
  } finally {
    saving.value = false
  }
}

const getRoleBadgeClass = (rolName) => {
  switch (rolName) {
    case 'admin':
      return 'badge bg-danger'
    case 'creadorServicio':
      return 'badge bg-warning text-dark'
    case 'usuario':
      return 'badge bg-secondary'
    default:
      return 'badge bg-light text-dark'
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
