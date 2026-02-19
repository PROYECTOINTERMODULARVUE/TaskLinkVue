<script setup>
const props = defineProps({
  datosUsuario: Object,
  reseñasVisibles: Array,
  yaHaComentado: Boolean,
})

const emit = defineEmits(['irALogin'])

const getInicial = (nombre) => {
  return nombre ? nombre.charAt(0).toUpperCase() : '?'
}

const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha))
}
</script>

<template>
  <section class="reviews-section">
    <h3 class="section-title">Opiniones de clientes</h3>

    <!-- CTA de Inicio de Sesión (Si no está logueado) -->
    <div v-if="!datosUsuario" class="login-reviews-cta mt-4">
      <div class="cta-card">
        <div class="cta-icon">
          <i class="bi bi-person-lock"></i>
        </div>
        <div class="cta-text">
          <h4>Opiniones bloqueadas</h4>
          <p>
            Inicia sesión en TaskLink para leer las experiencias de otros usuarios y dejar la tuya
            propia.
          </p>
          <button @click="emit('irALogin')" class="btn-login-cta">
            <span>Iniciar Sesión</span>
            <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Reseñas (Si está logueado y hay reseñas) -->
    <div v-else-if="reseñasVisibles.length > 0" class="reviews-list">
      <div v-for="valoracion in reseñasVisibles" :key="valoracion.id" class="review-item">
        <div class="review-header">
          <div class="review-avatar">{{ getInicial(valoracion.usuario?.Nombre) }}</div>
          <div class="review-user-info">
            <div class="user-name">{{ valoracion.usuario?.Nombre || 'Usuario' }}</div>
            <div class="review-meta">
              <span class="stars"
                >{{ '★'.repeat(valoracion.Puntuacion)
                }}{{ '☆'.repeat(5 - valoracion.Puntuacion) }}</span
              >
              <span class="review-date">{{ formatearFecha(valoracion.Fecha) }}</span>
            </div>
          </div>
        </div>
        <p class="review-text">{{ valoracion.Comentario }}</p>
      </div>
    </div>

    <!-- Estado vacío (Si está logueado pero no hay reseñas) -->
    <div v-else class="reviews-empty-state">
      <i class="bi bi-chat-quote"></i>
      <p>Aún no hay reseñas para este servicio.</p>
      <p class="sub-text">¿Has probado este servicio? ¡Sé el primero en valorarlo!</p>
    </div>

    <!-- Formulario de Valoración -->
    <div v-if="datosUsuario && !yaHaComentado" class="form-valoracion-container mt-4">
      <h4 class="section-title-small">Deja tu valoración</h4>
      <div class="rating-form mb-3">
        <input type="radio" name="rating" value="5" id="s5" /><label for="s5">★</label>
        <input type="radio" name="rating" value="4" id="s4" /><label for="s4">★</label>
        <input type="radio" name="rating" value="3" id="s3" checked /><label for="s3">★</label>
        <input type="radio" name="rating" value="2" id="s2" /><label for="s2">★</label>
        <input type="radio" name="rating" value="1" id="s1" /><label for="s1">★</label>
      </div>
      <textarea
        class="form-control mb-3"
        rows="3"
        placeholder="Escribe aquí tu opinión..."
      ></textarea>
      <button class="btn-enviar">Publicar valoración</button>
    </div>
    <div v-else-if="datosUsuario && yaHaComentado" class="alert-info-custom mt-4">
      ✅ Gracias por tu valoración. Ya has opinado sobre este servicio.
    </div>
  </section>
</template>

<style scoped>
.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}

.review-item {
  margin-bottom: 24px;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.review-avatar {
  width: 40px;
  height: 40px;
  background: #222;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
.user-name {
  font-weight: 600;
  font-size: 16px;
}
.review-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.stars {
  color: #ffc107;
}
.review-text {
  font-size: 16px;
  line-height: 24px;
  color: #222;
}

.form-valoracion-container {
  background: #fff;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.rating-form {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.rating-form input {
  display: none;
}
.rating-form label {
  font-size: 32px;
  color: #ccc;
  cursor: pointer;
}
.rating-form label:hover,
.rating-form label:hover ~ label,
.rating-form input:checked ~ label {
  color: #ffc107;
}

.btn-enviar {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.alert-info-custom {
  background: #e7f3ff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #bde0ff;
  color: #0056b3;
}

.reviews-empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #fdfdfd;
  border: 1px dashed #ddd;
  border-radius: 12px;
  color: #717171;
}

.reviews-empty-state i {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 12px;
  display: block;
}

.reviews-empty-state .sub-text {
  font-size: 14px;
  margin-top: 4px;
}

.login-reviews-cta {
  perspective: 1000px;
}

.cta-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.cta-card:hover {
  transform: translateY(-5px);
}

.cta-icon {
  width: 70px;
  height: 70px;
  background: #007bff;
  color: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 8px 16px rgba(255, 56, 92, 0.3);
}

.cta-text h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.cta-text p {
  color: #5e5e5e;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 16px;
  max-width: 400px;
}

.btn-login-cta {
  background: #222;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-login-cta:hover {
  background: #000;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .cta-card {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }
  .cta-text  button {
    justify-content: center;
    align-items: center;
    width: 100%;
  }

}
</style>
