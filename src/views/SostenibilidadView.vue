<template>
  <div class="sostenibilidad-container">
    <div class="hero-section">
      <h1>Sostenibilidad en TaskLink</h1>
      <p class="subtitle">Nuestro compromiso con un futuro digital responsable y ético.</p>
    </div>

    <div class="content-grid">
      <!-- Sección 1: Diagnóstico -->
      <section class="info-card">
        <h2>Diagnóstico del Proyecto</h2>
        <div class="card-content">
          <p>
            TaskLink es una plataforma de economía colaborativa que conecta a personas con habilidades específicas con usuarios que buscan servicios directamente. 
            Nuestra visión es fomentar la inclusión económica y reducir la huella logística mediante el servicios locales y digitales.
          </p>
          <div class="impact-grid">
            <div class="impact-box positive">
              <h3>Impactos Positivos</h3>
              <ul>
                <li>Fomento de la inclusión económica y empleo descentralizado.</li>
                <li>Reducción de intermediarios y logística física masiva.</li>
                <li>Accesibilidad digital (contraste, navegación por teclado, CSS semántico).</li>
                <li>Digitalización de servicios que minimiza residuos físicos.</li>
              </ul>
            </div>
            <div class="impact-box negative">
              <h3>Áreas de Mejora</h3>
              <ul>
                <li>Optimización del consumo energético de servidores.</li>
                <li>Gestión de residuos digitales (logs, archivos antiguos).</li>
                <li>Cifrado y privacidad de datos sensibles.</li>
                <li>Brecha digital e inclusión lingüística.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección 2: ODS -->
      <section class="ods-section">
        <h2>Objetivos de Desarrollo Sostenible (ODS)</h2>
        <div class="ods-grid">
          <div class="ods-card">
            <div class="ods-number">9</div>
            <h3>Industria, Innovación e Infraestructura</h3>
            <p>Promovemos infraestructuras sostenibles y el acceso equitativo a tecnologías digitales inclusivas.</p>
          </div>
          <div class="ods-card">
            <div class="ods-number">10</div>
            <h3>Reducción de las Desigualdades</h3>
            <p>Fomentamos la accesibilidad digital, la inclusión lingüística y oportunidades para proveedores locales.</p>
          </div>
          <div class="ods-card">
            <div class="ods-number">12</div>
            <h3>Producción y Consumo Responsables</h3>
            <p>La digitalización reduce el consumo de recursos materiales y la generación de residuos físicos.</p>
          </div>
        </div>
      </section>

      <!-- Sección 3: Acciones Sostenibles -->
      <section class="info-card">
        <h2>Nuestras Acciones Sostenibles</h2>
        <div class="actions-container">
          <div class="action-item">
            <div class="action-header">
              <span class="icon">🌱</span>
              <h3>Infraestructura Green Hosting</h3>
            </div>
            <p>
              Estamos migrando a proveedores de hosting certificados con energía 100% renovable. 
              Además, optimizamos nuestros recursos visuales usando formatos como WebP y técnicas de lazy loading para reducir el consumo energético por cada visita.
            </p>
          </div>

          <div class="action-item">
            <div class="action-header">
              <span class="icon">⚖️</span>
              <h3>Ética y Privacidad</h3>
            </div>
            <p>
              Implementamos políticas de privacidad transparentes y éticas, con opciones de anonimización de datos y cumplimiento estricto de la GDPR para proteger los derechos de nuestros usuarios.
            </p>
          </div>

          <div class="action-item">
            <div class="action-header">
              <span class="icon">📊</span>
              <h3>Índice de Impacto Sostenible</h3>
            </div>
            <p>
              Próximamente introduciremos un sistema de calificación para que los proveedores declaren sus prácticas verdes (materiales reciclados, economía circular), incentivando el consumo consciente.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sostenibilidad-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: #2c3e50;
  line-height: 1.6;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a3d62 0%, #3c6382 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.info-card h2 {
  color: #0a3d62;
  margin-bottom: 25px;
  font-size: 1.8rem;
  border-bottom: 3px solid #3c6382;
  display: inline-block;
  padding-bottom: 5px;
}

.impact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.impact-box {
  padding: 25px;
  border-radius: 15px;
}

.impact-box.positive {
  background: rgba(46, 204, 113, 0.1);
  border-left: 5px solid #2ecc71;
}

.impact-box.negative {
  background: rgba(231, 76, 60, 0.1);
  border-left: 5px solid #e74c3c;
}

.impact-box h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.impact-box ul {
  padding-left: 20px;
  margin: 0;
}

.impact-box li {
  margin-bottom: 8px;
}

.ods-section {
  text-align: center;
}

.ods-section h2 {
  color: #0a3d62;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.ods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.ods-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ods-card:hover {
  transform: translateY(-10px);
}

.ods-number {
  font-size: 4rem;
  font-weight: 900;
  color: rgba(10, 61, 98, 0.1);
  position: absolute;
  top: -10px;
  right: 10px;
}

.ods-card h3 {
  color: #0a3d62;
  margin-top: 0;
  font-size: 1.2rem;
}

.ods-card p {
  color: #636e72;
  font-size: 0.95rem;
  margin-bottom: 0;
}

.actions-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.action-item {
  padding: 20px;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.action-header .icon {
  font-size: 2rem;
}

.action-header h3 {
  margin: 0;
  color: #0a3d62;
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .impact-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .info-card {
    padding: 20px;
  }
}
</style>
