import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bol: true,
    homeBol: true,
    userInfo: {
      user_id: null,
      user_nickname: null,
      user_image: null,
      user_telphone: null,
      user_loacation: null,
      user_name: null,
    },
    imgUrl: 'https://serve.sirbook.top'
  },
  mutations: {
    CHANGEBOL(state, val) {
      state.bol = val
    },
    CHANGEUSERINFO(state, val) {
      state.userInfo.user_id = val.user_id
      state.userInfo.user_nickname = val.user_nickname
      state.userInfo.user_image = val.user_image
      state.userInfo.user_telphone = val.user_telphone
      state.userInfo.user_loacation = val.user_loacation
      state.userInfo.user_name = val.user_name
    },
    CHANGEHOMEBOL(state, val) {
      state.homeBol = val
    },
  },
  actions: {
    changebol(context, val) {
      context.commit("CHANGEBOL", val)
    },
    changeuserinfo(context, val) {
      context.commit("CHANGEUSERINFO", val)
    },
    changehomebol(context, val) {
      context.commit("CHANGEHOMEBOL", val)
    }
  },
  modules: {
  }
})
