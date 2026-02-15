import { defineStore } from "pinia";
import api from "../services/api.js";

export const usecategoriasStore = defineStore('categorias', {
    state: () => ({
        debug: true,
        categorias: [],
        categoriaEnEdicion: null,
        mensajes: []
    }),

    actions: {
        async todasLasCategorias() {
            try {
                if (this.debug) console.log("todasLasCategorias triggered");
                this.categorias = await api.categorias.getAll();
            } catch (error) {
                this.agregarMensaje("Error en todasLasCategorias: " + error, "error");
            }
        },

        async unaCategoria(idcategoria) {
            try {
                if (this.debug) console.log("unaCategoria triggered", idcategoria);
                return await api.categorias.getOne(idcategoria);
            } catch (error) {
                this.agregarMensaje(`Error al obtener categoria con id ${idcategoria}: ${error}`, "error");
                return null;
            }
        },
        /*async categoriasPorGrupo(idJuego) {
            try {
                if (this.debug) console.log("categoriasPorGrupo triggered :" + idJuego, idJuego);
                const resultado = await api.categorias.categoriasPorGrupo(idJuego);
                this.categorias = resultado;
                return resultado;
            } catch (error) {
                this.agregarMensaje(`Error al obtener categorias de la empresa con id ${idJuego}: ${error}`, "error");
                return null;
            }
        },*/

        async anyadirCategoria(categoria) {
            try {
                if (this.debug) console.log("anyadirCategoria triggered with", categoria);
                const nuevocategoria = await api.categorias.create(categoria);
                this.categorias.push(nuevocategoria);
            } catch (error) {
                this.agregarMensaje("Error al añadir categoria: " + error, "error");
            }
        },

        /*async borrarZOna(idcategoria) {
            try {
                if (this.debug) console.log("borrarZOna triggered with id", idcategoria);
                await api.categorias.delete(idcategoria);
                this.categorias = this.categorias.filter(l => Number(l.id) !== Number(idcategoria));
            } catch (error) {
                this.agregarMensaje(`Error al eliminar categoria con id ${idcategoria}: ${error}`, "error");
            }
        },*/

        async actualizarCategoria(categoria) {
            try {
                if (this.debug) console.log("actualizarCategoria triggered", categoria);
                const actualizado = await api.categorias.modify(categoria);
                const index = this.categorias.findIndex(l => l.id === categoria.id);
                if (index !== -1) this.categorias[index] = actualizado;
            } catch (error) {
                this.agregarMensaje("Error al actualizar categoria: " + error, "error");
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
