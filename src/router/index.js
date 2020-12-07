import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/admin/Login')
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
        path: 'role',
        component: () => import('@/views/admin/Role')
      },
      {
        path: 'password',
        component: () => import('@/views/admin/AdminPassword')
      },
      {
        path: 'users',
        component: () => import('@/views/admin/Users')
      },
      {
        path: 'newTag',
        component: () => import('@/views/admin/NewTag')
      },
      {
        path: 'news',
        component: () => import('@/views/admin/News')
      },
      {
        path: 'comment',
        component: () => import('@/views/admin/Comment')
      },
      {
        path: 'myPush',
        component: () => import('@/views/admin/MyPush')
      },
      {
        path: 'push',
        component: () => import('@/views/admin/Push')
      },
      {
        path: 'myComment',
        component: () => import('@/views/admin/MyComment')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/') return next()
  // 拿到token判断是否具有token
  const token = window.sessionStorage.getItem('user')
  if (!token) return next('/login')
  next()
})
export default router
