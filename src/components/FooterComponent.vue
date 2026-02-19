<script setup>
import { useRouter } from 'vue-router'
const router = useRouter();



</script>
<template>
<footer>
    <div class="footer-contenedor">

      <div class="footer-asistencia">
        <h2>Sobre Nosotros</h2>
        <div>
          <p>Esta página web va dirigida a la generación de servicios.<br>
            Puedes tanto contratar servicios como crear servicios para otras personas.</p>
        </div>
      </div>

      <div class="footer-ofertas">
        <h2>Enlaces Rápidos</h2>
        <div>
          <a @click="router.push('/ayuda')">Centro de ayuda</a>
          <a @click="router.push('/servicios/crear')">Crear Servicio</a>
        </div>
      </div>

      <div class="footer-acercade">
        <h2>TaskLink</h2>
        <div>
          <a @click="router.push('/lanzamiento')">Lanzamiento TaskLink</a>
          <a @click="router.push('/empleo')">Empleo</a>
          <a @click="router.push('/inversores')">Inversores</a>
        </div>
      </div>

    </div>

    <div class="footer-bottom">
      Español (España) © 2025 TaskLink from Alex&Gabi
    </div>
  </footer>
  </template>
  <style scoped>
  
footer {
  background: #0a3d62;
  text-align: center;
  padding: 40px 20px;
  color: white;
  clear: both;
  margin-top: 20px;
}

/* --- CONTENEDOR DE COLUMNAS ---*/
.footer-contenedor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
  text-align: left;
}

/* --- TÍTULOS ---*/
.footer-contenedor h2 {
  font-size: 1.35rem;
  margin: 0 0 12px 0;
  border-left: 4px solid #bbdefb;
  padding-left: 8px;
  color: white;
  font-weight: 600;
}

/* --- LINK Y TEXTOS ---*/
.footer-contenedor p,
.footer-contenedor a {
  color: #e3f2fd;
  font-size: 0.95rem;
  text-decoration: none;
  line-height: 1.5;
  transition: 0.2s ease;
}

/* Espaciado entre links*/
.footer-contenedor a {
  display: block;
  margin-bottom: 6px;
}

.footer-contenedor a:last-child {
  margin-bottom: 0;
}

/* Hover moderno*/
.footer-contenedor a:hover,
.footer-contenedor a:focus {
  color: #bbdefb;
  text-decoration: underline;
  outline: none;
}

/* --- CONTENEDOR DE COLUMNAS INTERNAS ---*/
footer div > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* --- PARTE INFERIOR ---*/
.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 14px;
  color: #cfe4ff;
}
  </style>