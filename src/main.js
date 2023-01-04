import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    const firebaseConfig = {
          apiKey: "AIzaSyCwQIC_xu001E7Urdi0spCdMNJnCPap3dg",
          authDomain: "account-new-23.firebaseapp.com",
          projectId: "account-new-23",
          storageBucket: "account-new-23.appspot.com",
          messagingSenderId: "338345091333",
          appId: "1:338345091333:web:5e85468782bf84f293d76c"
    }
    initializeApp(firebaseConfig)
  }
}).$mount('#app')

const auth = getAuth()
const { db } = getFirestore()
export { auth, db }