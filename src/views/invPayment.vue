<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Invoice Payment</h1>
                    <hr>
                    <div>

                        <!-- Search invoice -->
                        <v-layout justify-center>
                            <v-flex xs2 d-flex justify-end my-4>
                                <h3>Select Invoice no:</h3>
                            </v-flex>
                            <v-flex xs3 pa-1 px-2>
                                <v-select :items="itemInv" v-model="searchInv"></v-select>
                            </v-flex>
                            <v-flex xs2 my-2>
                                <v-btn fab small color="indigo lighten-1" dark @click="searchInvoice()">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <hr>
                        <br>
                        <div v-if="showDetails">

                            <!-- Edit invoice payment -->
                            <div v-if="this.balance > 0">
                                <v-layout indigo lighten-1 v-for="(item, i) in countPayment" :key="i">
                                    <v-layout>
                                        <v-flex xs2 px-1>
                                            <h3>
                                                <font color="white">Down payment {{ i+ 1}}:</font>
                                            </h3>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-select :items="itemPayMent" color="white" v-model="item.payMent"
                                                label="Payment:" ref="focuspayMent" dark
                                                :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-select>
                                        </v-flex>
                                        <v-flex xs4 pa-1 pt-4>
                                            <font size=3 color="white"><vue-numeric separator="," :precision="2"
                                                    v-model="item.down" :max="item.down > balance ? item.down : balance"
                                                    class="lineWhite" ref="focusDown"
                                                    :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></vue-numeric>
                                            </font>
                                        </v-flex>
                                        <v-flex xs4 px-2>
                                            <!-- <v-text-field v-model="item.date" color="white" label="Date:" prepend-icon="event"
                                            dark :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-text-field> -->
                                            <v-menu v-model="item.menuPayDateInv" :close-on-content-click="false"
                                                :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="item.date" color="white" label="Date:"
                                                        prepend-icon="event" readonly v-on="on" dark
                                                        :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="item.date" @input="item.menuPayDateInv = false"
                                                    :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                </v-layout>
                            </div>
                            <br>
                            <hr>
                            <form>

                                <!-- Show Inv no -->
                                <v-layout>
                                <v-flex xs12 d-flex justify-end pa-2 my-4>
                                        <h3>Inv no:</h3>
                                    </v-flex>
                                    <v-flex xs1 pa-1 pl-2 text-xs-right>
                                        <v-text-field v-model="invNo" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <!-- Invoice Form     -->
                                <!-- Date selector -->
                                <v-layout>
                                    <v-flex offset-xs10>
                                        <v-menu v-model="onMenuInvDate" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y
                                            min-width="290px" readonly>
                                            <template>
                                                <v-text-field v-model="invDate" label="Date:" prepend-icon="event"
                                                    readonly></v-text-field>
                                            </template>
                                            <v-date-picker v-model="invDate" @input="onMenuInvDate = false"
                                                :min="nowDate" readonly></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>

                                <!-- customer info -->
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Customer code:</v-flex>
                                        <input type="text" class="inputCust" size="20" v-model="code" disabled>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Customer name:</v-flex>
                                        <v-flex xs6>
                                            <input type="text" class="inputCust" size="35" v-model="name" disabled>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Address:</v-flex>
                                        <v-flex xs8>
                                            <input type="text" class="inputCust" size="45" v-model="address" disabled>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>PO ref#:</v-flex>
                                        <v-flex xs5>
                                            <input type="text" class="inputCust" size="30" v-model="poRef" disabled>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Contact name:</v-flex>
                                        <v-flex xs5>
                                            <input type="text" class="inputCust" size="25" v-model="contact" disabled>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Tel:</v-flex>
                                        <v-flex xs5>
                                            <input type="text" class="inputCust" autocomplete="off" v-model="tel"
                                                disabled>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <hr>

                                <!-- Header order detail -->
                                <v-layout pt-2 pb-2 indigo lighten-4>
                                    <v-flex pl-1 center>
                                        <h4>No</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Model</h4>
                                    </v-flex>
                                    <v-flex xs3 center pl-3>
                                        <h4>Description</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Frame</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Front</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Quantity</h4>
                                    </v-flex>
                                    <v-flex xs2 right pr-2>
                                        <h4>Price</h4>
                                    </v-flex>
                                    <v-flex xs2 right pr-2>
                                        <h4>Amount</h4>
                                    </v-flex>
                                    <v-flex xs2 center></v-flex>
                                </v-layout>
                                <hr>

                                <!-- Order detail -->
                                <v-layout v-for="(item, i) in detail" :key="i">
                                    <v-flex my-3 pa-2 padDing class="txtCenter">
                                        <font size=4>{{ i+ 1}}</font>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.Code" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3 pl-3>
                                        <v-text-field v-model="item.NameMM" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.frame" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.front" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.num" reverse type="number" readonly
                                            tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 my-3 pa-2 ml-1>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.PriceMM"
                                                class="line" disabled></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 my-3 pr-2 pa-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" disabled :value="item.amt"
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 center my-2>
                                    </v-flex>
                                </v-layout>
                                <hr>
                                <br>

                                <!-- Summary information -->
                                <v-layout>
                                    <v-flex xs5>
                                    </v-flex>
                                    <v-flex>
                                        <v-layout>
                                            <v-flex xs6 mr-1 class="sum">
                                                <font size=3>Total:</font>
                                            </v-flex>
                                            <v-flex xs3 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled :value="sumTotal"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs6 mr-1 class="sum">
                                                <font size=3>Discount:</font>
                                            </v-flex>
                                            <v-flex xs3 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled v-model="disc"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs6 mr-1 class="sum">
                                                <font size=3>Net amount:</font>
                                            </v-flex>
                                            <v-flex xs3 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled
                                                        :value="sumTotal - disc" class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs6 mr-1 class="sum">
                                                <font size=3>Down amount:</font>
                                            </v-flex>
                                            <v-flex xs3 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled v-model="down"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs6 mr-1 class="sum">
                                                <font size=3>Balance amount to be paid:</font>
                                            </v-flex>
                                            <v-flex xs3 pr-3 class="sum">
                                                <font size=3 color=red>
                                                    <vue-numeric separator="," :precision="2" disabled :value="balance"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                                <br>
                            </form>
                            <hr>
                            <br><br>

                            <!-- save and cancel button -->
                            <v-layout align-center column>
                                <v-flex>
                                    <v-btn class="mr-2" @click="addEditPayment()"  :disabled="this.balance == 0">
                                        <v-icon dark>mdi-content-save</v-icon>
                                        Save
                                    </v-btn>
                                    <v-btn class="ml-2" @click="clearInv()">
                                        <v-icon dark>mdi-close</v-icon>
                                        Cancel
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </div>
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
            subTime: new Date().toTimeString(),
            itemInv: [],
            invId: '',
            orderNo: '',
            idOrder: '',
            // idCashbook: '',
            modal: false,
            searchInv: '',
            nowDate: new Date().toISOString().slice(0, 10),
            showDetails: false,

            itemPayMent: [],
            payMent: '',
            amtRecei: 0,

            invNo: '',
            invDate: new Date().toISOString(),

            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',

            detail: [],

            disc: 0,
            down: 0,
            balance: 0,

            onMenuInvDate: false,
            menuPayDateOrder: false,
            menuPayDateInv: false,
            balanceOrder: 0,
            countPayment: [],
            lastPayMent: '',
            lastDown: 0,
            lastDate: 0
        }
    },
    methods: {

        // Search invoice from database
        async searchInvoice() {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "invoice"), where("invNo", "==", this.searchInv));
            docRef.forEach(docs => {
                // console.log(querySnapshot)
                if (docs.empty) {
                    alert("Invoice no is not correct...\nPlease Try again")
                    // this.$refs.invoiceNo.focus()
                }
                else {
                    this.showDetails = true
                    let doc = docs.data()
                    let docId = docs.id

                    this.invId = docId
                    this.orderNo = doc.orderNo
                    this.invNo = doc.invNo
                    this.invDate = doc.invDate
                    this.code = doc.code
                    this.name = doc.name
                    this.address = doc.address
                    this.poRef = doc.poRef
                    this.contact = doc.contact
                    this.tel = doc.tel
                    this.detail = doc.detail
                    this.disc = doc.disc
                    this.down = doc.down
                    this.balance = doc.balance
                    this.down = doc.down
                    this.countPayment = doc.countPayment
                    // this.countPayment.forEach(rec => {
                    //     rec.date = rec.date()
                    // })
                    // this.countPayment.push({ payMent: '', down: 0, date: '' })


                    const docRef = getDocs(collection(db, "order"), where("orderNo", "==", this.orderNo));
                    docRef.forEach(snapshotOrder => {
                        let docIdOrder = snapshotOrder.docs[0].id
                        this.idOrder = docIdOrder
                        this.balanceOrder = doc.balance
                    })
                }
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

        // Add Edit Payment to database
        addEditPayment() {
            let app = this
            let haveError = false
            let msg = ''
            let i = this.countPayment.length - 1
            if (this.countPayment[i].payMent == '') {
                haveError = true
                msg = "Please select payment type."
            }
            if (this.countPayment[i].down == 0) {
                haveError = true
                msg += "\nPlease enter the amount of down payment."
            }
            if (this.countPayment[i].date == '') {
                haveError = true
                msg += "\nPlease enter date."
            }
            if (haveError) {
                alert(msg)
            }
            else {
                this.countPayment.forEach(rec => {
                    delete rec.menuPayDateInv
                })
                this.countPayment.slice(i).forEach(rec => {
                    this.lastPayMent = rec.payMent
                    this.lastDown = rec.down
                    this.lastDate = rec.date
                })
                let batch = db.batch()
                batch.set(db.collection('cashReceiBook').doc(), {
                    date: app.lastDate + " " + app.subTime,
                    type: 'INV-',
                    refNo: app.invNo,
                    custCode: app.code,
                    desc: 'Invoice payment',
                    Amt: app.lastDown + app.disc,
                    disc: app.disc,
                    payMent: app.lastPayMent,
                    rvNo: '',
                })
                batch.update(db.collection('invoice').doc(app.invId), {
                    countPayment: app.countPayment,
                    balance: app.balance - app.lastDown,
                    payMentStatus: 'Paid'
                })
                batch.update(db.collection("order").doc(app.idOrder), {
                    balance: app.balanceOrder - app.lastDown
                })
                batch.commit().then(() => {
                    app.clearInv()
                    alert("Successful.")
                })
                    .catch(function (error) {
                        console.log(error)
                        alert("Failed.")
                    })
            }
        },

        // Clear webpage
        clearInv() {
            this.invNo = ''
            this.invDate = new Date().toISOString()
            this.code = ''
            this.name = ''
            this.address = ''
            this.poRef = ''
            this.contact = ''
            this.tel = ''
            this.Detail = []
            this.net = ''
            this.disc = ''
            this.countPayment = []
            this.showDetails = false
            this.searchInv = ''
        }
    },
    computed: {

    
        // sumTotal() {
        //     return this.detail.reduce((total, item) => total + (item.num * item.PriceMM), 0)
        // },

        
        // sumBalance() {
        //     return this.balance - this.amtRecei
        // }
    },
    async mounted() {
        let app = this
        // Pull the invoice information to show if there is no payment
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "invoice"), where("status", "==", "Open"), where ("balance", ">", 0));
            docRef.forEach(() => {
                app.itemInv = []
                docRef.forEach(doc => {
                    let invDoc = doc.data().invNo
                    let nameDoc = doc.data().name
                    app.itemInv.push(invDoc + " " + ":" + " " + nameDoc)
                })
                app.itemInv.sort()
            })
    }
}
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    padding: 0.5%;
}

.padDing {
    padding: 0.5%;
}

.thAmount {
    width: 130px;
}

.tdAmount {
    text-align: right;
    width: 100%;
}

.tdPrice {
    text-align: right;
    width: 100%;
}

.total {
    text-decoration: underline;
}

.sum {
    text-align: right;
    width: 100%;
}

.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
}

.lineWhite {
    border-bottom: 1px solid white;
    text-align: right;
    width: 100%;
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.txtCenter {
    text-align: center;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

.mycurrency {
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    background-color: red;
}

.compact-form {
    transform: scale(0.8);
    transform-origin: left;
}

.compact {
    transform: scale(0.9);
    background-color: #E8EAF6;
}

.inputCust {
    height: 30px;
    padding: 13px 10px;
    display: inline-block;
    border-bottom: 1px solid black;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}
</style>