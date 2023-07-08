import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: '/dashboard/welcome',
      component: () => import('@/components/DashboardPage'),
      children: [
        {
          path: 'welcome',
          name: 'welcome',
          component: () => import('@/components/WelcomePage')
        },
        {
          path: 'goods',
          name: 'goods',
          component: () => import('@/components/Goods/GoodsPage')
        },
        {
          path: 'nature',
          name: 'nature',
          component: () => import('@/components/Nature/NaturePage')
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/components/Order/OrderPage')
        },
        {
          path: 'ordersell',
          name: 'ordersell',
          component: () => import('@/components/Order/OrderSellPage')
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/components/User/UserPage')
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/components/Admin/AdminPage')
        },
        {
          path: 'admin/add',
          name: 'admin_add',
          component: () => import('@/components/Admin/AdminAddPage')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/LoginPage')
    },
    {
      path: '*',
      redirect: '/dashboard'
    }
  ]
})
