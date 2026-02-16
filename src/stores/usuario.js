// stores/usuario.js
import { defineStore } from "pinia";
import api from "../services/api.js";

export const useusuarioStore = defineStore('usuario', {
    state: () => ({
        datosUsuario: null,
        cargando: true,
    }),

    actions: {
        async cargarUsuario() {
            this.cargando = true;
            try {
                this.datosUsuario = await api.usuarios.getUsuarioActual();
            } catch (error) {
                this.datosUsuario = null;
            } finally {
                this.cargando = false;
            }
        },

        async cerrarSesion() {
            try {
                await api.usuarios.desloguear();
                this.datosUsuario = null;
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                this.datosUsuario = null;
            }
        },
        async iniciarSesion(credentials) {
            this.cargando = true;
            try {
                // Llamamos al endpoint de login de Laravel
                await api.usuarios.login(credentials);
                // Si el login es exitoso, cargamos los datos del usuario
                await this.cargarUsuario();
                return { success: true };
            } catch (error) {
                console.error("Error en el login:", error);
                let mensaje = "Error desconocido al iniciar sesión.";
                if (error.response?.status === 422) {
                    mensaje = "Credenciales inválidas.";
                } else if (error.response?.status === 401) {
                    mensaje = "Correo o contraseña incorrectos.";
                }
                return { success: false, message: mensaje };
            } finally {
                this.cargando = false;
            }
        },

        async actualizarFotoPerfil(file) {
            this.cargando = true;
            try {
                const formData = new FormData();
                formData.append('foto_perfil', file);
                await api.usuarios.updateProfilePhoto(formData);
                await this.cargarUsuario(); // Reload user data to get new image URL
                return { success: true };
            } catch (error) {
                console.error("Error updating profile photo:", error);
                return { success: false, error };
            } finally {
                this.cargando = false;
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