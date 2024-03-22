// Composables
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
    //children: [
      //{
        // path: '',
        // name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // component: () => import(),
      //},
    //],
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
