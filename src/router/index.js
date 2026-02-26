import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import PaginaPrincipalView from '@/views/PaginaPrincipalView.vue'
import PathNotFound from '@/views/PathNotFound.vue'
import RegisterView from '@/views/RegisterView.vue'
import ServicioView from '@/views/ServicioView.vue'
import { useusuarioStore } from '@/stores/usuario'
import { useRolStore } from '@/stores/rol' // Import rol store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PaginaPrincipalView
    },
    {
      path: '/servicio/:id',
      name: 'servicio',
      component: ServicioView
    },
    {
      path: '/:pathMatch(.*)*',
      component: PathNotFound
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView
    },
    {
      path: '/servicios/crear',
      name: 'crear-servicio',
      component: () => import('@/views/ServicioCrearView.vue'), // Lazy load if exists, or create it
      meta: { requiresRole: ['admin', 'creadorServicio'] }
    },
    {
      path: '/admin/configuracion-web',
      name: 'configuracion-web',
      component: () => import('@/views/AdminConfigView.vue'),
      meta: { requiresRole: ['admin'] }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/ProfileShowView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil/editar',
      name: 'perfil-editar',
      component: () => import('@/views/ProfileEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ayuda',
      name: 'ayuda',
      component: () => import('@/views/AyudaView.vue')
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('@/views/FavoritosVue.vue')
    },
    {
      path: '/mensajes',
      name: 'mensajes',
      component: () => import('@/views/MensajesView.vue')
    },
    {
      path: '/empleo',
      name: 'empleo',
      component: () => import('@/views/EmpleoView.vue')
    },
    {
      path: '/lanzamiento',
      name: 'lanzamiento',
      component: () => import('@/views/LanzamientoTaskLinkView.vue')
    },
    {
      path: '/confirmacion-reserva/:id',
      name: 'confirmacion-reserva',
      component: () => import('@/views/ReservaConfirmacionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pago-reserva/:id',
      name: 'pago-reserva',
      component: () => import('@/views/PagoReservaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/sostenibilidad',
      name: 'sostenibilidad',
      component: () => import('@/views/SostenibilidadView.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const usuarioStore = useusuarioStore()
  const rolStore = useRolStore()

  if (usuarioStore.cargando) {
    if (!usuarioStore.datosUsuario) {
      await usuarioStore.cargarUsuario()
    }
  }

  if (to.meta.requiresRole) {
    if (!usuarioStore.datosUsuario) {
      return next({ name: 'login' })
    }

    // Use rolStore to check permissions
    const requiredRoles = to.meta.requiresRole
    if (!rolStore.hasRole(requiredRoles)) {
      return next({ name: 'home' }) // Or 'access-denied' page
    }
  }
  next()
})

export default router
