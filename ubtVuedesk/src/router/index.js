import store from "../store/index"

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../views/Home"
import Login from "../views/Login"
import Register from "../views/Register"
import BookShow from "../components/BookShow"
import MyAccount from "../components/MyAccount"
import AccountShow from "../components/accounts/AccountShow"
import SetAccount from "../components/accounts/SetAccount"
import PublishBook from "../views/PublishBook"
import BookDetails from "../components/BookDetails"
import Chart from "../components/Chart"
import Order from "../components/Order"
import MyOrder from "../components/accounts/MyOrder"
import Collection from "../components/Collection"



Vue.use(VueRouter)

//获取原型对象上的push函数，这两个配置就是为了避免点击同一个路由报错
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: "/",
        components: {
          container: BookShow
        }
      },
      {
        path: "/MyOrder",
        name: "MyOrder",
        components: {
          container: MyOrder
        }
      },
      {
        path: "/Collection",
        name: "Collection",
        components: {
          container: Collection
        }
      },
      {
        path: "/publishbook",
        name: "publishbook",
        components: {
          container: PublishBook
        }
      },
      {
        path: "/Order",
        name: "Order",
        components: {
          container: Order
        }
      },
      {
        path: "/bookdetails",
        name: "bookdetails",
        components: {
          container: BookDetails
        }
      },
      {
        path: "/myaccount",
        components: {
          container: MyAccount
        },
        children: [
          {
            path: "/",
            components: {
              account: AccountShow
            }
          },
          {
            path: "setaccount",
            components: {
              account: SetAccount
            }
          },
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/chart",
    name: "chart",
    component: Chart
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    store.dispatch("changehomebol", true)
    next()
  } else {
    store.dispatch("changehomebol", false)
    next()
  }
})

export default router
