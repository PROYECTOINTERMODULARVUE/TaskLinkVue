<template>
  <div class="admin-config-container">
    <div class="config-header">
      <h1>Configuración Web</h1>
      <p>Gestiona los usuarios del sistema y el contenido del Centro de Ayuda.</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="config-tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'usuarios' }]"
        @click="activeTab = 'usuarios'"
      >
        👥 Usuarios
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'faq-cats' }]"
        @click="activeTab = 'faq-cats'"
      >
        📁 Categorías FAQ
      </button>
      <button :class="['tab-btn', { active: activeTab === 'faqs' }]" @click="activeTab = 'faqs'">
        ❓ Preguntas Frecuentes
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- USUARIOS TAB -->
      <section v-if="activeTab === 'usuarios'" class="config-section">
        <div class="section-actions">
          <input
            v-model="searchQueryUsers"
            @input="handleSearchUsers"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre o email..."
          />
        </div>

        <div v-if="loadingUsers" class="loading-state">Cargando usuarios...</div>
        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.IDUsuario">
              <td>{{ user.Nombre }} {{ user.Apellidos }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['badge', user.Rol]">{{ user.Rol }}</span>
              </td>
              <td>
                <button @click="openEditUserModal(user)" class="btn-icon">✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- FAQ CATEGORIES TAB -->
      <section v-if="activeTab === 'faq-cats'" class="config-section">
        <div class="section-actions">
          <button @click="openCreateCatModal" class="btn-primary">+ Nueva Categoría</button>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in faqCategories" :key="cat.IDFaqCategoria">
              <td class="text-center">{{ cat.Icono }}</td>
              <td>{{ cat.Nombre }}</td>
              <td>
                <button @click="openEditCatModal(cat)" class="btn-icon">✏️</button>
                <button @click="deleteCategory(cat.IDFaqCategoria)" class="btn-icon delete">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- FAQS TAB -->
      <section v-if="activeTab === 'faqs'" class="config-section">
        <div class="section-actions">
          <button @click="openCreateFaqModal" class="btn-primary">+ Nueva FAQ</button>
          <select v-model="selectedFaqCat" class="form-select">
            <option :value="null">Todas las categorías</option>
            <option
              v-for="cat in faqCategories"
              :key="cat.IDFaqCategoria"
              :value="cat.IDFaqCategoria"
            >
              {{ cat.Nombre }}
            </option>
          </select>
        </div>

        <div v-if="loadingFaqs" class="loading-state">Cargando preguntas...</div>
        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in filteredFaqs" :key="faq.IDFaq">
              <td>{{ faq.Pregunta }}</td>
              <td>{{ faq.categoria?.Nombre }}</td>
              <td>
                <button @click="openEditFaqModal(faq)" class="btn-icon">✏️</button>
                <button @click="deleteFaq(faq.IDFaq)" class="btn-icon delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- MODALS -->

    <!-- User Modal -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-card">
        <h2>Editar Usuario</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="editingUser.Nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="editingUser.Apellidos" type="text" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editingUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="editingUser.idRol">
              <option :value="2">Usuario</option>
              <option :value="3">Proveedor</option>
              <option :value="1">Administrador</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCatModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-card">
        <h2>{{ editingCat.IDFaqCategoria ? 'Editar' : 'Nueva' }} Categoría FAQ</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="editingCat.Nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>Icono (Emoji)</label>
            <input v-model="editingCat.Icono" type="text" placeholder="📁" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- FAQ Modal -->
    <div v-if="showFaqModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-card">
        <h2>{{ editingFaq.IDFaq ? 'Editar' : 'Nueva' }} FAQ</h2>
        <form @submit.prevent="saveFaq">
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="editingFaq.idFaqCategoria" required>
              <option
                v-for="cat in faqCategories"
                :key="cat.IDFaqCategoria"
                :value="cat.IDFaqCategoria"
              >
                {{ cat.Nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Pregunta</label>
            <input v-model="editingFaq.Pregunta" type="text" required />
          </div>
          <div class="form-group">
            <label>Respuesta</label>
            <textarea v-model="editingFaq.Respuesta" rows="4" required></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const activeTab = ref('usuarios')
const saving = ref(false)

// --- USUARIOS ---
const users = ref([])
const loadingUsers = ref(false)
const searchQueryUsers = ref('')
const showUserModal = ref(false)
const editingUser = ref(null)

const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    const data = await api.usuarios.getAll()
    users.value = data.data || data
  } catch (error) {
    console.error('Error users:', error)
  } finally {
    loadingUsers.value = false
  }
}

const filteredUsers = computed(() => {
  if (!searchQueryUsers.value) return users.value
  const q = searchQueryUsers.value.toLowerCase()
  return users.value.filter(
    (u) => u.Nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  )
})

const openEditUserModal = (user) => {
  editingUser.value = { ...user }
  showUserModal.value = true
}

const updateUser = async () => {
  saving.value = true
  try {
    await api.usuarios.update(editingUser.value.IDUsuario, editingUser.value)
    fetchUsers()
    closeModals()
  } catch (error) {
    alert('Error al actualizar usuario')
  } finally {
    saving.value = false
  }
}

// --- CATEGORIAS FAQ ---
const faqCategories = ref([])
const showCatModal = ref(false)
const editingCat = ref({ Nombre: '', Icono: '' })

const fetchCats = async () => {
  try {
    faqCategories.value = await api.faqCategories.getAll()
  } catch (error) {
    console.error('Error cats:', error)
  }
}

const openCreateCatModal = () => {
  editingCat.value = { Nombre: '', Icono: '❓' }
  showCatModal.value = true
}

const openEditCatModal = (cat) => {
  editingCat.value = { ...cat }
  showCatModal.value = true
}

const saveCategory = async () => {
  try {
    if (editingCat.value.IDFaqCategoria) {
      await api.faqCategories.update(editingCat.value.IDFaqCategoria, editingCat.value)
    } else {
      await api.faqCategories.create(editingCat.value)
    }
    fetchCats()
    closeModals()
  } catch (error) {
    alert('Error al guardar categoría')
  }
}

const deleteCategory = async (id) => {
  if (!confirm('¿Seguro? Se borrarán todas las preguntas de esta categoría.')) return
  try {
    await api.faqCategories.delete(id)
    fetchCats()
    fetchFaqs()
  } catch (error) {
    alert('Error al borrar categoría')
  }
}

// --- FAQS ---
const faqs = ref([])
const loadingFaqs = ref(false)
const selectedFaqCat = ref(null)
const showFaqModal = ref(false)
const editingFaq = ref({ Pregunta: '', Respuesta: '', idFaqCategoria: null })

const fetchFaqs = async () => {
  loadingFaqs.value = true
  try {
    const data = await api.faqs.getAll()
    // The index returns categories with faqs, but we want a flat list for management maybe?
    // Or we create a specific flat endpoint. Let's flatten here from the categories with faqs
    let flatFaqs = []
    data.forEach((cat) => {
      cat.faqs.forEach((f) => {
        flatFaqs.push({ ...f, categoria: { Nombre: cat.Nombre } })
      })
    })
    faqs.value = flatFaqs
  } catch (error) {
    console.error('Error faqs:', error)
  } finally {
    loadingFaqs.value = false
  }
}

const filteredFaqs = computed(() => {
  if (!selectedFaqCat.value) return faqs.value
  return faqs.value.filter((f) => f.idFaqCategoria === selectedFaqCat.value)
})

const openCreateFaqModal = () => {
  editingFaq.value = {
    Pregunta: '',
    Respuesta: '',
    idFaqCategoria: faqCategories.value[0]?.IDFaqCategoria,
  }
  showFaqModal.value = true
}

const openEditFaqModal = (faq) => {
  editingFaq.value = { ...faq }
  showFaqModal.value = true
}

const saveFaq = async () => {
  try {
    if (editingFaq.value.IDFaq) {
      await api.faqs.update(editingFaq.value.IDFaq, editingFaq.value)
    } else {
      await api.faqs.create(editingFaq.value)
    }
    fetchFaqs()
    closeModals()
  } catch (error) {
    alert('Error al guardar FAQ')
  }
}

const deleteFaq = async (id) => {
  if (!confirm('¿Seguro?')) return
  try {
    await api.faqs.delete(id)
    fetchFaqs()
  } catch (error) {
    alert('Error al borrar FAQ')
  }
}

const closeModals = () => {
  showUserModal.value = false
  showCatModal.value = false
  showFaqModal.value = false
}

onMounted(() => {
  fetchUsers()
  fetchCats()
  fetchFaqs()
})
</script>

<style scoped>
.admin-config-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.config-header {
  margin-bottom: 2rem;
}

.config-header h1 {
  color: #2b4ea2;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* Tabs */
.config-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #2b4ea2;
}

.tab-btn.active {
  color: #2b4ea2;
  border-bottom-color: #2b4ea2;
}

/* Section content */
.config-section {
  animation: fadeIn 0.3s ease-out;
}

.section-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

/* Table styles */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.admin-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #f1f5f9;
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

/* Badge roles */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.admin {
  background: #fee2e2;
  color: #991b1b;
}
.badge.creadorServicio {
  background: #fef3c7;
  color: #92400e;
}
.badge.usuario {
  background: #e0f2fe;
  color: #075985;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background: #2b4ea2;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
