import { createWebHistory, createRouter } from '@ionic/vue-router';
import routes from '@/router/routes';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to: any, from: any, next: any) => {
  const isAuth = localStorage.getItem('token') || null
  if (to.meta.requiresLogin && !isAuth) {
    next({path: '/'})
    location.reload()
  } else next()
})
export default router