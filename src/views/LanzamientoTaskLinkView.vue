<template>
  <div class="landing">
    <section class="hero">
      <video class="hero-video" autoplay muted loop playsinline>
        <source :src="'/src/assets/img/video.mp4'" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div class="hero-content">
        <h1>TaskLink</h1>
        <h2>Conecta con tus servicios de forma eficiente</h2>
        <p>
          TaskLink es la plataforma que conecta empresas y profesionales. Gestiona y contrata
          servicios de forma segura, rápida y confiable.
        </p>
        <a href="#contact" class="btn-primary" @click="$router.push('/')">Contáctanos</a>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Gestión rápida</h3>
        <p>Organiza todos tus servicios en un solo lugar y accede a ellos en segundos.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">✅</div>
        <h3>Servicios verificados</h3>
        <p>Trabajamos solo con profesionales calificados para garantizar calidad y confianza.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💬</div>
        <h3>Soporte 24/7</h3>
        <p>Nuestro equipo de atención está disponible para ayudarte en cualquier momento.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// Por ahora no requiere lógica
</script>

<style scoped>
/* Tipografía y Reset */
body,
html,
.landing {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  color: #fff;
  background: #0f172a;
}

/* Hero */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 20px;
  overflow: hidden;
  min-height: 80vh;
}

/* Video de fondo */
.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Contenido hero */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
}
.hero-content h1 {
  font-size: 5rem;
  font-weight: bold;

  color: #60a5fa;
}
.hero h2 {
  font-size: clamp(2.2rem, 5vw, 3rem);
  margin-bottom: 20px;
  font-weight: 700;
  line-height: 1.2;
}
.hero p {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin-bottom: 35px;
  opacity: 0.95;
  color: #e0f2fe;
}
.btn-primary {
  background: linear-gradient(90deg, #3b82f6, #60a5fa); /* degradado azul moderno */
  color: #fff;
  padding: 14px 36px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(90deg, #2563eb, #3b82f6); /* azul más intenso al hover */
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
}

/* Features Section */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 40px;
  padding: 80px 5%;
}
.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 35px 25px;
  text-align: center;
  transition: 0.4s;
  backdrop-filter: blur(12px);
}
.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}
.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #60a5fa;
}
.feature-card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}
.feature-card p {
  opacity: 0.85;
  font-size: 1rem;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  padding: 70px 20px;
  text-align: center;
  border-radius: 40px 40px 0 0;
}
.cta h2 {
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  margin-bottom: 20px;
}
.cta p {
  font-size: 1.05rem;
  opacity: 0.9;
  margin-bottom: 35px;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  padding: 14px 36px;
  border-radius: 10px;
  font-weight: 600;
  color: #fff;
  transition: 0.3s;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Footer */
footer {
  text-align: center;
  padding: 35px 5%;
  background: rgba(15, 23, 42, 0.9);
  color: #93c5fd;
  font-size: 0.9rem;
  margin-top: -10px;
}

/* Animaciones */
.fade-in {
  opacity: 0;
  animation: fadeIn 1s forwards;
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 480px) {
  .navbar ul {
    gap: 12px;
  }
  .hero h2 {
    font-size: 2rem;
  }
  .cta h2 {
    font-size: 1.8rem;
  }
  .features {
    gap: 25px;
  }
}
</style>
