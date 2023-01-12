<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Order Payment</h1>
                    <hr>
                    <!-- Search order -->
                    <v-layout justify-center>
                        <v-flex xs2 d-flex justify-end my-4>
                            <h3>Select order no:</h3>
                        </v-flex>
                        <v-flex xs3 pa-1 px-2>
                            <v-select :items="itemOrder" v-model="searchOrder"></v-select>
                        </v-flex>
                        <v-flex xs2 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="searchOrderNo()">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <hr>
                    <br>
                    <div v-if="showDetails">

                        <!-- Edit down payment -->
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
                                        <v-menu v-model="item.menuPayDateOrder" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y
                                            min-width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="item.date" color="white" label="Date:"
                                                    prepend-icon="event" readonly v-on="on" dark
                                                    :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="item.date" @input="item.menuPayDateOrder = false"
                                                :disabled="item.payMent != '' && item.down != 0 && item.date.length == 10"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </div>
                        <br>
                        <hr>
                        <div>
                            <form>
                                <v-layout>
                                <v-flex xs12 d-flex justify-end pa-2 my-4>
                                    <h3>Order no:</h3>
                                </v-flex>
                                    <v-flex xs1 pa-1 pl-2 text-xs-right>
                                        <v-text-field v-model="orderNo" readonly></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <!-- Order Form     -->
                                <!-- Date selector -->
                                <v-layout>
                                    <v-flex offset-xs10>
                                        <v-menu v-model="menuorderDate" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y
                                            min-width="290px" readonly>
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="orderDate" label="Date:" prepend-icon="mdi-calendar"
                                                    readonly></v-text-field>
                                            </template>
                                            <v-date-picker v-model="orderDate" @input="menuorderDate = false"
                                                :min="nowDate" readonly></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>

                                <!-- customer info -->
                                <v-container>
                                    <v-layout>
                                        <v-flex xs2 text-xs-right my-1>Customer code:</v-flex>
                                        <v-flex xs6>
                                            <input type="text" class="inputCust" size="35" v-model="code" disabled>
                                        </v-flex>
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

                                <!-- Order Detail -->
                                <v-layout v-for="(item, i) in orderDetails" :key="i" collapse>
                                    <v-flex my-3 pa-2 padDing class="txtCenter">
                                        <font size=3>{{ i+ 1}}</font>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.Code" ref="focusCode" readonly tabindex="-1"
                                            @keypress.enter="addDetail"></v-text-field>
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
                                            <vue-numeric separator="," :precision="2" v-model="item.PriceMM" disabled
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 my-3 pr-2 pa-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" disabled v-model="item.amt"
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 center my-2>
                                    </v-flex>
                                </v-layout>
                                <hr>
                                <br>
                                <v-layout>

                                    <!-- Shipping info -->
                                    <v-flex xs5>
                                        <v-flex>
                                            <v-layout>
                                                <v-flex xs8>
                                                    <!-- <v-text-field v-model="shipAdd" label="Shipping Address:" readonly></v-text-field> -->
                                                    <v-textarea outline auto-grow rows="1" v-model="shipAdd"
                                                        label="Shipping Address:" readonly></v-textarea>
                                                </v-flex>
                                                <v-flex xs5>
                                                    <v-menu v-model="menushipDate" :close-on-content-click="false"
                                                        :nudge-right="40" transition="scale-transition" offset-y
                                                         min-width="290px" readonly>
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-model="shipDate" label="Date:"
                                                                prepend-icon="mdi-calendar" readonly></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="shipDate" @input="menushipDate = false"
                                                            :min="nowDate" readonly></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-textarea outline auto-grow rows="1" v-model="remark"
                                                        label="Remarks:" readonly></v-textarea>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-flex>

                                    <!-- Summary information -->
                                    <v-flex xs8>
                                        <v-layout>
                                            <v-flex xs4 offset-xs2 class="sum">
                                                <font size=3>Total:</font>
                                            </v-flex>
                                            <v-flex xs3 class="sum">
                                                <font size=3>
                                                    <!-- <vue-numeric separator="," :precision="2" disabled :value="sumTotal"
                                                        class="line"></vue-numeric> -->
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs4 offset-xs2 class="sum">
                                                <font size=3>Discount:</font>
                                            </v-flex>
                                            <v-flex xs3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled :value="disc"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs4 offset-xs2 class="sum">
                                                <font size=3>Net amount:</font>
                                            </v-flex>
                                            <v-flex xs3 class="sum">
                                                <font size=3>
                                                    <!-- <vue-numeric separator="," :precision="2" disabled :value="sumNet"
                                                        class="line"></vue-numeric> -->
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </form>
                            <hr>

                            <br><br>

                            <!-- save and cancel button -->
                            <v-layout align-center column>
                                <v-flex>
                                    <v-btn @click="addPayment()" :disabled="this.balance == 0" class="mr-2">
                                        <v-icon dark>mdi-content-save</v-icon>
                                        Save
                                    </v-btn>
                                    <v-btn @click="clearOrder()" class="ml-2">
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

import { collection, getDocs, where, getFirestore, orderBy, doc, QuerySnapshot } from "firebase/firestore";
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        VueNumeric,
        mainMenu
    },
    data() {
        return {
            // subTime: new Date().toTimeString().substr(0, 8),
            subTime: new Date().toTimeString(),
            orderId: '',
            menuorderDate: false,
            menushipDate: false,
            modal: false,
            nowDate: new Date().toISOString().slice(0, 10),
            year: 0,

            searchOrder: '',
            itemOrder: [],
            showSO: false,
            itemPayMent: [],
            orderNo: '',
            orderDate: '',

            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',

            showDetails: false,

            orderDetails: [],
            countPayment: [],

            shipAdd: '',
            // shipDate: new Date().toISOString().substr(0, 10),
            shipDate: new Date().toISOString(),
            payMent: '',
            remark: '',

            disc: 0,

            downAmt: 0,
            menuPayDateOrder: false,

            order: [],
            lastPayMent: '',
            lastDown: 0,
            lastDate: '',
            downBalance: 0,
            balance: 0,
        }
    },
    methods: {

        // Search info from orderNo in order database
        async searchOrderNo() {
            this.countPayment = []
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", this.searchOrder));
            docRef.forEach(docs=> {
                if (docs.empty) {
                    alert("Order No is not correct...\nPlease Try again")
                    // this.$refs.orderNo.focus()
                } else {
                    this.showDetails = true
                    let doc = docs.data()
                    // let docId = querySnapshot.docs[0].id
                    // this.orderId = docId     
                    this.orderNo = doc.orderNo
                    // this.orderDate = doc.orderDate.substr(0, 10)
                    this.orderDate = doc.orderDate
                    this.code = doc.code
                    this.name = doc.name
                    this.address = doc.address
                    this.poRef = doc.poRef
                    this.contact = doc.contact
                    this.tel = doc.tel
                    this.orderDetails = doc.detail
                    this.shipAdd = doc.shipAdd
                    this.shipDate = doc.shipDate
                    this.countPayment = doc.countPayment
                    this.payMent = doc.payMent
                    this.remark = doc.remark
                    this.disc = doc.disc
                    this.downBalance = doc.downBalance
                    this.balance = doc.balance
                    // this.countPayment.push({ payMent: '', down: 0, date: '' })
                }
            })
             const docRe = await getDocs(collection(db, "chartAccount"), where("cash", "==", "Y"));
             docRe.forEach(() => {
                this.itemPayMent = []
                docRef.forEach(doc => {
                    let readDoc = doc.data().accName
                    this.itemPayMent.push(readDoc)
                })
            })
        },

        // Add payment to database
        addPayment() {
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
                let i = app.countPayment.length - 1
                app.countPayment.forEach(rec => {
                    delete rec.menuPayDateOrder
                })
                app.countPayment.slice(i).forEach(rec => {
                    app.lastPayMent = rec.payMent
                    app.lastDown = rec.down
                    app.lastDate = rec.date
                })
                const db = getFirestore()
                let batch = db.batch()
                batch.set(db.collection('cashReceiBook').doc(), {
                    date: app.lastDate + " " + app.subTime,
                    type: 'SO-',
                    refNo: app.orderNo,
                    custCode: app.code,
                    desc: 'Down payment',
                    Amt: app.lastDown + app.disc,
                    disc: app.disc,
                    payMent: app.lastPayMent,
                    rvNo: '',
                })
                batch.update(db.collection('order').doc(app.orderId), {
                    balance: app.balance - app.lastDown,
                    countPayment: app.countPayment,
                    downBalance: app.downBalance + app.lastDown
                })
                batch.commit().then(() => {
                    app.checkProdInOrder()
                    app.clearOrder()
                    alert("Successful.")
                })
                    .catch(error => {
                        console.log(error)
                        alert("Failed.\nPlease contact the system administrator : addPayment() has error")
                    })
            }
        },

        // Check the product. If completed, the order will change status to Closed
       async checkProdInOrder() {
            // let app = this
            const db = getFirestore()
           const docRef = await getDocs(collection(db, "order").doc(this.orderId));
                docRef.forEach(checkOrder => {
                    let doc = checkOrder.data()
                    let newOrderDetail = doc.detail
                    let detialCheck = []
                    newOrderDetail.forEach(item => {
                        if (item.numSend < item.num) {
                            item.num = item.num - item.numSend
                            detialCheck.push(item)
                        }
                    })
                    detialCheck.forEach(product => {
                        product.maxNum = product.num
                    })
                    if (detialCheck.length == 0) {
                        db.collection("order").doc(this.orderId).update({
                            status: "Closed"
                        })
                    }
                })
        },

        // Clear web page
        clearOrder() {
            this.orderNo = ''
            this.orderDate = ''
            this.shipDate = ''
            this.shipAdd = ''
            this.customer = ''
            this.orderDetails = []
            this.payMent = []
            this.remark = ''
            this.balance = 0
            this.countPayment = []
            this.downAmt = 0
            this.searchOrder = ''
            this.showDetails = false
        },
    },
    computed: {

        // Calculate total
        // sumTotal() {
        //     return this.orderDetails.reduce((total, item) => total + (item.num * item.PriceMM), 0)
        // },

        // sumNet() {
        //     return this.sumTotal - this.disc
        // },

        // Calculate balance
        // balance(){
        //     return this.sumNet - this.downAmt
        // }
    },
    async mounted() {
        let app = this
        // db.collection("order").where("down", "==", 0).get()
        // .then(querySnapshot =>{
        //     app.itemOrder = []
        //     querySnapshot.forEach(doc =>{
        //         let orderDoc = doc.data().orderNo
        //         let nameDoc = doc.data().name
        //         app.itemOrder.push(orderDoc + " " + ":" + " " + nameDoc)
        //     })
        // })

        // Show order info in the select order no box
        const db = getFirestore() 
        const docRef = await getDocs(collection(db, "order"), where("status", "==", "Open"));
            docRef.forEach(() => {
                app.itemOrder = []
                docRef.forEach(doc => {
                    let orderDoc = doc.data().orderNo
                    let nameDoc = doc.data().name
                    app.itemOrder.push(orderDoc + " " + ":" + " " + nameDoc)
                })
                app.itemOrder.sort()
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
    /* text-align: left; */
    padding: 0.5%;
    /* padding: 10px; */
}

.padDing {
    padding: 0.5%;
}

.thProCode {
    width: 150px;
}

.thFrame {
    width: 60px;
}

.thFront {
    width: 60px;
}

.thButton {
    width: 150px;
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

.txtPercent {
    text-align: center;
    color: red;
    width: 20%;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

.mycurrency {
    /* width: 100%; */
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    background-color: red;
}

/* .myinput {
    font-size: 8pt;
    height: 20px;
} */

.compact-form {
    transform: scale(0.8);
    transform-origin: left;
}

.compact {
    transform: scale(0.9);
    background-color: #E8EAF6;
}

/* input[type=text]{
  width: 60%;
  padding: 13px 10px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
} */
.inputCust {
    /* width: 30%; */
    height: 30px;
    padding: 13px 10px;
    display: inline-block;
    /* border: 1px solid #ccc; */
    /* border-radius: 4px; */
    /* box-sizing: border-box; */
    border-bottom: 1px solid black;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}

.my-input input {
    text-transform: uppercase;
}
</style>