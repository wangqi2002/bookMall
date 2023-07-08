import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import axios1 from "../api/axios"
import VueSocketIO from 'vue-socket.io'
import ClientSocketIO from 'socket.io-client'
import moment from "moment"


Vue.use(new VueSocketIO({
  // debug: true,
  // 服务器端地址
  /* connection: ClientSocketIO.connect('http://localhost:4000/', {
    transports: ['websocket']
  }) */
  connection: ClientSocketIO.connect('https://serve.sirbook.top/', {
    transports: ['websocket']
  })
}))
Vue.prototype.$axios = axios1
Vue.prototype.$moment = moment;

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
