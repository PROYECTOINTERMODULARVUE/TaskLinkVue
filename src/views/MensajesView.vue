<script setup>
</script>

<template>
  <div class="mensajes-proximamente">
    <div class="content-card">
      <div class="icon-wrapper">
        <i class="bi bi-chat-dots"></i>
      </div>
      <h1>Mensajes</h1>
      <p class="subtitle">¡Estamos preparando algo increíble para ti!</p>
      
      <div class="divider"></div>
      
      <div class="feature-info">
        <p>Próximamente podrás comunicarte directamente con los profesionales para:</p>
        <ul>
          <li><i class="bi bi-check2-circle"></i> Resolver dudas sobre servicios</li>
          <li><i class="bi bi-check2-circle"></i> Ajustar detalles de tus citas</li>
          <li><i class="bi bi-check2-circle"></i> Recibir presupuestos personalizados</li>
        </ul>
      </div>

      <div class="badge-soon">Disponible próximamente</div>
      
      <router-link to="/" class="back-btn">
        Volver al inicio
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.mensajes-proximamente {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f8fafc;
}

.content-card {
  max-width: 600px;
  width: 100%;
  background: white;
  padding: 50px 40px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid #e2e8f0;
}

.icon-wrapper {
  font-size: 4rem;
  color: #3b82f6;
  margin-bottom: 20px;
  background: #eff6ff;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 24px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 30px;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 30px 0;
}

.feature-info {
  text-align: left;
  margin-bottom: 40px;
  background: #f1f5f9;
  padding: 24px;
  border-radius: 16px;
}

.feature-info p {
  font-weight: 600;
  color: #475569;
  margin-bottom: 16px;
}

.feature-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-info li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #64748b;
}

.feature-info li i {
  color: #10b981;
  font-size: 1.2rem;
}

.badge-soon {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.back-btn {
  display: inline-block;
  padding: 14px 32px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (max-width: 640px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>
