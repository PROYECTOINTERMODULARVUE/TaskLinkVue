<script setup>
import { ref, computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { es } from 'date-fns/locale'
import { addDays, nextFriday, nextSunday, startOfToday } from 'date-fns'

const date = ref(null)
const open = ref(false)

const formattedDate = computed(() => {
  if (!date.value) return 'Introduce las fechas'
  if (Array.isArray(date.value)) {
    const [start, end] = date.value
    if (!start) return 'Introduce las fechas'
    const startStr = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    if (!end) return startStr
    const endStr = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
    return `${startStr} - ${endStr}`
  }
  return date.value.toLocaleDateString('es-ES')
})

const toggleDropdown = () => {
  open.value = !open.value
}

// Quick Select Logic
const selectDateOption = (option) => {
  const today = startOfToday()

  if (option === 'hoy') {
    date.value = [today, today]
  } else if (option === 'manana') {
    const tmrw = addDays(today, 1)
    date.value = [tmrw, tmrw]
  } else if (option === 'finde') {
    const friday = nextFriday(today)
    const sunday = nextSunday(today)
    date.value = [friday, sunday]
  }
}
</script>

<template>
  <div class="fechaSelectorWrapper" tabindex="0" @blur="open = false">
    <!-- Trigger -->
    <p class="selector-trigger" @click="toggleDropdown">{{ formattedDate }}</p>

    <!-- Dropdown -->
    <div v-if="open" class="date-dropdown" @mousedown.prevent>
      <div class="dropdown-content">
        <!-- Sidebar / Topbar for Quick Options -->
        <div class="quick-options">
          <div class="option-card" @click="selectDateOption('hoy')">
            <span class="option-title">Hoy</span>
            <span class="option-date">{{
              new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            }}</span>
          </div>
          <div class="option-card" @click="selectDateOption('manana')">
            <span class="option-title">Mañana</span>
            <span class="option-date">{{
              addDays(new Date(), 1).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            }}</span>
          </div>
          <div class="option-card" @click="selectDateOption('finde')">
            <span class="option-title">Este finde</span>
            <span class="option-date">Viernes - Domingo</span>
          </div>
        </div>

        <!-- Calendar -->
        <div class="calendar-wrapper">
          <VueDatePicker
            v-model="date"
            inline
            auto-apply
            :enable-time-picker="false"
            range
            :format-locale="es"
            :month-change-on-scroll="false"
            class="custom-datepicker"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fechaSelectorWrapper {
  position: relative;
  width: 100%;
  outline: none;
}

.selector-trigger {
  margin: 0;
  font-size: 14px;
  color: #717171;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 0;
}

/* Dropdown Container */
.date-dropdown {
  position: absolute;
  top: 60px;
  left: -20px;
  background: white;
  border-radius: 32px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  margin-top: 10px;
  z-index: 100;
  animation: slideDown 0.25s cubic-bezier(0.2, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  /* Desktop: Side by side */
  width: auto;
  min-width: 600px;
}

.dropdown-content {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.quick-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 160px;
  flex-shrink: 0;
}

.option-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.option-card:hover {
  border-color: #000;
  background: #f9f9f9;
}

.option-title {
  font-weight: 600;
  font-size: 14px;
  color: #222;
}

.option-date {
  font-size: 12px;
  color: #717171;
  margin-top: 4px;
}

.calendar-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Customizing VueDatePicker to match theme */
:deep(.dp__theme_light) {
  --dp-primary-color: #007bff;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: transparent;
  --dp-menu-border-color: transparent;
  --dp-border-color-hover: #007bff;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #007bff;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #007bff;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(0 123 255 / 10%);
  --dp-font-family: inherit;
  --dp-border-radius: 12px;
  --dp-cell-border-radius: 50%;
}

:deep(.dp__calendar_header_item) {
  font-weight: 600;
  font-size: 13px;
  color: #717171;
}

:deep(.dp__month_year_select) {
  font-weight: 700;
  color: #222;
}

:deep(.dp__instance_calendar) {
  font-family: inherit;
}

/* MOBILE STYLES */
@media (max-width: 950px) {
  .date-dropdown {
    width: 100%;
    left: 0;
    position: static;
    box-shadow: none;
    border: 1px solid #eee;
    margin-top: 10px;
    padding: 16px;
    min-width: 0;
  }

  .dropdown-content {
    flex-direction: column; /* Stack vertically on mobile */
    gap: 16px;
  }

  .quick-options {
    flex-direction: row; /* Horizontal pills on mobile */
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px; /* Space for scrollbar if needed */
  }

  .option-card {
    min-width: 100px;
    flex: 1;
    text-align: center;
    align-items: center;
  }
}
</style>
