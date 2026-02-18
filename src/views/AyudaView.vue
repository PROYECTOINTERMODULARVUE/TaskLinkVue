<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'

const searchQuery = ref('')
const activeCategory = ref(null)
const helpCategories = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    const data = await api.faqs.getAll()
    helpCategories.value = data
    if (data.length > 0) {
      activeCategory.value = data[0].IDFaqCategoria
    }
  } catch (error) {
    console.error('Error al cargar FAQs:', error)
  } finally {
    cargando.value = false
  }
})

const filteredFaqs = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) {
    const category = helpCategories.value.find((c) => c.IDFaqCategoria === activeCategory.value)
    return category?.faqs || []
  }

  // Search in all categories if there is a query
  let results = []
  helpCategories.value.forEach((cat) => {
    cat.faqs.forEach((faq) => {
      if (
        faq.Pregunta.toLowerCase().includes(query) ||
        faq.Respuesta.toLowerCase().includes(query)
      ) {
        results.push(faq)
      }
    })
  })
  return results
})

const openFaqIndex = ref(null)
const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const selectCategory = (id) => {
  activeCategory.value = id
  searchQuery.value = ''
  openFaqIndex.value = null
}
</script>

<template>
  <div class="ayuda-container">
    <!-- Hero Section -->
    <section class="hero-ayuda">
      <h1>¿En qué podemos ayudarte?</h1>
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Busca respuestas a tus preguntas..."
          class="help-search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </section>

    <div v-if="cargando" class="loading-state">
      <p>Cargando ayuda...</p>
    </div>

    <div v-else class="ayuda-content">
      <!-- Sidebar Categories (Desktop) / Tabs (Mobile) -->
      <aside class="ayuda-sidebar">
        <button
          v-for="cat in helpCategories"
          :key="cat.IDFaqCategoria"
          :class="[
            'category-btn',
            { active: activeCategory === cat.IDFaqCategoria && !searchQuery },
          ]"
          @click="selectCategory(cat.IDFaqCategoria)"
        >
          <span class="cat-icon">{{ cat.Icono }}</span>
          <span class="cat-name">{{ cat.Nombre }}</span>
        </button>
      </aside>

      <!-- FAQ Display -->
      <main class="faq-main">
        <h2 v-if="searchQuery">Resultados para "{{ searchQuery }}"</h2>
        <h2 v-else>
          {{ helpCategories.find((c) => c.IDFaqCategoria === activeCategory)?.Nombre }}
        </h2>

        <div class="faq-list">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="index"
            :class="['faq-item', { open: openFaqIndex === index }]"
          >
            <div class="faq-header" @click="toggleFaq(index)">
              <h3>{{ faq.Pregunta }}</h3>
              <span class="chevron">{{ openFaqIndex === index ? '−' : '+' }}</span>
            </div>
            <div class="faq-body">
              <p>{{ faq.Respuesta }}</p>
            </div>
          </div>

          <div v-if="filteredFaqs.length === 0" class="no-results">
            <p>
              No hemos encontrado respuestas para tu búsqueda. Prueba con otros términos o contacta
              con nosotros.
            </p>
          </div>
        </div>
      </main>
    </div>

    <!-- Contact Support -->
    <section class="contact-support">
      <div class="contact-card">
        <div class="contact-info">
          <h2>¿Todavía necesitas ayuda?</h2>
          <p>Nuestro equipo de soporte está disponible de lunes a viernes para asistirte.</p>
        </div>
        <div class="contact-actions">
          <a href="mailto:soporte@tasklink.com" class="btn-contact secondary">📧 Enviar Email</a>
          <button class="btn-contact primary">💬 Chat en vivo</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ayuda-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #333;
}

.loading-state {
  text-align: center;
  padding: 5rem;
  font-size: 1.5rem;
  color: #2b4ea2;
  font-weight: 700;
}

/* Hero Section */
.hero-ayuda {
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #2b4ea2 0%, #4f7cff 100%);
  border-radius: 24px;
  color: white;
  margin-bottom: 3rem;
  box-shadow: 0 10px 30px rgba(43, 78, 162, 0.2);
}

.hero-ayuda h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.help-search-input {
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border-radius: 50px;
  border: none;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: box-shadow 0.3s;
}

.help-search-input:focus {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0.5;
}

/* Content Layout */
.ayuda-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

/* Sidebar */
.ayuda-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-weight: 600;
  color: #666;
}

.category-btn:hover {
  background: #f0f7ff;
  color: #2b4ea2;
}

.category-btn.active {
  background: #e6f0ff;
  border-color: #2b4ea2;
  color: #2b4ea2;
}

.cat-icon {
  font-size: 1.5rem;
}

/* FAQ List */
.faq-main h2 {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: #2b4ea2;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s;
}

.faq-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-header h3 {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
}

.chevron {
  font-size: 1.5rem;
  color: #2b4ea2;
  transition: transform 0.3s;
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease-out,
    padding 0.3s;
  padding: 0 1.25rem;
  background: #f8fafc;
}

.faq-item.open {
  border-color: #4f7cff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.faq-item.open .faq-body {
  max-height: 500px;
  padding: 1.25rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: #f8fafc;
  border-radius: 12px;
}

/* Contact Support */
.contact-support {
  margin-top: 5rem;
}

.contact-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 3rem;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.contact-info h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #2b4ea2;
}

.contact-info p {
  color: #666;
  font-size: 1.1rem;
}

.contact-actions {
  display: flex;
  gap: 1rem;
}

.btn-contact {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-contact.primary {
  background: #2b4ea2;
  color: white;
  border: none;
}

.btn-contact.secondary {
  background: #f0f7ff;
  color: #2b4ea2;
  border: 1px solid #2b4ea2;
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(43, 78, 162, 0.2);
}

/* Responsiveness */
@media (max-width: 900px) {
  .hero-ayuda h1 {
    font-size: 2rem;
  }

  .ayuda-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .ayuda-sidebar {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .category-btn {
    white-space: nowrap;
  }

  .contact-card {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
}

@media (max-width: 600px) {
  .hero-ayuda {
    padding: 3rem 1rem;
  }

  .hero-ayuda h1 {
    font-size: 1.75rem;
  }

  .contact-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-contact {
    text-align: center;
  }
}
</style>
