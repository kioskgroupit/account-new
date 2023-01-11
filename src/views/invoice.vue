<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Invoice/Receipt</h1>
                    <!-- <v-btn @click="checkProdInOrder"></v-btn> -->
                    <hr>
                    <div>

                        <v-layout justify-center>
                            <v-flex xs2 d-flex justify-end my-4>
                                <h3>Select order no:</h3>
                            </v-flex>
                            <v-flex xs4 pa-1 px-2>
                                <v-select :items="itemOrder" v-model="searchInv"></v-select>
                            </v-flex>
                            <v-flex xs2 my-2>
                                <v-btn fab small color="indigo lighten-1" dark @click="searchInvoice()">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <hr>

                        <div v-if="showDetails">

                            <!-- Select invType and invNo -->
                            <v-layout>
                                <v-flex xs12 d-flex justify-end pa-2 my-4>
                                    <h3>Inv no:</h3>
                                </v-flex>
                                <!-- <v-flex xs12 text-xs-right my-4>
                                    <h3>Inv no:</h3>
                                </v-flex> -->
                                <v-flex xs1 pa-1 pl-2 text-xs-right>
                                    <v-select :items="itemInvType" v-model="invType" @change="changeInvNo()"
                                        item-text="name" item-value="id"></v-select>
                                </v-flex>
                                <v-flex xs1 pa-1>
                                    <v-text-field v-model="invNo"></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- Invoice Form     -->
                            <!-- Date selector -->
                            <v-layout>
                                <v-flex offset-xs10>
                                    <v-menu v-model="onMenuInvDate" :close-on-content-click="false" :nudge-right="40"
                                     transition="scale-transition" offset-y min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="invDate" label="Date:" prepend-icon="mdi-calendar" readonly
                                                v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="invDate" @input="onMenuInvDate = false"></v-date-picker>
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
                                        <input type="text" class="inputCust" autocomplete="off" v-model="tel" disabled>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <hr>

                            <!-- Header order detail -->
                            <v-layout pt-2 pb-2 indigo lighten-4>
                                <v-flex pl-1 text-xs-center>
                                    <h4>No</h4>
                                </v-flex>
                                <v-flex xs1 text-xs-center pl-3>
                                    <h4>Model</h4>
                                </v-flex>
                                <v-flex xs3 text-xs-center pl-3>
                                    <h4>Description</h4>
                                </v-flex>
                                <v-flex xs1 text-xs-center pl-3>
                                    <h4>Frame</h4>
                                </v-flex>
                                <v-flex xs1 text-xs-center pl-3>
                                    <h4>Front</h4>
                                </v-flex>
                                <v-flex xs1 text-xs-center pl-3>
                                    <h4>Quantity</h4>
                                </v-flex>
                                <v-flex xs2 text-xs-right pr-2>
                                    <h4>Price</h4>
                                </v-flex>
                                <v-flex xs2 text-xs-right pr-2>
                                    <h4>Amount</h4>
                                </v-flex>
                                <v-flex xs2 text-xs-center></v-flex>
                            </v-layout>
                            <hr>

                            <!-- Order Detail -->
                            <v-layout v-for="(item, i) in detail" :key="i" collapse>
                                <v-flex my-3 pa-2 padDing class="txtCenter">
                                    <font size=3>{{ i+ 1}}</font>
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
                                    <v-text-field v-model="item.num" reverse type="number" :min="1" :max="item.maxNum"
                                        @blur="inputNum()" ref="num"></v-text-field>
                                </v-flex>
                                <v-flex xs2 my-3 pa-2 ml-1 padDing>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" v-model="item.PriceMM" class="line"
                                            disabled></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs2 my-3 pa-2 ml-1 padDing>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" disabled
                                            :value="item.num * item.PriceMM" class="line"></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs2 center my-2>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn fab small color="error" @click="delDetail(item)" tabindex="-1"
                                                v-on="on"><v-icon dark>mdi-minus</v-icon></v-btn>
                                        </template>
                                        <span>Delete products</span>
                                    </v-tooltip>
                                </v-flex>
                            </v-layout>
                            <hr>
                            <br>

                            <!-- Summary information -->
                            <v-layout>
                                <v-flex xs5>
                                    <v-layout>
                                        <v-flex xs12>
                                            <v-textarea outline auto-grow rows="1" v-model="shipAdd"
                                                label="Shipping Address:" readonly></v-textarea>
                                        </v-flex>
                                        <!-- <v-flex xs4>
                                            <v-textarea outline auto-grow rows="1" v-model="district" label="Districts:" readonly></v-textarea>
                                        </v-flex> -->
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5>
                                            <v-menu v-model="menushipDate" :close-on-content-click="false"
                                                :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="290px" disabled>
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="shipDate" label="Shipping Date:"
                                                        prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="shipDate"
                                                    @input="menushipDate = false"></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs12>
                                            <v-textarea outline auto-grow rows="1" v-model="remark"
                                                label="Remarks:"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Total:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3>
                                                <vue-numeric separator="," :precision="2" disabled :value="sumTotal"
                                                    class="line"></vue-numeric>
                                            </font>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Discount:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3>
                                                <vue-numeric separator="," :precision="2" v-model="disc"
                                                    class="line"></vue-numeric>
                                            </font>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Net amount:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3>
                                                <vue-numeric separator="," :precision="2" disabled :value="net"
                                                    class="line"></vue-numeric>
                                            </font>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Down amount:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3>
                                                <vue-numeric separator="," :precision="2" v-model="downAmt" :max="down"
                                                    class="line"></vue-numeric>
                                            </font>
                                            <!-- <vue-numeric separator="," :precision="2" disabled :value="downAmt" class="line"></vue-numeric></font> -->
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Balance amount to be paid:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3 color=red>
                                                <vue-numeric separator="," :precision="2" disabled :value="balanceAmt"
                                                    class="line"></vue-numeric>
                                            </font>
                                            <!-- <vue-numeric separator="," :precision="2" disabled :value="checkBalance" class="line"></vue-numeric></font> -->
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <br>

                            <!-- Down payment -->
                            <div v-if="checkBalance">
                                <hr>
                                <v-layout>
                                    <v-flex xs3>
                                        <v-select :items="itemPayMent" v-model="payMent" label="Payment:"
                                            ref="payMent"></v-select>
                                    </v-flex>
                                    <v-flex xs2 text-xs-right py-4>
                                        <h3>Amount received:</h3>
                                    </v-flex>
                                    <v-flex xs3 pa-1 pt-4>
                                        <font size=3><vue-numeric separator="," :precision="2" v-model="amtRecei"
                                                :max="balanceAmt" class="line"></vue-numeric></font>
                                    </v-flex>
                                    <v-flex xs2 px-2>
                                        <v-menu v-model="menuPayDateInv" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y
                                            min-width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="payDateInv" label="Date:" prepend-icon="event"
                                                    v-on="on"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="payDateInv"
                                                @input="menuPayDateInv = false"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>
                            </div>
                            <hr>
                            <br><br>

                            <!-- Save and cancel button -->
                            <v-layout align-center column>
                                <v-flex>
                                    <v-btn class="mr-2" @click="addInv()">
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
import { collection, getDocs, where, getFirestore, setDoc, runTransaction, query, orderBy, doc, addDoc } from "firebase/firestore";
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        VueNumeric,
        mainMenu
    },

    data() {
        return {
            // month: new Date().toISOString().substr(5,2)*1,
            showAmtRecei: false,
            subTime: new Date().toTimeString().substr(0, 8),
            disNumSend: false,
            orderId: '',
            modal: false,
            searchInv: '',
            nowDate: new Date().toISOString().slice(0, 10),
            showDetails: false,
            itemOrder: [],

            invType: '',
            invNo: '',
            invDate: new Date().toISOString().substr(0, 10),

            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',

            detail: [],

            disc: 0,
            down: 0,
            downAmt: 0,
            balance: 0,

            shipAdd: '',
            shipDate: new Date().toISOString().substr(0, 10),
            remark: '',
            menushipDate: false,

            itemPayMent: [],
            payMent: '',
            amtRecei: 0,
            payDateInv: new Date().toISOString().substr(0, 10),

            itemInvType: [
                { id: 'invN', name: 'N' },
                { id: 'invV', name: 'V' }
            ],
            onMenuInvDate: false,
            menuPayDateOrder: false,
            menuPayDateInv: false,
            accId: '',
            glNo: '',
        }
    },
    methods: {
        async accBalancePlus() {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "invoice"));
                docRef.forEach(() => {
                    let arr = []
                    docRef.forEach(doc => {
                        arr.push({ prodList: doc.data().detail })
                    })
                    console.log(arr)
                })
            // let detail = []
            // let year = new Date().toISOString().substr(0,4)
            // let month = new Date(this.date).toISOString().substr(5,2) * 1
            // let docAcc = db.collection("custReport").doc(year)
            // return db.runTransaction((transaction)=> {
            //     return transaction.get(docAcc).then((Doc)=> {
            //         if (!Doc.exists) {
            //             throw "Document does not exist!"
            //         }
            //         else{
            //             detail.forEach(rec=>{
            //                 let docAccId = Doc.data()[rec.accId]
            //                 for(let i = month;i <= 12;i++){
            //                     docAccId[(i<10? '0':'') + i] += rec.debit
            //                     docAccId[(i<10? '0':'') + i] -= rec.credit
            //                     transaction.update(docAcc, {
            //                         [rec.accId]: docAccId
            //                     })
            //                 }
            //                 docAccId["debit"] += rec.debit
            //                 docAccId["credit"] += rec.credit
            //                 transaction.update(docAcc, {
            //                     [rec.accId]: docAccId
            //                 })
            //             })
            //         }
            //     })
            // })
            // .then(()=>{
            //     console.log("Success.",app.glNo)
            //     app.cancelGl()
            // })
        },


        // Check balances that are 0 in the month
        async balanceCheck() {
            // let year = '2018'
            let year = new Date().toISOString().substr(0, 4)
            let balanceMonth = new Date().toISOString().substr(5, 2) * 1
            let balanceLastMonth = new Date().toISOString().substr(5, 2) * 1 - 1
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "accBalance"), doc(year));
                docRef.forEach(doc => {
                    let accRecei = doc.data()["112001"]
                    let DepRecei = doc.data()["214101"]
                    let saleV = doc.data()["410001"]
                    let saleN = doc.data()["410002"]

                    if (accRecei[(balanceMonth < 10 ? '0' : '') + balanceMonth] == 0) {
                        accRecei[(balanceMonth < 10 ? '0' : '') + balanceMonth] = accRecei[(balanceLastMonth < 10 ? '0' : '') + balanceLastMonth]
                        addDoc(collection(db, "accBalance"),doc(year),{
                            ["112001"]: accRecei
                        })
                    }

                    if (DepRecei[(balanceMonth < 10 ? '0' : '') + balanceMonth] == 0) {
                        DepRecei[(balanceMonth < 10 ? '0' : '') + balanceMonth] = DepRecei[(balanceLastMonth < 10 ? '0' : '') + balanceLastMonth]
                        addDoc(collection(db, "accBalance"),doc(year),{
                            ["214101"]: DepRecei
                        })
                    }

                    if (saleV[(balanceMonth < 10 ? '0' : '') + balanceMonth] == 0) {
                        saleV[(balanceMonth < 10 ? '0' : '') + balanceMonth] = saleV[(balanceLastMonth < 10 ? '0' : '') + balanceLastMonth]
                        addDoc(collection(db, "accBalance"),doc(year),{
                            ["410001"]: saleV
                        })
                    }

                    if (saleN[(balanceMonth < 10 ? '0' : '') + balanceMonth] == 0) {
                        saleN[(balanceMonth < 10 ? '0' : '') + balanceMonth] = saleN[(balanceLastMonth < 10 ? '0' : '') + balanceLastMonth]
                        addDoc(collection(db, "accBalance"),doc(year),{
                            ["410002"]: saleN
                        })
                    }
                })
        },

       async addGl() {
            let app = this
            let noInv = this.invType.substr(3) + this.invNo
            let year = new Date().toISOString().substr(0, 4)
            const db = getFirestore()
           const DocRef = await getDocs(collection(db, "counter"), year);
            return runTransaction((transaction) => {
                return transaction.get(DocRef).then((Doc) => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }

                    let newGlNo = Doc.data().in + 1
                    transaction.update(DocRef, {
                        ["in"]: newGlNo
                    })
                })
            })
                .then(() => {
                    if (app.balanceAmt > 0) {
                        addDoc(collection(db, "generalLedger"),{
                            custCode: app.code,
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Sales',
                            accId: '112001',
                            accName: 'Accounts Receivable',
                            debit: app.balanceAmt,
                            credit: 0,
                            remark: '',
                        })
                    }
                    if (app.downAmt > 0) {
                        addDoc(collection(db, "generalLedger"),{
                            custCode: app.code,
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Sales',
                            accId: '214101',
                            accName: 'Deposit received',
                            debit: app.downAmt,
                            credit: 0,
                            remark: '',
                        })
                    }
                    if (app.invType.substr(3) == 'V') {
                        addDoc(collection(db, "generalLedger"),{
                            custCode: app.code,
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '410001',
                            accName: 'Sales-v',
                            debit: 0,
                            credit: app.net,
                            remark: '',
                        })
                    }
                    if (app.invType.substr(3) == 'N') {
                        addDoc(collection(db, "generalLedger"),{
                            custCode: app.code,
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '410002',
                            accName: 'Sales-n',
                            debit: 0,
                            credit: app.net,
                            remark: '',
                        })
                    }
                })
                .then(() => {
                    app.checkProdInOrder()
                })
        },

        // Add balance and new general Ledger
       async addAccBalance() {
            let app = this
            let noInv = this.invType.substr(3) + this.invNo
            // let year = "2018"
            let year = new Date().toISOString().substr(0, 4)
            let month = new Date(this.invDate).toISOString().substr(5, 2) * 1
            const db = getFirestore()
            const DocRef = await getDocs(collection(db, "counter"), year);
            return runTransaction((transaction) => {
                return transaction.get(DocRef).then((Doc) => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }

                    let newGlNo = Doc.data().in + 1
                    transaction.update(DocRef, {
                        ["in"]: newGlNo
                    })
                })
            })
                .then(() => {
                    let docAcc = getDocs(collection(db, "accBalance"), year);
                    return runTransaction((transaction) => {
                        return transaction.get(docAcc).then(Doc => {
                            if (!Doc.exists) {
                                throw "Document does not exist!"
                            }
                            else {
                                if (app.balanceAmt > 0) {
                                    let docAccId = Doc.data()["112001"]
                                    for (let i = month; i <= 12; i++) {
                                        docAccId[(i < 10 ? '0' : '') + i] += app.balanceAmt
                                        transaction.update(docAcc, {
                                            ["112001"]: docAccId
                                        })
                                    }
                                    docAccId["debit"] += app.balanceAmt
                                    transaction.update(docAcc, {
                                        ["112001"]: docAccId
                                    })
                                    addDoc(collection(db, "generalLedger"),{
                                        custCode: app.code,
                                        glNo: app.glNo,
                                        glDate: app.invDate,
                                        refNo: noInv,
                                        desc: 'Invoice payment',
                                        accId: '112001',
                                        accName: 'Accounts Receivable',
                                        debit: app.balanceAmt,
                                        credit: 0,
                                        remark: '',
                                    })
                                }
                                if (app.downAmt > 0) {
                                    let docAccId = Doc.data()["214101"]
                                    for (let i = month; i <= 12; i++) {
                                        docAccId[(i < 10 ? '0' : '') + i] += app.downAmt
                                        transaction.update(docAcc, {
                                            ["214101"]: docAccId
                                        })
                                    }
                                    docAccId["debit"] += app.downAmt
                                    transaction.update(docAcc, {
                                        ["214101"]: docAccId
                                    })
                                    addDoc(collection(db, "generalLedger"),{
                                        custCode: app.code,
                                        glNo: app.glNo,
                                        glDate: app.invDate,
                                        refNo: noInv,
                                        desc: 'Invoice payment',
                                        accId: '214101',
                                        accName: 'Deposit received',
                                        debit: app.downAmt,
                                        credit: 0,
                                        remark: '',
                                    })
                                }
                                if (app.invType.substr(3) == 'V') {
                                    let docAccId = Doc.data()["410001"]
                                    for (let i = month; i <= 12; i++) {
                                        docAccId[(i < 10 ? '0' : '') + i] -= app.net
                                        transaction.update(docAcc, {
                                            ["410001"]: docAccId
                                        })
                                    }
                                    docAccId["credit"] += app.net
                                    transaction.update(docAcc, {
                                        ["410001"]: docAccId
                                    })
                                    addDoc(collection(db, "generalLedger"),{
                                        custCode: app.code,
                                        glNo: app.glNo,
                                        glDate: app.invDate,
                                        refNo: noInv,
                                        desc: 'Invoice payment',
                                        accId: '410001',
                                        accName: 'Sales-v',
                                        debit: 0,
                                        credit: app.net,
                                        remark: '',
                                    })
                                }
                                if (app.invType.substr(3) == 'N') {
                                    let docAccId = Doc.data()["410002"]
                                    for (let i = month; i <= 12; i++) {
                                        docAccId[(i < 10 ? '0' : '') + i] -= app.net
                                        transaction.update(docAcc, {
                                            ["410002"]: docAccId
                                        })
                                    }
                                    docAccId["credit"] += app.net
                                    transaction.update(docAcc, {
                                        ["410002"]: docAccId
                                    })
                                    addDoc(collection(db, "generalLedger"),{
                                        custCode: app.code,
                                        glNo: app.glNo,
                                        glDate: app.invDate,
                                        refNo: noInv,
                                        desc: 'Invoice payment',
                                        accId: '410002',
                                        accName: 'Sales-n',
                                        debit: 0,
                                        credit: app.net,
                                        remark: '',
                                    })
                                }
                            }
                        })
                    })
                        .then(() => {
                            app.clearInv()
                        })
                })
        },

        // Search order from database
         async searchInvoice() {
            this.countPayment = []
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", this.searchInv.substr(0, 7)));
            docRef.forEach(docs => {
                if (docs.empty) {
                    alert("Invoice no is not correct...\nPlease Try again")
                    this.$refs.invoiceNo.focus()
                } else {
                    this.detail = []
                    this.disc = 0
                    this.showDetails = true
                    let doc = docs.data()
                    let docId = docs.id
                    this.orderId = docId
                    this.code = doc.code
                    this.name = doc.name
                    this.address = doc.address
                    this.poRef = doc.poRef
                    this.contact = doc.contact
                    this.tel = doc.tel
                    let newOrderDetail = doc.detail
                    this.detail = doc.detail
                    // this.orderNet = doc.netBalance
                    this.balance = doc.balance
                    this.downAmt = doc.downBalance
                    this.down = doc.downBalance
                    this.shipAdd = doc.shipAdd
                    this.shipDate = doc.shipDate
                    this.remark = doc.remark

                    newOrderDetail.forEach(item => {
                        if (item.numSend < item.num) {
                            item.num = item.num - item.numSend
                            this.detail.push(item)
                        }
                    })
                    this.detail.forEach(product => {
                        product.maxNum = product.num
                    })
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

        // Search order from database
        // async searchInvoice() {
        //     const db = getFirestore()
        //     const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", this.searchInv.substr(0, 7)));
        //     docRef.forEach(docs => {
        //         if (docs.empty) {
        //             alert("Invoice no is not correct...\nPlease Try again")
        //             this.$refs.invoiceNo.focus()
        //         }
        //         else {
        //             this.detail = []
        //             this.disc = 0
        //             this.showDetails = true
        //             let doc = docs.data()
        //             let docId = docs.id
        //             this.orderId = docId
        //             this.code = doc.code
        //             this.name = doc.name
        //             this.address = doc.address
        //             this.poRef = doc.poRef
        //             this.contact = doc.contact
        //             this.tel = doc.tel
        //             let newOrderDetail = doc.detail
        //             // this.orderNet = doc.netBalance
        //             this.balance = doc.balance
        //             this.downAmt = doc.downBalance
        //             this.down = doc.downBalance
        //             this.shipAdd = doc.shipAdd
        //             this.shipDate = doc.shipDate
        //             this.remark = doc.remark

        //             newOrderDetail.forEach(item => {
        //                 if (item.numSend < item.num) {
        //                     item.num = item.num - item.numSend
        //                     this.detail.push(item)
        //                 }
        //             })
        //             this.detail.forEach(product => {
        //                 product.maxNum = product.num
        //             })
        //             const docRef = await getDocs(collection(db, "chartAccount"), where("cash", "==", "Y"));
        //                     docRef.forEach(() => {
        //                         this.itemPayMent = []
        //                         docRef.forEach(doc => {
        //                             let readDoc = doc.data().accName
        //                             this.itemPayMent.push(readDoc)
        //                         })
        //                     })
        //             }
        //     })
        // },

        // Delete the selected product
        delDetail(item) {
            if (this.detail.length > 1) {
                this.detail.splice(this.detail.findIndex(detail => detail == item), 1)
                this.disc = 0
            }
            else {
                this.detail.splice(this.detail.findIndex(detail => detail == item), 1)
                this.showDetails = false
                this.searchInv = ''
            }
        },

        // Add Invoice and update order to database
        async addInv() {
            let app = this
            let countPayment = []
            let haveError = false
            let msg = ''
            if (app.invType == "") {
                haveError = true
                msg = "Please input Inv no."
            }
            if (app.searchInv == '') {
                haveError = true
                msg += "\nPlease Search order."
            }
            if (app.detail.length == 0) {
                haveError = true
                msg += "\nNo product list \nPlease refresh the page again."
            }
            if (app.balanceAmt < 0) {
                haveError = true
                msg += "\nNegative balance\nPlease enter the amount of down payment equal to net amount."
            }
            if (haveError) {
                alert(msg)
            }
            else {
                // let year = "2018"
                let year = new Date().toISOString().substr(0, 4)
                const db = getFirestore()
                let DocRef = getDocs(collection(db, "counter"), year);
                const docRef = await getDocs(collection(db, "invoice"), where("invNo", "==", app.invType.substr(3) + app.invNo));
                    docRef.forEach(() => {
                        app.checkInv = []
                        docRef.forEach(doc => {
                            // console.log(doc.data())
                            let curDoc = doc.data().invNo
                            app.checkInv.push(curDoc)
                        })
                        if (app.checkInv.length < 1) {
                            alert("This invoice no is already in the system.\nPlease try again.")
                            app.changeInvNo()
                        }
                        else {
                            runTransaction(transaction => {
                                return transaction.get(DocRef).then(doc => {
                                    if (!doc.exists) {
                                        throw "Document does not exist!"
                                    }
                                    else {
                                        let newInvNo = doc.data()[app.invType] + 1
                                        transaction.update(DocRef, {
                                            [app.invType]: newInvNo
                                        })
                                    }
                                })
                            })
                                .then(() => {
                                    let DocOrder = getDocs(collection(db, "order"), app.orderId);
                                    runTransaction(function (transaction) {
                                        return transaction.get(DocOrder).then(function (Doc) {
                                            if (!Doc.exists) {
                                                throw "Document does not exist!"
                                            }
                                            let newOrderDetail = Doc.data().detail
                                            app.detail.forEach(rec => {
                                                let newPos = newOrderDetail.findIndex(detail => detail.Code == rec.Code && detail.frame == rec.frame &&
                                                    detail.front == rec.front)
                                                newOrderDetail[newPos].numSend = rec.num + rec.numSend
                                            })
                                            transaction.update(DocOrder, {
                                                detail: newOrderDetail
                                            })
                                        })
                                    })
                                        .then(() => {
                                            app.detail.forEach(prod => {
                                                delete prod.maxNum
                                                prod.numSend = 0
                                            })
                                            let batch = db.batch()
                                            if (app.balanceAmt != 0 && app.amtRecei != 0 && app.payMent != '') {
                                                countPayment.push({ payMent: app.payMent, down: app.amtRecei, date: app.payDateInv })
                                                batch.set(collection(db, 'cashReceiBook').doc(), {
                                                    date: app.payDateInv + " " + app.subTime,
                                                    type: 'INV-',
                                                    refNo: app.invType.substr(3) + app.invNo,
                                                    custCode: app.code,
                                                    desc: 'Invoice payment',
                                                    Amt: app.amtRecei + app.disc,
                                                    disc: app.disc,
                                                    payMent: app.payMent,
                                                    rvNo: ''
                                                })

                                                batch.set(collection(db, 'invoice').doc(), {
                                                    orderNo: app.searchInv.substr(0, 7),
                                                    invNo: app.invType.substr(3) + app.invNo,
                                                    invDate: app.invDate + " " + app.subTime,
                                                    code: app.code,
                                                    name: app.name,
                                                    address: app.address,
                                                    poRef: app.poRef,
                                                    contact: app.contact,
                                                    tel: app.tel,
                                                    desc: 'Invoice payment',
                                                    detail: app.detail,
                                                    disc: app.disc,
                                                    net: app.net,
                                                    down: app.downAmt,
                                                    balance: app.sumbalance,
                                                    shipAdd: app.shipAdd,
                                                    shipDate: app.shipDate,
                                                    remark: app.remark,
                                                    countPayment: countPayment,
                                                    status: 'Open',
                                                    payMentStatus: 'Paid',
                                                    printed: 0,
                                                    statusType: app.invType.substr(3),
                                                    glNo: ''
                                                })
                                            }
                                            else {
                                                if (app.balanceAmt == 0) {
                                                    batch.set(collection(db, 'invoice').doc(), {
                                                        orderNo: app.searchInv.substr(0, 7),
                                                        invNo: app.invType.substr(3) + app.invNo,
                                                        invDate: app.invDate + " " + app.subTime,
                                                        code: app.code,
                                                        name: app.name,
                                                        address: app.address,
                                                        poRef: app.poRef,
                                                        contact: app.contact,
                                                        tel: app.tel,
                                                        desc: 'Invoice payment',
                                                        detail: app.detail,
                                                        disc: app.disc,
                                                        net: app.net,
                                                        down: app.downAmt,
                                                        balance: app.sumbalance,
                                                        shipAdd: app.shipAdd,
                                                        shipDate: app.shipDate,
                                                        remark: app.remark,
                                                        countPayment: countPayment,
                                                        status: 'Open',
                                                        payMentStatus: 'Paid',
                                                        printed: 0,
                                                        statusType: app.invType.substr(3),
                                                        glNo: ''
                                                    })
                                                }
                                                else {
                                                    batch.set(collection(db, 'invoice').doc(), {
                                                        orderNo: app.searchInv.substr(0, 7),
                                                        invNo: app.invType.substr(3) + app.invNo,
                                                        invDate: app.invDate + " " + app.subTime,
                                                        code: app.code,
                                                        name: app.name,
                                                        address: app.address,
                                                        poRef: app.poRef,
                                                        contact: app.contact,
                                                        tel: app.tel,
                                                        desc: 'Invoice payment',
                                                        detail: app.detail,
                                                        disc: app.disc,
                                                        net: app.net,
                                                        down: app.downAmt,
                                                        balance: app.sumbalance,
                                                        shipAdd: app.shipAdd,
                                                        shipDate: app.shipDate,
                                                        remark: app.remark,
                                                        countPayment: countPayment,
                                                        status: 'Open',
                                                        payMentStatus: 'Not paid yet',
                                                        printed: 0,
                                                        statusType: app.invType.substr(3),
                                                        glNo: ''
                                                    })
                                                }
                                            }
                                            batch.update(collection(db, "order").doc(app.orderId), {
                                                downBalance: app.downBalance,
                                                balance: app.balance - app.amtRecei,
                                            })
                                            batch.commit().then(() => {
                                                app.addGl()
                                                // app.checkProdInOrder()
                                            })
                                                // .catch((error) => {
                                                //     console.log(error);
                                                //     alert("Invoice failed.")
                                                // })
                                        })
                                })
                        }
                    })
            }
        },

        test() {
            let app = this
            let countPayment = []
            let noInv = this.invType.substr(3) + this.invNo
            const db = getFirestore()
            addDoc(collection(db, 'testInvoice'),{
                orderNo: app.searchInv.substr(0, 7),
                invNo: app.invType.substr(3) + app.invNo,
                invDate: app.invDate + " " + app.subTime,
                code: app.code,
                name: app.name,
                address: app.address,
                poRef: app.poRef,
                contact: app.contact,
                tel: app.tel,
                desc: 'Invoice payment',
                detail: app.detail,
                disc: app.disc,
                net: app.net,
                down: app.downAmt,
                balance: app.sumbalance,
                shipAdd: app.shipAdd,
                shipDate: app.shipDate,
                remark: app.remark,
                countPayment: countPayment,
                status: 'Open',
                payMentStatus: 'Not paid yet',
                printed: 0,
                statusType: app.invType.substr(3),
                // glNo: this.glNo
            })
                .then(() => {
                    if (app.balanceAmt > 0) {
                        addDoc(collection(db, "testGeneralLedger"),{
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '112001',
                            accName: 'Accounts Receivable',
                            debit: app.balanceAmt,
                            credit: 0,
                            remark: '',
                        })
                    }
                    if (app.downAmt > 0) {
                        addDoc(collection(db, "testGeneralLedger"),{
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '214101',
                            accName: 'Deposit received',
                            debit: app.downAmt,
                            credit: 0,
                            remark: '',
                        })
                    }
                    if (app.invType.substr(3) == 'V') {
                        addDoc(collection(db, "testGeneralLedger"),{
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '410001',
                            accName: 'Sales-v',
                            debit: 0,
                            credit: app.net,
                            remark: '',
                        })
                    }
                    if (app.invType.substr(3) == 'N') {
                        addDoc(collection(db, "testGeneralLedger"),{
                            glNo: app.glNo,
                            glDate: app.invDate,
                            refNo: noInv,
                            desc: 'Invoice payment',
                            accId: '410002',
                            accName: 'Sales-n',
                            debit: 0,
                            credit: app.net,
                            remark: '',
                        })
                    }
                })
                .then(() => {
                    console.log("Success.")
                })
        },

        // Check the product. If completed, the order will change status to Closed
        async checkProdInOrder() {
            let app = this
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), doc(app.orderId));
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
                        addDoc(collection(db, "order"), doc(app.orderId),{
                            status: "Closed"
                        })
                    }
                })
                .then(() => {
                    alert("Invocie successfully.")
                    app.clearInv()
                })
        },

        // Change invNo value when select the invType
        async changeInvNo() {
            let year = this.invDate.substr(0, 4)
            let subYear = this.invDate.substr(2, 2)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "counter"), year);
                docRef.forEach((doc) => {
                    let typeDoc = doc.data()[this.invType] + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.invNo = subYear + typeDoc
                })
        },

        // Clear web page
        clearInv() {
            this.invType = ''
            this.invNo = ''
            this.invDate = new Date().toISOString().substr(0, 10)
            this.code = ''
            this.name = ''
            this.address = ''
            this.poRef = ''
            this.contact = ''
            this.tel = ''
            this.detail = []
            this.downAmt = 0
            this.payDateOrder = new Date().toISOString().substr(0, 10)
            this.amtRecei = 0
            this.payDateInv = new Date().toISOString().substr(0, 10)
            this.showDetails = false
            this.searchInv = []
        },

        // Error does not allow input the number to be exceeded
        inputNum() {
            this.detail.forEach(item => {
                item.num = item.num * 1
                if (item.num > item.maxNum || item.num < 1) {
                    // alert("Quantity limit" + " " + item.maxNum)
                    alert("The number of products exceeds the order amount.\nPlease input number new again")
                    item.num = item.maxNum
                }
            })
        },
    },
    computed: {

        // Calculate total
        sumTotal() {
            return this.detail.reduce((total, item) => total + (item.num * item.PriceMM), 0)
        },

        net() {
            return this.sumTotal - this.disc
        },

        checkBalance() {
            return this.balanceAmt > 0 ? this.showAmtRecei == false : this.showAmtRecei == true
        },

        balanceAmt() {
            return this.net - this.downAmt
        },

        // Calculate down balance
        downBalance() {
            return this.down - this.downAmt
        },

        // Calculate balance
        sumbalance() {
            return this.balanceAmt - this.amtRecei
        },

        balanceOrder() {
            return this.balance - this.sumbalance
        }
    },
    async mounted() {
        // this.balanceCheck()
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "order"), where("status", "==", "Open"));
            docRef.forEach(()=> {
                this.itemOrder = []
                docRef.forEach((doc) => {
                    let orderDoc = doc.data().orderNo
                    let nameDoc = doc.data().name
                    this.itemOrder.push(orderDoc + " " + ":" + " " + nameDoc)
                })
                this.itemOrder.sort()
            })
        let year = this.invDate.substr(0, 4)
        let subYear = this.invDate.substr(2, 2)
        this.itemRefNo = []
        const docRe = await getDocs(collection(db, "counter"), year);
            docRe.forEach((doc) => {
                let typeDoc = doc.data().in + 1
                if (typeDoc <= 9999) {
                    typeDoc = ("000" + typeDoc).slice(-4)
                }
                this.glNo = "IN" + subYear + typeDoc
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

.compact-form {
    transform: scale(0.8);
    transform-origin: left;
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