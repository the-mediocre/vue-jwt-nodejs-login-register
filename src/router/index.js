import vue from 'vue'
import vueRouter from 'vue-router';

vue.use(vueRouter)


const routes = [
  {
    path: '/login',
    component: () => import('@/pages/TheLogin.vue')
  },
  {
    path: '/register',
    component: () => import('@/pages/TheRegister.vue')
  },
  {
    path: '/hello',
    component: () => import('@/pages/TheHello.vue')
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new vueRouter({
  routes
})

router.beforeResolve((to, from, next) => {
  if (to.path === '/hello') {
    const value = localStorage.getItem('token')
    if (value && value !== 'undefined') {
      next()
    } else {
      next('/register')
    }
  }
  next()
})

export default router