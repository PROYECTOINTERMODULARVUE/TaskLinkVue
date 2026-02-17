<script setup>
import { ref } from 'vue'
import FechaSelector from './FechaSelector.vue'
import ServicioSelector from './ServicioSelector.vue'
import ZonaSelector from './ZonaSelector.vue'

const mostrarBuscadorMovil = ref(false)
const pasoActivo = ref('zona') // Controla qué sección está abierta en móvil

const abrirBuscadorMovil = () => {
  mostrarBuscadorMovil.value = true
  pasoActivo.value = 'zona' // Empezamos por "¿Dónde?"
}

const cerrarBuscadorMovil = () => {
  mostrarBuscadorMovil.value = false
}

const resetFiltros = () => {
  // Aquí podrías añadir la lógica para limpiar los stores si lo necesitas
  pasoActivo.value = 'zona'
}
</script>

<template>
  <!-- DESKTOP VIEW -->
  <div class="buscadorContainer desktopOnly">
    <div class="searchGroup">
      <div class="searchItem">
        <span class="label">Destino</span>
        <ZonaSelector class="selector-input" />
      </div>

      <div class="divider"></div>

      <div class="searchItem">
        <span class="label">Fechas</span>
        <FechaSelector class="selector-input" />
      </div>

      <div class="divider"></div>

      <div class="searchItem">
        <span class="label">Tipo de servicio</span>
        <ServicioSelector class="selector-input" />
      </div>

      <button class="buscarBtn">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>

  <div class="mobileSearch desktopHidden" @click="abrirBuscadorMovil">
    <i class="bi bi-search"></i>
    <span>Busca servicios</span>
  </div>

  <div v-if="mostrarBuscadorMovil" class="overlay" @click="cerrarBuscadorMovil">
    <div class="panelBuscadorTop" @click.stop>
      <div class="headerMovil">
        <button class="cerrarBtnCircular" @click="cerrarBuscadorMovil">✕</button>
      </div>

      <div class="filtrosAcordeon">
        <div
          class="tarjetaFiltro"
          :class="{ activa: pasoActivo === 'zona' }"
          @click="pasoActivo = 'zona'"
        >
          <div v-if="pasoActivo !== 'zona'" class="resumen">
            <span class="label">¿Dónde?</span>
            <span class="valor">Búsqueda flexible</span>
          </div>
          <div v-else class="detalle">
            <h2>¿Dónde?</h2>
            <ZonaSelector />
          </div>
        </div>

        <div
          class="tarjetaFiltro"
          :class="{ activa: pasoActivo === 'fecha' }"
          @click="pasoActivo = 'fecha'"
        >
          <div v-if="pasoActivo !== 'fecha'" class="resumen">
            <span class="label">Fechas</span>
            <span class="valor">Añade fechas</span>
          </div>
          <div v-else class="detalle">
            <h2>¿Cuándo?</h2>
            <FechaSelector />
          </div>
        </div>

        <div
          class="tarjetaFiltro"
          :class="{ activa: pasoActivo === 'servicio' }"
          @click="pasoActivo = 'servicio'"
        >
          <div v-if="pasoActivo !== 'servicio'" class="resumen">
            <span class="label">Tipo de servicio</span>
            <span class="valor">Añade un servicio</span>
          </div>
          <div v-else class="detalle">
            <h2>¿Qué necesitas?</h2>
            <ServicioSelector />
          </div>
        </div>
      </div>

      <div class="footerMovil">
        <button class="btnLink" @click="resetFiltros">Restablecer</button>
        <button class="btnBuscarMovil"><i class="bi bi-search"></i> Buscar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buscadorContainer {
  display: flex;
  justify-content: center;
  width: 100%;
}

.searchGroup {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Sombra suave */
  padding: 8px; /* Espacio para que el boton no toque los bordes */
  height: 66px;
  width: 100%;
  max-width: 850px; /* Ajustar segun necesidad */
  transition: box-shadow 0.2s ease;
}

.searchGroup:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.searchItem {
  flex: 1;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  border-radius: 32px;
  height: 100%;
  transition: background-color 0.2s;
}

.searchItem:hover {
  background-color: #ebebeb;
}

.searchItem .label {
  font-size: 12px;
  font-weight: 700;
  color: #000;
  margin-top: 2px;
  display: block;
}

:deep(.selector-input input) {
  border: none;
  padding: 0;
  background: transparent;
  font-size: 14px;
  color: #717171;
  width: 100%;
}
:deep(.selector-input input:focus) {
  outline: none;
}
:deep(.selector-input .placeholder) {
  color: #717171;
  font-weight: 400;
}

.divider {
  width: 1px;
  height: 32px;
  background-color: #ddd;
}

.buscarBtn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  margin-left: 8px;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.buscarBtn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.mobileSearch {
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  height: 50px;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.mobileSearch:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.mobileSearch i {
  font-weight: 900;
  color: white; /* White icon */
  font-size: 18px;
}
.mobileSearch span {
  font-weight: 600;
  color: white; /* White text */
  font-size: 16px;
}

/* ----------------- ESTILOS PANEL MOBILE (OVERLAY) ----------------- */
.overlay {
  position: fixed;
  inset: 0;
  background: #f7f7f7; /* Background entero gris claro */
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.panelBuscadorTop {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f7f7f7;
  overflow-y: auto;
}

.headerMovil {
  margin-bottom: 20px;
}

.cerrarBtnCircular {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filtrosAcordeon {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.tarjetaFiltro {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tarjetaFiltro.activa {
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.15);
  border: 2px solid #007bff;
}

.tarjetaFiltro.activa h2 {
  color: #007bff;
}

.resumen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #717171;
  font-size: 14px;
  font-weight: 600;
}
.resumen .valor {
  color: #222;
}
.resumen .label {
  color: #717171;
}

.detalle h2 {
  font-size: 26px;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
}

/* Footer fijo abajo */
.footerMovil {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7; /* Maintain background */
  padding-bottom: 10px;
}

.btnLink {
  background: none;
  border: none;
  text-decoration: underline;
  font-weight: 600;
  font-size: 16px;
  color: #222;
  cursor: pointer;
}

.btnBuscarMovil {
  background: #007bff;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

/* ----------------- MEDIA QUERIES ----------------- */
.desktopOnly {
  display: flex;
}
.desktopHidden {
  display: none;
}

@media (max-width: 950px) {
  .mobileSearch {
    max-width: none;
    font-size: 14px;
    padding: 10px 15px;
    width: auto;
    height: 45px;
    margin: 0 auto;
    white-space: nowrap;
    flex-wrap: nowrap;

    span {
      font-size: 14px;
      white-space: nowrap;
    }
    i {
      font-size: 16px;
    }
  }
  .desktopOnly {
    display: none;
  }
  .desktopHidden {
    display: flex;
  }
}
</style>
