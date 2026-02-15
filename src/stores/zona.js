import { defineStore } from "pinia";
import api from "../services/api.js";

export const usezonasStore = defineStore('zonas', {
    state: () => ({
        debug: true,
        zonas: [],
        zonaEnEdicion: null,
        mensajes: []
    }),

    actions: {
        async todasLasZonas() {
            try {
                if (this.debug) console.log("todasLasZonas triggered");
                this.zonas = await api.zonas.getAll();
            } catch (error) {
                this.agregarMensaje("Error en todasLasZonas: " + error, "error");
            }
        },

        async unaZona(idzona) {
            try {
                if (this.debug) console.log("unaZona triggered", idzona);
                return await api.zonas.getOne(idzona);
            } catch (error) {
                this.agregarMensaje(`Error al obtener zona con id ${idzona}: ${error}`, "error");
                return null;
            }
        },
        /*async zonasPorGrupo(idJuego) {
            try {
                if (this.debug) console.log("zonasPorGrupo triggered :" + idJuego, idJuego);
                const resultado = await api.zonas.zonasPorGrupo(idJuego);
                this.zonas = resultado;
                return resultado;
            } catch (error) {
                this.agregarMensaje(`Error al obtener zonas de la empresa con id ${idJuego}: ${error}`, "error");
                return null;
            }
        },*/

        async anyadirZona(zona) {
            try {
                if (this.debug) console.log("anyadirZona triggered with", zona);
                const nuevozona = await api.zonas.create(zona);
                this.zonas.push(nuevozona);
            } catch (error) {
                this.agregarMensaje("Error al añadir zona: " + error, "error");
            }
        },

        /*async borrarZOna(idzona) {
            try {
                if (this.debug) console.log("borrarZOna triggered with id", idzona);
                await api.zonas.delete(idzona);
                this.zonas = this.zonas.filter(l => Number(l.id) !== Number(idzona));
            } catch (error) {
                this.agregarMensaje(`Error al eliminar zona con id ${idzona}: ${error}`, "error");
            }
        },*/

        async actualizarZona(zona) {
            try {
                if (this.debug) console.log("actualizarZona triggered", zona);
                const actualizado = await api.zonas.modify(zona);
                const index = this.zonas.findIndex(l => l.id === zona.id);
                if (index !== -1) this.zonas[index] = actualizado;
            } catch (error) {
                this.agregarMensaje("Error al actualizar zona: " + error, "error");
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
