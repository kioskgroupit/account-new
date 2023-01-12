<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <h1>Pay All</h1>
                    <!-- <v-btn @click="updateBalanceInv"></v-btn> -->
                    <hr>

                    <!-- Search customer -->
                    <v-layout justify-center>
                        <v-flex xs2 d-flex justify-end my-4>
                            <h3>Select customer code:</h3>
                        </v-flex>
                        <v-flex xs3 pa-1 px-2>
                            <v-select :items="itemCust" v-model="custCode"></v-select>
                        </v-flex>
                        <v-flex xs2 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="searchInv">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>

                    <div v-if="showInvDetail">
                        <!-- Invoice detail -->
                        <v-data-table v-model="selected" :headers="headersInv" :items="InvDetail" item-key="invNo"
                            select-all class="elevation-1">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate
                                    v-if="showProgress"></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td><v-checkbox v-model="props.selected" hide-details></v-checkbox></td>
                                <td>{{ props.item.invNo }}</td>
                                <td>{{ props.item.invDate }}</td>
                                <td class="text-xs-right">
                                    {{ props.item.balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                            </template>
                        </v-data-table>

                        <!-- Summary info -->
                        <br>
                        <v-layout>
                            <v-flex xs5>
                            </v-flex>
                            <v-flex>
                                <v-layout>
                                    <v-flex xs8 mr-1 text-xs-right>
                                        <font size=3>Total:</font>
                                    </v-flex>
                                    <v-flex xs6 pr-3>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" disabled :value="sumTotal"
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs8 mr-1 text-xs-right>
                                        <font size=3>Discount:</font>
                                    </v-flex>
                                    <v-flex xs6 pr-3>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="disc" :max="sumTotal"
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs8 mr-1 text-xs-right>
                                        <font size=3>Balance amount to be paid:</font>
                                    </v-flex>
                                    <v-flex xs6 pr-3>
                                        <font size=3 color="red">
                                            <vue-numeric separator="," :precision="2" disabled :value="sumBalance"
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>

                        <br>
                        <hr>
                        <v-layout justify-center>
                            <v-flex xs3>
                                <v-select :items="itemPayMent" v-model="payMent" label="Payment:"
                                    ref="focusPayMent"></v-select>
                            </v-flex>
                            <v-flex xs2 text-xs-right py-4>
                                <h3>Amount received:</h3>
                            </v-flex>
                            <v-flex xs3 pa-1 pt-4>
                                <font size=3><vue-numeric separator="," :precision="2" v-model="amtRecei"
                                        :max="sumBalance" class="line"></vue-numeric></font>
                            </v-flex>
                            <v-flex xs2 px-2>
                                <v-menu v-model="menuPayDateInv" :close-on-content-click="false" :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="payDateInv" label="Date:" prepend-icon="event"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="payDateInv" @input="menuPayDateInv = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                        </v-layout>
                        <hr>
                        <br>
                        <v-layout>
                            <v-flex text-xs-center>
                                <v-btn @click="addNewCashRecei">save</v-btn>
                                <v-btn @click="cancel">cancel</v-btn>
                            </v-flex>
                        </v-layout>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
import { collection, getDocs, where, getFirestore, runTransaction, query, orderBy, doc, addDoc } from "firebase/firestore";
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        VueNumeric,
        mainMenu
    },
    data() {
        return {
            showProgress: true,
            itemCust: [],
            custCode: '',
            invId: '',
            showInvDetail: false,
            InvDetail: [],
            invArr: [],
            invNo: '',
            invDate: '',
            balance: 0,
            singleSelect: false,
            selected: [],
            headersInv: [
                { text: 'Invoice no', align: 'left', value: 'invNo' },
                { text: 'Invoice date', align: 'left', value: 'invDate' },
                { text: 'Balance', sortable: false, align: 'right' },
            ],
            pagination: { 'sortBy': 'invNo', 'descending': false },

            disc: 0,
            itemPayMent: [],
            payMent: '',
            amtRecei: 0,
            menuPayDateInv: false,
            payDateInv: new Date().toISOString().substr(0, 10),
            subTime: new Date().toTimeString().substr(0, 8),
        }
    },
    methods: {
        test() {
            console.log(this.selected)
        },

        // Search info from customer in invoice database
        async searchInv() {
            let custCodeAndName = this.custCode.split(":")
            let custCode = custCodeAndName[0].split(" ")
            let custName = custCodeAndName[1].substr(1)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "invoice"), where("code", "==", custCode[0]), where("name", "==", custName), where("balance", ">", 0));
               docRef.forEach(()=> {
                this.showProgress = true
                this.InvDetail = []
                  let i = 0
                  docRef.forEach(doc=> {
                    this.invNo = doc.data().invNo
                    this.invDate = doc.data().invDate.substr(0, 10)
                    if (doc.data().desc == "Credit note") {
                        this.balance = - doc.data().balance
                    }
                    else {
                        this.balance = doc.data().balance
                    }
                    this.InvDetail.push({ id: doc.docs[i].id, invNo: this.invNo, invDate: this.invDate, balance: this.balance })
                    i++
                })
                this.showInvDetail = true
                const docRef = getDocs(collection(db, "chartAccount"), where("cash", "==", "Y"));
                        docRef.forEach(() => {
                            this.itemPayMent = []
                            docRef.forEach(doc => {
                                let readDoc = doc.data().accName
                                this.itemPayMent.push(readDoc)
                            })
                        })
                })
        },

        // Add cash received info in database
        addNewCashRecei() {
            let app = this
            if (this.amtRecei != this.sumBalance) {
                this.amtRecei = 0
            }
            if (!this.payMent || !this.amtRecei) {
                if (!this.payMent) {
                    alert("Please select payment method.")
                    this.$nextTick(() => { this.$refs.focusPayMent.focus() })
                }
                else if (!this.amtRecei) {
                    alert("Please input amount received.")
                }
            }
            else {
                app.invArr = []
                let i = 0
                app.selected.forEach(rec => {
                    app.invArr.push(rec.invNo)
                    i++
                })
                if (app.selected.length === i) {
                    db.collection("cashReceiBook").add({
                        Amt: app.sumTotal,
                        custCode: app.custCode.substr(0, 6),
                        date: app.payDateInv + " " + app.subTime,
                        desc: 'Invoice payment',
                        disc: app.disc,
                        payMent: app.payMent,
                        refNo: app.invArr,
                        rvNo: '',
                        type: 'INV-'
                    })
                        .then(() => {
                            app.updateBalanceInv()
                        })
                }
            }
        },

        // Updated paid invoice
        updateBalanceInv() {
            // console.log(this.selected)
            let i = 0
            let app = this
            this.selected.forEach(rec => {
                db.collection("invoice").doc(rec.id).update({
                    balance: 0,
                    payMentStatus: 'Paid',
                    status: "Closed"
                })
                    .then(() => {
                        i++
                        callback()
                    })
            })
            let callback = function
                callback() {
                if (app.selected.length === i) {
                    alert("Add success.")
                    app.cancel()
                }
            }
        },

        // Clear web page
        cancel() {
            this.showInvDetail = false
            this.payMent = ''
            this.amtRecei = 0
            this.InvDetail = []
            this.selected = []
            this.custCode = ''
            this.disc = 0
        }
    },
    computed: {

        // Sum total from trial balance detail
        sumTotal() {
            return this.selected.reduce((total, item) => total + (item.balance), 0)
            // return this.InvDetail.reduce((total,item)=> total+(item.balance),0)
        },

        // Calulate balance
        sumBalance() {
            return this.sumTotal - this.disc
        },

        balanceInv() {
            return this.sumBalance - this.amtRecei
        }
    },
    async mounted() {
      // Show order info in the select order no box
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "invoice"), where("balance", ">", 0));
        docRef.forEach(() => {
            this.itemCust = []
            docRef.forEach(doc => {
                let codeDoc = doc.data().code
                let nameDoc = doc.data().name
                this.itemCust.push(codeDoc + " " + ":" + " " + nameDoc)
            })
            this.itemCust.sort()
        })
    }
    // async mounted() {
    //     // Show order info in the select order no box
    //     const db = getFirestore()
    //     const docRef = await getDocs(collection(db, "invoice"), where("balance", ">", 0));
    //         docRef.forEach(() => {
    //             this.itemCust = []
    //             docRef.forEach(doc => {
    //                 let codeDoc = doc.data().code
    //                 let nameDoc = doc.data().name
    //                 this.itemCust.push(codeDoc + " " + ":" + " " + nameDoc)
    //             })
    //             this.itemCust.sort()
    //         })
    // }
}
</script>
<style scoped>
.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
}
</style>