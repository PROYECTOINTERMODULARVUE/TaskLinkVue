import PaginaPrincipalView from '@/views/PaginaPrincipalView.vue'
import PathNotFound from '@/views/PathNotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PaginaPrincipalView
    },
     {
      path: '/:pathMatch(.*)*',
      component: PathNotFound
    },
  ],
})

export default router
