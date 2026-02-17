import { defineStore } from "pinia";
import { useusuarioStore } from "./usuario";

export const useRolStore = defineStore('rol', {
    state: () => ({
        // We generally rely on the user store for the current user's role
    }),

    getters: {
        currentUser: () => {
            const usuarioStore = useusuarioStore();
            return usuarioStore.datosUsuario;
        },

        currentRole: (state) => {
            const user = state.currentUser;
            if (!user) return null;
            return user.Rol || 'usuario'; // Fallback to 'usuario' if Rol string is missing but user exists
        },

        isAdmin: (state) => {
            return state.currentRole === 'admin';
        },

        isGestor: (state) => {
            return state.currentRole === 'creadorServicio';
        },

        isCliente: (state) => {
            return state.currentRole === 'usuario';
        },

        canCreateService: (state) => {
            return ['admin', 'creadorServicio'].includes(state.currentRole);
        }
    },

    actions: {
        hasRole(roleOrRoles) {
            const role = this.currentRole;
            if (!role) return false;

            if (Array.isArray(roleOrRoles)) {
                return roleOrRoles.includes(role);
            }
            return role === roleOrRoles;
        }
    }
});
