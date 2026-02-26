import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    // Lo que el usuario está eligiendo ahora mismo en la interfaz
    pending: {
      zona: null,
      fechas: { inicio: null, fin: null },
      servicio: null
    },
    // Lo que realmente se está aplicando al filtrado (después de dar a Buscar)
    active: {
      zona: null,
      fechas: { inicio: null, fin: null },
      servicio: null
    },
    isSearchActive: false
  }),

  actions: {
    setZona(zona) {
      this.pending.zona = zona
    },
    setFechas(fechas) {
      this.pending.fechas = fechas
    },
    setServicio(servicio) {
      this.pending.servicio = servicio
    },
    triggerSearch() {
      // Aplicamos lo pendiente a lo activo
      this.active = JSON.parse(JSON.stringify(this.pending))
      this.isSearchActive = true
    },
    resetFiltros() {
      const empty = {
        zona: null,
        fechas: { inicio: null, fin: null },
        servicio: null
      }
      this.pending = JSON.parse(JSON.stringify(empty))
      this.active = JSON.parse(JSON.stringify(empty))
      this.isSearchActive = false
    }
  }
})
