// stores/index.js
import { usezonasStore } from './zona.js';
import { useserviciosStore } from './servicio.js';
import { usecategoriasStore } from './categoria.js';
import { useusuarioStore } from './usuario.js';



export const stores = {
  zona: usezonasStore,
  servicio: useserviciosStore,
  categoria: usecategoriasStore,
  usuario: useusuarioStore
};
