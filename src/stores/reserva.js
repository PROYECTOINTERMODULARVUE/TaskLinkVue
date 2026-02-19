import { defineStore } from "pinia";
import api from "../services/api.js";

export const usereservasStore = defineStore('reservas', {
    state: () => ({
        debug: true,
        reservas: [],
        reservasRecibidas: [], // Reservas para el proveedor
        reservasHechas: [],    // Reservas hechas por el cliente
        mensajes: []
    }),

    getters: {
        pendientesCount: (state) => {
            return state.reservasRecibidas.filter(r => r.Estado === 'Pendiente').length;
        }
    },

    actions: {
        async fetchReservasHechas() {
            try {
                if (this.debug) console.log("fetchReservasHechas triggered");
                this.reservasHechas = await api.reservas.getAll();
            } catch (error) {
                this.agregarMensaje("Error al obtener tus reservas: " + error, "error");
            }
        },

        async cancelarReservaCliente(id) {
            try {
                if (this.debug) console.log(`cancelarReservaCliente triggered for ${id}`);
                const response = await api.reservas.delete(id);

                // Actualizar localmente el estado a 'Cancelada'
                const index = this.reservasHechas.findIndex(r => r.IDReserva === id);
                if (index !== -1) {
                    this.reservasHechas[index].Estado = 'Cancelada';
                }

                return response;
            } catch (error) {
                this.agregarMensaje("Error al cancelar la reserva: " + error, "error");
                throw error;
            }
        },

        async todasLasReservas() {
            try {
                if (this.debug) console.log("todasLasReservas triggered");
                this.reservas = await api.reservas.getAll();
            } catch (error) {
                this.agregarMensaje("Error en todasLasReservas: " + error, "error");
            }
        },

        async unaReserva(id) {
            try {
                if (this.debug) console.log("unaReserva triggered", id);
                return await api.reservas.getOne(id);
            } catch (error) {
                this.agregarMensaje(`Error al obtener reserva con id ${id}: ${error}`, "error");
                return null;
            }
        },

        async anyadirReserva(reserva) {
            try {
                if (this.debug) console.log("anyadirReserva triggered with", reserva);
                const nuevaReserva = await api.reservas.create(reserva);
                this.reservas.push(nuevaReserva);
                return nuevaReserva;
            } catch (error) {
                this.agregarMensaje("Error al añadir reserva: " + error, "error");
                throw error; // Re-throw to handle in component
            }
        },

        async fetchReservasRecibidas() {
            try {
                if (this.debug) console.log("fetchReservasRecibidas triggered");
                this.reservasRecibidas = await api.proveedor.getReservas();
            } catch (error) {
                this.agregarMensaje("Error al obtener reservas recibidas: " + error, "error");
            }
        },

        async actualizarEstadoReserva(id, estado) {
            try {
                if (this.debug) console.log(`actualizarEstadoReserva triggered for ${id} with ${estado}`);
                const response = await api.proveedor.updateReservaEstado(id, estado);

                // Actualizar localmente
                const index = this.reservasRecibidas.findIndex(r => r.IDReserva === id);
                if (index !== -1) {
                    this.reservasRecibidas[index].Estado = estado;
                }

                return response;
            } catch (error) {
                this.agregarMensaje("Error al actualizar estado de reserva: " + error, "error");
                throw error;
            }
        },

        agregarMensaje(texto, tipo) {
            const mensaje = {
                id: Date.now(),
                texto,
                tipo
            };
            this.mensajes.push(mensaje);

            setTimeout(() => {
                this.mensajes = this.mensajes.filter(m => m.id !== mensaje.id);
            }, 10000);
        }
    }
});
