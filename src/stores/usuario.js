// stores/usuario.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const useusuarioStore = defineStore('usuario', {
    state: () => ({
        datosUsuario: null,
        cargando: false,
    }),

    actions: {
        async cargarUsuario() {
            this.cargando = true;
            try {
                this.datosUsuario = await api.user.getCurrent();
            } catch (error) {
                this.datosUsuario = null;
            } finally {
                this.cargando = false;
            }
        },

        async cerrarSesion() {
            try {
                await api.user.logout();
                this.datosUsuario = null;
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                this.datosUsuario = null;
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
    },
});