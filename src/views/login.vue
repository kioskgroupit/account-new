<template>
    <v-app>
        <!-- <mainMenu></mainMenu> -->
        <v-container fluid fill-height loginOverlay>
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm4 elevation-6>
                    <v-toolbar class="blue darken-4">
                        <v-toolbar-title class="white--text">
                            <font size="5">
                                <v-icon dark large>mdi-account-box</v-icon>
                                Login
                            </font>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text pt-4>
                            <v-form>
                                <v-text-field label="Enter your E-mail" ref="focusUser" v-model="email"
                                    :rules="emailRules" required @keypress.enter="login">
                                </v-text-field>
                                <v-text-field label="Enter your Password" v-model="password"
                                    :type="hidePass ? 'password' : 'text'" :rules="passwordRules" required
                                    @keypress.enter="login" ref="focusPass">
                                </v-text-field>
                                <v-layout justify-end>
                                    <!-- <a href="">Sign up</a> -->
                                    <a @click="showReset">Forgot Password</a>
                                </v-layout>
                                <v-layout>
                                    <v-btn @click="login"
                                        :class="{ 'blue darken-4 white--text': valid, disabled: !valid }">OK</v-btn>
                                    <!-- <v-btn @click="onListUsers" :class=" { 'blue darken-4 white--text' : valid, disabled: !valid }">list</v-btn> -->
                                </v-layout>
                                <v-dialog v-model="showRePass" persistent max-width="300px">
                                    <v-card>
                                        <v-card-title class="headline">Reset your password</v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-flex>
                                                    <v-text-field label="Enter your E-mail" ref="focusEmail" solo
                                                        v-model="resetPass" :rules="emailRules" required
                                                        @keypress.enter="sendEmail">
                                                    </v-text-field>
                                                </v-flex>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" flat @click="cancelResetPass">Cancel</v-btn>
                                            <v-btn color="blue darken-1" flat @click="sendEmail">Send</v-btn>
                                        </v-card-actions>
                                    </v-card>

                                </v-dialog>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'


// import mainMenu from '@/components/mainMenu.vue'
export default {
    components:{
        // mainMenu
    },
    data() {
        return {
            valid: false,
            hidePass: true,
            showRePass: false,
            // username: '',
            email: '',
            password: '',
            // email: '',
            // password: '',
            resetPass: '',
            // userRules:[
            //     (v) => !!v || 'Username is required',
            // ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ],
            passwordRules: [
                (v) => !!v || 'Password is required',
            ],
        }
    },
    methods: {
        login() {
            if (this.email == "") {
                alert("Please enter your username.")
                this.$refs.focusUser.focus()
            }
            else if (this.password == "") {
                alert("Please enter your password.")
                this.$refs.focusPass.focus()
            }
            else {
                signInWithEmailAndPassword(getAuth(), this.email, this.password)
                    .then(() => {
                        // alert("login successfully!")
                    })
                    .catch(() => {
                        alert("Please enter your username and password again.")
                    })
            }
        },
        showReset() {
            this.showRePass = true
            this.$nextTick(() => { this.$refs.focusEmail.focus() })
        },
        cancelResetPass() {
            this.showRePass = false
            this.resetPass = ''
            this.$nextTick(() => { this.$refs.focusUser.focus() })
        },
        sendEmail() {
            if (this.resetPass == '') {
                alert("Please enter your e-mail.")
                this.$nextTick(() => { this.$refs.focusEmail.focus() })
            }
            else {
                sendPasswordResetEmail(getAuth(), this.resetPass)
                    .then(() => {
                        alert("Password reset e-mail send.")
                        this.cancelResetPass()
                    })
            }
        }

    },
    computed: {
        user() {
            return this.$store.state.user
        },
        user2() {
            return sessionStorage.user
        }
    },
    mounted() {
        getAuth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult().then(idTokenResult => {
                    if (idTokenResult.claims.admin) {
                        // this.$store.commit('setAdmin')
                        sessionStorage.isAdmin = 'true'
                    }
                    else {
                        // this.$store.commit('clearAdmin')
                        sessionStorage.isAdmin = 'false'
                    }
                })
                this.$store.commit('setUser', user.email)
                sessionStorage.user = user.email
                // this.$router.push("/index")
                this.$router.currentRoute.name !== 'index' && this.$router.push({ name: 'index' })
            }
            else {
                this.$store.commit('nullUser')
                sessionStorage.user = 'null'
                sessionStorage.isAdmin = 'false'
            }
        })
        this.$nextTick(() => { this.$refs.focusUser.focus() })
    }
}
</script>
