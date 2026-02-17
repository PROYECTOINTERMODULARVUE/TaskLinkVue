import { defineStore } from "pinia";
import api from "../services/api.js";

export const useserviciosStore = defineStore('servicios', {
    state: () => ({
        debug: true,
        servicios: [],
        servicioEnEdicion: null,
        servicioPasado: null,
        mensajes: []
    }),

    actions: {
        async todasLasServicios() {
            try {
                if (this.debug) console.log("todasLasServicios triggered");
                this.servicios = await api.servicios.getAll();
            } catch (error) {
                this.agregarMensaje("Error en todasLasServicios: " + error, "error");
            }
        },

        async unaServicio(idservicio) {
            try {
                if (this.debug) console.log("unaServicio triggered", idservicio);
                return await api.servicios.getOne(idservicio);
            } catch (error) {
                this.agregarMensaje(`Error al obtener servicio con id ${idservicio}: ${error}`, "error");
                return null;
            }
        },
        async serviciosPorCategoria(idCategoria) {
            try {
                if (this.debug) console.log("serviciosPorCategoria triggered", idservicio);
                const resultado = await api.servicios.serviciosPorCategoria(idCategoria);
                this.servicios = resultado;
                return resultado;
            } catch (error) {
                this.agregarMensaje("Error al buscar por categoria: " + error, "error");
            }
        },

        async anyadirServicio(servicio) {
            try {
                if (this.debug) console.log("anyadirServicio triggered with", servicio);
                const nuevoservicio = await api.servicios.create(servicio);
                this.servicios.push(nuevoservicio);
            } catch (error) {
                this.agregarMensaje("Error al añadir servicio: " + error, "error");
            }
        },

        /*async borrarZOna(idservicio) {
            try {
                if (this.debug) console.log("borrarZOna triggered with id", idservicio);
                await api.servicios.delete(idservicio);
                this.servicios = this.servicios.filter(l => Number(l.id) !== Number(idservicio));
            } catch (error) {
                this.agregarMensaje(`Error al eliminar servicio con id ${idservicio}: ${error}`, "error");
            }
        },*/

        async actualizarServicio(servicio) {
            try {
                if (this.debug) console.log("actualizarServicio triggered", servicio);
                const actualizado = await api.servicios.modify(servicio);
                const index = this.servicios.findIndex(l => l.id === servicio.id);
                if (index !== -1) this.servicios[index] = actualizado;
            } catch (error) {
                this.agregarMensaje("Error al actualizar servicio: " + error, "error");
            }
        },
        setServicioPasado(servicio) {
            if (this.debug) console.log("setServicioPasado triggered", servicio);
            this.servicioPasado = servicio;
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
