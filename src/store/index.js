import Vue from 'vue'
import Vuex from 'vuex'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    custom: {admin: true},
    admin: null,
    user: null,
    isAdmin:false
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
    },
    clearUser(state){
      state.user = null
    },
    setAdmin(state){
      state.isAdmin = true
    },
    clearAdmin(state){
      state.isAdmin = false
    }
  },
  actions: {
    signIn({ commit }, payload) {
      signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
        .then(user=>{
            const newUser = {
                id: user.uid,
                custom: {admin: true}
            }
            commit('setUser', newUser)
        })
        .catch(()=>{
            alert("Please enter your username and password again.")
        })
    },
  },
  getters:{
    admin(state){
      return state.admin
    },
    user(state){
      return state.user
    },
  }
})
