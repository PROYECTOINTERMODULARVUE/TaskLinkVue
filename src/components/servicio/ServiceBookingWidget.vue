<script setup>
defineProps({
  precio: [Number, String],
  cargandoReserva: Boolean,
})

const emit = defineEmits(['reservar'])
</script>

<template>
  <aside class="sidebar-column">
    <div class="booking-widget">
      <!-- Container para disposición flexible en móvil -->
      <div class="mobile-flex-container">
        <div class="widget-price">
          <span class="price">{{ precio }}€</span>
          <span class="per-session">/ sesión</span>
          <!-- Fecha visible en móvil debajo del precio -->
          <div class="mobile-date">Seleccionar fecha</div>
        </div>

        <div class="booking-actions-wrapper">
          <button @click="emit('reservar')" class="btn-reservar" :disabled="cargandoReserva">
            {{ cargandoReserva ? '...' : 'Reservar' }}
          </button>
        </div>
      </div>

      <!-- Selectores detallados (ocultos en la barra fija de móvil, se podrían abrir en modal) -->
      <div class="desktop-selectors">
        <div class="booking-selectors">
          <div class="selector-item">
            <div class="selector-label">FECHA</div>
            <div class="selector-value">Seleccionar fecha</div>
          </div>
        </div>

        <p class="no-charge-info">No se te cobrará nada aún</p>

        <div class="total-row">
          <span>Total</span>
          <span class="total-price">{{ precio }}€</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.booking-widget {
  position: sticky;
  top: 100px;
  border: 1px solid #dddddd;
  border-radius: 12px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  background: white;
  z-index: 100;
}

.widget-price {
  margin-bottom: 24px;
}
.price {
  font-size: 22px;
  font-weight: 600;
}
.per-session {
  font-size: 16px;
  font-weight: 400;
}

.mobile-date {
  display: none;
  font-size: 14px;
  text-decoration: underline;
  color: #222;
  font-weight: 600;
}

.booking-selectors {
  border: 1px solid #b0b0b0;
  border-radius: 8px;
  margin-bottom: 24px;
}
.selector-item {
  padding: 10px 12px;
}
.selector-label {
  font-size: 10px;
  font-weight: 800;
}
.selector-value {
  font-size: 14px;
  color: #717171;
}

.btn-reservar {
  background-color: #ff385c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: transform 0.1s ease;
}

.btn-reservar:active {
  transform: scale(0.96);
}

.btn-reservar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.no-charge-info {
  text-align: center;
  font-size: 14px;
  color: #717171;
  margin-top: 12px;
  margin-bottom: 24px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #dddddd;
  font-size: 18px;
  font-weight: 600;
}

/* Versión Móvil Fija */
@media (max-width: 992px) {
  .sidebar-column {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border-top: 1px solid #ddd;
    padding: 0;
  }

  .booking-widget {
    position: relative;
    top: 0;
    border: none;
    border-radius: 0;
    padding: 16px 24px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  }

  .mobile-flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .widget-price {
    margin-bottom: 0;
  }

  .price {
    font-size: 18px;
  }

  .per-session {
    font-size: 14px;
  }

  .mobile-date {
    display: block;
  }

  .booking-actions-wrapper {
    flex: 0 0 auto;
    min-width: 140px;
  }

  .desktop-selectors {
    display: none;
  }

  .btn-reservar {
    padding: 12px 20px;
  }
}
</style>
