// stores/index.js
import { usezonasStore } from './zona.js';
import { useserviciosStore } from './servicio.js';
import { usecategoriasStore } from './categoria.js';
import { useusuarioStore } from './usuario.js';
import { usereservasStore } from './reserva.js';
import { useRolStore } from './rol.js';

export const useStores = () => {
  return {
    zona: usezonasStore(),
    servicio: useserviciosStore(),
    categoria: usecategoriasStore(),
    usuario: useusuarioStore(),
    reserva: usereservasStore(),
    rol: useRolStore()
  };
};
