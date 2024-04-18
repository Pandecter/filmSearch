import { createRouter, createWebHistory } from 'vue-router'
import FavoritesPage from '@/components/FavoritesPage.vue'
import Error404 from '@/components/MyError404.vue'

const routes = [
  {
    path: '/:catchAll(.*)',
    name: 'Error404',
    component: Error404
  },
  {
    path: '/',
    component: () => import('@/views/MainPage.vue'),
  },
  {
    name: "favorites",
    path: '/favorites',
    component: FavoritesPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router