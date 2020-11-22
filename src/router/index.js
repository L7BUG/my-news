import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/admin/Login')
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Admin'),
    redirect: '/admin/welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/admin/Welcome')
      },
      {
        path: 'users',
        component: () => import('@/views/users/users')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  // if (to.path === '/login') return next()
  // // 拿到token判断是否具有token
  // const token = window.sessionStorage.getItem('token')
  // if (!token) return next('/login')
  next()
})
export default router
