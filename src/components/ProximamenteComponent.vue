<template>
  <section class="wrapper">
    <div class="card">
      <span class="badge">En desarrollo</span>
      <h1>{{ titulo }}</h1>
      <p class="subtitle">
        Esta funcionalidad estará disponible próximamente.
      </p>
      <div class="line"></div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: 'Próximamente'
  }
})
</script>

<style scoped>
.wrapper {
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0b1f3a, #0f2d5c);
}

.card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.8s ease-out;
}

.badge {
  display: inline-block;
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 50px;
  margin-bottom: 20px;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  margin-bottom: 15px;
}

.subtitle {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  opacity: 0.85;
}

.line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  margin: 30px auto 0;
  border-radius: 2px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive extra para móviles pequeños */
@media (max-width: 480px) {
  .card {
    padding: 40px 25px;
  }
}
</style>
