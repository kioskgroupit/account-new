<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Invoice Status</h1>
                    <v-layout>
                        <v-flex xs2>
                        <v-menu v-model="menuMonth" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
                            min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="searchMonth" label="Select Month:" prepend-icon="mdi-calendar" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="searchMonth" @input="menuMonth = false" :max="nowDate" type="month"
                                @change="changeMonth()"></v-date-picker>
                        </v-menu>
                        </v-flex>
                        <v-flex xs1>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn @click="searchYear" v-on="on"><v-icon>mdi-calendar</v-icon>year</v-btn>
                                </template>
                                <span>Search invoice by last year</span>
                            </v-tooltip>
                        </v-flex>
                        <v-flex xs2 mr-3>
                            <v-select :items="itempayMentStatus" v-model="payMentStatus"
                                label="Filter from payment status:" @change="searchPayMentStatus"></v-select>
                        </v-flex>
                        <v-flex xs2>
                            <!-- <v-text-field v-model="custCode" @keypress.enter="test"></v-text-field> -->
                            <v-select :items="itemCustCode" v-model="custCode" label="Filter from customer code:"
                                @change="filterCustCode"></v-select>
                        </v-flex>
                    </v-layout>
                    <div>

                        <!-- Invoice status -->
                        <v-data-table :headers="headers" :items="detail" class="elevation-1" v-bind:options.sync="options" :items-per-page-options="rowsPerPageItems">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td>{{ props.item.invNo }}</td>
                                <td>{{ props.item.invDate.substr(0, 10) }}</td>
                                <td>{{ props.item.orderNo }}</td>
                                <td>{{ props.item.code }}</td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.payMentStatus }}</td>
                                <td>{{ props.item.status }}</td>
                                <td>{{ props.item.printed }}</td>
                                <td class="text-xs-left">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small class="mr-2" @click="viewInvoice(props.item)"
                                                v-on="on">visibility</v-icon>
                                        </template>
                                        <span>View invoice details</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-if="props.item.status != 'Cancelled'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon small class="mr-2" @click="editItem(props.item)"
                                                v-on="on">edit</v-icon>
                                        </template>
                                        <span>Edit invoice</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && props.item.code.substr(0, 1) == 'M'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-2" small @click="printInvoicePro1(props.item)"
                                                v-on="on">print</v-icon>
                                        </template>
                                        <span>Print invoice</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && props.item.code.substr(0, 1) !== 'M'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-2" small @click="printInvoice(props.item)"
                                                v-on="on">print</v-icon>
                                        </template>
                                        <span>Print invoice</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && props.item.invNo.substr(0, 2) != 'CN'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-2" color="red" small v-on="on"
                                                @click="getStock(props.item)">local_shipping</v-icon>
                                        </template>
                                        <span>Delivery</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Closed' && props.item.invNo.substr(0, 2)">
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-2" color="green" small v-on="on"
                                                @click="getStock(props.item)">local_shipping</v-icon>
                                        </template>
                                        <span>Delivery</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.payMentStatus == 'Not paid yet' && props.item.status == 'Open'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-2" small @click="cancelInv(props.item)"
                                                v-on="on">cancel</v-icon>
                                        </template>
                                        <span>Cancel invoice</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && props.item.invNo.substr(0, 2) == 'CN'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon color="red" small v-on="on"
                                                @click="returnProd(props.item)">rv_hookup</v-icon>
                                        </template>
                                        <span>Return products</span>
                                    </v-tooltip>
                                </td>
                                <td class="text-xs-left">
                                    <v-tooltip bottom v-if="props.item.status == 'Open' && (props.item.code).substr(0, 1) == 'M' &&
                                    props.item.invNo.substr(0, 2) != 'CN'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon small v-on="on" color="red"
                                                @click="printDI(props.item)">print</v-icon>
                                        </template>
                                        <span>Print delivery invoice(DI)</span>
                                        <!-- <span>Print to send the company</span> -->
                                    </v-tooltip>
                                </td>
                            </template>
                        </v-data-table>

                        <!-- View invoice -->
                        <v-dialog v-model="showViewInvoice" max-width="1220px">
                            <v-card>
                                <v-card-title class="headline">
                                    <v-flex xs2>
                                        View Invoice
                                    </v-flex>
                                    <v-flex text-xs-right>
                                        <v-icon @click="showViewInvoice = false">clear</v-icon>
                                    </v-flex>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-container>

                                        <!-- Invoice detail -->
                                        <v-layout>
                                            <v-flex xs11 text-xs-right>Invoice no: </v-flex>
                                            <v-flex xs1 text-xs-right>
                                                <input type="text" class="line" v-model="invNo" disabled>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs11 text-xs-right>Invoice date: </v-flex>
                                            <v-flex xs1 text-xs-right>
                                                <input type="text" class="line" v-model="invDate" disabled>
                                            </v-flex>
                                        </v-layout>

                                        <!-- customer info -->
                                        <div>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>Customer code:</v-flex>
                                                <v-flex xs6>
                                                    <input type="text" class="inputCust" size="35" v-model="code"
                                                        disabled>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>Customer name:</v-flex>
                                                <v-flex xs6>
                                                    <input type="text" class="inputCust" size="35" v-model="name"
                                                        disabled>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>Address:</v-flex>
                                                <v-flex xs8>
                                                    <input type="text" class="inputCust" size="65" v-model="address"
                                                        disabled>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>PO ref#:</v-flex>
                                                <v-flex xs5>
                                                    <input type="text" class="inputCust" size="30" v-model="poRef"
                                                        disabled>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>Contact name:</v-flex>
                                                <v-flex xs5>
                                                    <input type="text" class="inputCust" size="25" v-model="contact"
                                                        disabled>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs2 text-xs-right my-1>Tel:</v-flex>
                                                <v-flex xs5>
                                                    <input type="text" class="inputCust" v-model="tel" disabled>
                                                </v-flex>
                                            </v-layout>
                                        </div>

                                        <!-- Invoice detail -->
                                        <br>
                                        <v-layout table>
                                            <v-flex xs1 text-xs-center>
                                                <h4>No</h4>
                                            </v-flex>
                                            <v-flex xs1>
                                                <h4>Model</h4>
                                            </v-flex>
                                            <v-flex xs3>
                                                <h4>Description</h4>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <h4>Frame</h4>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <h4>Front</h4>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <h4>Quantity</h4>
                                            </v-flex>
                                            <v-flex xs2 text-xs-right>
                                                <h4>Price</h4>
                                            </v-flex>
                                            <v-flex xs2 text-xs-right>
                                                <h4>Amount</h4>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout v-for="(item, i) in prodDetail" :key="i" collapse tableDetail>
                                            <v-flex xs1 text-xs-center>
                                                <font size=2>{{ i+ 1}}</font>
                                            </v-flex>
                                            <v-flex xs1>
                                                <font size=2>{{ item.Code }}</font>
                                            </v-flex>
                                            <v-flex xs3>
                                                <font size=2>{{ item.NameMM }}</font>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <font size=2>{{ item.frame }}</font>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <font size=2>{{ item.front }}</font>
                                            </v-flex>
                                            <v-flex xs1 text-xs-center>
                                                <font size=2>{{ item.num }}</font>
                                            </v-flex>
                                            <v-flex xs2>
                                                <vue-numeric separator="," :precision="2" disabled :value="item.PriceMM"
                                                    class="numeric"></vue-numeric>
                                            </v-flex>
                                            <v-flex xs2>
                                                <vue-numeric separator="," :precision="2" disabled :value="item.amt"
                                                    class="numeric"></vue-numeric>
                                            </v-flex>
                                        </v-layout>
                                        <br>

                                        <!-- Summary detail -->
                                        <v-layout>
                                            <v-flex xs6>
                                                <v-layout>
                                                    <v-flex>
                                                        <strong>Shipping Address: </strong>
                                                        <textarea rows="4" cols="50" class="lineShipAdd"
                                                            v-model="shipAdd" disabled></textarea>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex>
                                                        <strong>Shipping Date: </strong>
                                                        <input class="lineShipDate" v-model="shipDate" size="10"
                                                            disabled>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex>
                                                        <strong>Remark: </strong>
                                                        <textarea rows="2" cols="50" class="lineShipAdd"
                                                            v-model="remark" disabled></textarea>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                            <v-flex xs6>
                                                <v-layout>
                                                    <v-flex xs10 text-xs-right>
                                                        <font size=2>Total:</font>
                                                    </v-flex>
                                                    <v-flex xs4 line>
                                                        <vue-numeric separator="," :precision="2" disabled
                                                            :value="sumTotal" class="numericNet"></vue-numeric>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs10 text-xs-right>
                                                        <font size=2>Discount:</font>
                                                    </v-flex>
                                                    <v-flex xs4 line>
                                                        <vue-numeric separator="," :precision="2" disabled :value="disc"
                                                            class="numericNet"></vue-numeric>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs10 text-xs-right>
                                                        <font size=2>Net amount:</font>
                                                    </v-flex>
                                                    <v-flex xs4 line>
                                                        <vue-numeric separator="," :precision="2" disabled
                                                            :value="sumTotal - disc" class="numericNet"></vue-numeric>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs10 text-xs-right>
                                                        <font size=2>Down amount:</font>
                                                    </v-flex>
                                                    <v-flex xs4 line>
                                                        <vue-numeric separator="," :precision="2" disabled :value="down"
                                                            class="numericNet"></vue-numeric>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout>
                                                    <v-flex xs10 text-xs-right>
                                                        <font size=2>Balance amount to be paid:</font>
                                                    </v-flex>
                                                    <v-flex xs4 line>
                                                        <vue-numeric separator="," :precision="2" disabled
                                                            :value="(sumTotal - disc) - down"
                                                            class="numericBalance"></vue-numeric>
                                                    </v-flex>
                                                </v-layout>
                                            </v-flex>
                                        </v-layout>
                                        <br>
                                        <v-layout border v-for="(item, i) in countPayment" :key="item.i">
                                            <v-layout justify-center>
                                                <v-flex xs3 mr-3>
                                                    <strong>Payment method {{ i+ 1}}: </strong>
                                                    <input class="lineShipAdd" v-model="item.payMent" size="30"
                                                        disabled>
                                                </v-flex>
                                                <v-flex xs4 ml-5>
                                                    <strong>Down payment {{ i+ 1}}: </strong>
                                                    <vue-numeric separator="," :precision="2" disabled
                                                        :value="item.down" class="down"></vue-numeric>
                                                </v-flex>
                                                <v-flex xs2 ml-3>
                                                    <strong>Payment date {{ i+ 1}}: </strong>
                                                    <input class="lineShipAdd" v-model="item.date" size="10" disabled>
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-dialog>

                        <!-- Edit invoice status -->
                        <v-dialog v-model="showEdit" persistent max-width="1280px">
                            <v-card>
                                <v-card-title class="headline">Edit Invoice Status</v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout>
                                            <v-flex xs1>
                                                <v-text-field v-model="editInv.invNo" label="Invoice no:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-text-field v-model="editInv.invDate" label="Invoice date:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs1>
                                                <v-text-field v-model="editInv.orderNo" label="Order no:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-text-field v-model="editInv.code" label="Customer id:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs5>
                                                <v-text-field v-model="editInv.name" label="Customer name:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs1>
                                                <v-select :items="itemStatus" v-model="editInv.status"
                                                    label="Status:"></v-select>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex>
                                                <v-text-field v-model="editInv.po" label="PO Ref:"></v-text-field>
                                            </v-flex>
                                            <v-flex>
                                                <v-text-field v-model="editInv.remark" label="Remarks:"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="red darken-1" flat @click="closeEdit()">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="saveEdit()">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
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
        mainMenu,
        VueNumeric
    },
    data() {
        return {
            nowDate: new Date().toISOString().slice(0, 10),
            menuMonth: false,
            searchMonth: new Date().toISOString().substr(0, 7),
            invId: '',
            detail: [],
            cloneDetail: [],
            headers: [
                { text: 'Invoice no', align: 'left', value: 'invNo' },
                { text: 'Invoice date', value: 'invDate' },
                { text: 'Order no', value: 'orderNo', align: 'left' },
                { text: 'Customer id', value: 'code', align: 'left' },
                { text: 'Customer name', sortable: false, align: 'left' },
                { text: 'Payment status', value: 'payMentStatus', align: 'left' },
                { text: 'Invoice status', value: 'status', align: 'left' },
                { text: 'Printed', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' },
            ],
            rowsPerPageItems: [50, 100, 200, 500],
            // pagination: { 'sortBy': 'invDate', 'descending': true },
            options: { 'descending': true },
            showViewInvoice: false,
            invNo: '',
            invDate: '',
            orderNo: '',
            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',
            prodDetail: [],
            net: 0,
            disc: 0,
            down: 0,
            balance: 0,
            shipAdd: '',
            shipDate: '',
            remark: '',
            amtRecei: 0,
            payMent: '',
            payDateInv: '',
            showEdit: false,
            idInv: '',
            idOrder: '',
            editInv: {
                invNo: '',
                invDate: '',
                orderNo: '',
                code: '',
                name: '',
                po: '',
                remark: '',
                status: ''
            },
            itemStatus: ['Open', 'Closed'],
            countPayment: [],
            prodList: [],
            accBalance: [],
            resultAcc: [],
            itempayMentStatus: ['Paid', 'Not paid yet'],
            payMentStatus: '',
            itemCustCode: [],
            custCode: ''
        }
    },
    methods: {
        test() {
            this.detail = this.cloneDetail.filter(rec => this.custCode == rec.code.slice(0, this.custCode.length))
        },
        // Filter from payment status
        searchPayMentStatus() {
            this.custCode = ""
            this.detail = this.cloneDetail.filter(rec => rec.payMentStatus == this.payMentStatus)
        },
        // Filter from customer code
        filterCustCode() {
            this.payMentStatus = ""
            this.detail = this.cloneDetail.filter(rec => rec.code == this.custCode)
        },
        // Search invoice by select month
        async changeMonth() {
            this.payMentStatus = ""
            this.custCode = ""
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "invoice"), where("invDate", ">", this.searchMonth), where("invDate", "<", nextMonth));
                docRef.forEach(() => {
                    this.detail = []
                    this.cloneDetail = []
                    this.itemCustCode = []
                    docRef.forEach(doc => {
                        this.detail.push(doc.data())
                        this.itemCustCode.push(doc.data().code)
                    })
                    this.itemCustCode.sort()
                    this.cloneDetail = this.detail
                })
        },
        // Search invoice by last year
        searchYear() {
            this.payMentStatus = ""
            this.custCode = ""
            let year = new Date().toISOString().substr(0, 4)
            db.collection("invoice").orderBy("invDate").startAt(year).endAt(year + "\uf8ff")
                .onSnapshot(querySnapshot => {
                    this.detail = []
                    this.cloneDetail = []
                    this.itemCustCode = []
                    querySnapshot.forEach(doc => {
                        this.detail.push(doc.data())
                        this.itemCustCode.push(doc.data().code)
                    })
                    this.itemCustCode.sort()
                    this.cloneDetail = this.detail
                })
        },
        // Show invoice detail
        viewInvoice(item) {
            db.collection("invoice").where("invNo", "==", item.invNo).get()
                .then(querySnapshot => {
                    // console.log(querySnapshot)
                    if (querySnapshot.empty) {
                        alert("Inv No is not correct...\nPlease Try again")
                        this.$refs.orderNo.focus()
                    } else {
                        this.showViewInvoice = true
                        let doc = querySnapshot.docs[0].data()
                        let docId = querySnapshot.docs[0].id
                        this.invId = docId
                        this.invNo = doc.invNo
                        this.invDate = doc.invDate.substr(0, 10)
                        this.code = doc.code
                        this.name = doc.name
                        this.address = doc.address
                        this.poRef = doc.poRef
                        this.contact = doc.contact
                        this.tel = doc.tel
                        this.prodDetail = doc.detail
                        this.net = doc.net
                        this.disc = doc.disc
                        this.down = doc.down
                        this.balance = doc.balance
                        this.shipAdd = doc.shipAdd
                        this.shipDate = doc.shipDate
                        this.remark = doc.remark
                        this.countPayment = doc.countPayment
                        // this.amtRecei = doc.amtRecei
                        // this.payMent = doc.payMent
                        // this.payDateInv = doc.payDateInv.substr(0,10)
                    }
                })
        },
        // Open dialog for edit invoice status
        editItem(item) {
            this.showEdit = true
            this.itemStatus = ['Open', 'Closed']
            this.editInv.invNo = item.invNo
            this.editInv.invDate = item.invDate.substr(0, 10)
            this.editInv.orderNo = item.orderNo
            this.editInv.code = item.code
            this.editInv.name = item.name
            this.editInv.status = item.status
            this.editInv.po = item.poRef
            if (item.payMentStatus == 'Paid') {
                this.itemStatus.splice(-1)
            }
            db.collection("invoice").where("invNo", "==", this.editInv.invNo).get()
                .then(querySnapshot => {
                    this.idInv = querySnapshot.docs[0].id
                    querySnapshot.forEach(doc => {
                        this.prodList = doc.data().detail
                    })
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
            db.collection("order").where("orderNo", "==", this.editInv.orderNo).get()
                .then(querySnapshot => {
                    this.idOrder = querySnapshot.docs[0].id
                })
        },
        accBalancePlus() {
            let app = this
            let year = "2018"
            let month = new Date(this.editInv.invDate).toISOString().substr(5, 2) * 1
            this.resultAcc = []
            let docAcc = db.collection("accBalance").doc(year)
            db.runTransaction(transaction => {
                return transaction.get(docAcc).then(Doc => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }
                    else {
                        app.accBalance.reduce((res, value) => {
                            if (!res[value.accId]) {
                                res[value.accId] = { accId: value.accId, debit: 0, credit: 0 }
                                app.resultAcc.push(res[value.accId])
                            }
                            res[value.accId].debit -= value.debit
                            res[value.accId].credit -= value.credit
                            return res
                        }, {})
                        app.resultAcc.forEach(rec => {
                            let docAccId = Doc.data()[rec.accId]
                            for (let i = month; i <= 12; i++) {
                                docAccId[(i < 10 ? '0' : '') + i] -= rec.debit
                                docAccId[(i < 10 ? '0' : '') + i] -= rec.credit
                                transaction.update(docAcc, {
                                    [rec.accId]: docAccId
                                })
                            }
                            docAccId["debit"] -= rec.debit
                            docAccId["credit"] -= rec.credit
                            transaction.update(docAcc, {
                                [rec.accId]: docAccId
                            })
                        })
                    }
                })
            })
        },
        // Delete selected invoices
        testCancelInv(item) {
            let app = this
            // let year = "2018"
            let year = new Date().toISOString().substr(0, 4)
            let month = new Date(item.invDate.substr(0, 10)).toISOString().substr(5, 2) * 1
            if (confirm("Do you want to cancel " + item.invNo + " " + "?") == true) {
                this.idOrder = ''
                this.idInv = ''
                this.prodList = []
                db.collection("invoice").where("invNo", "==", item.invNo).get()
                    .then(querySnapshot => {
                        app.idInv = querySnapshot.docs[0].id
                        querySnapshot.forEach(doc => {
                            app.prodList = doc.data().detail
                        })
                        db.collection("order").where("orderNo", "==", item.orderNo).get()
                            .then(query => {
                                app.idOrder = query.docs[0].id
                                let down = 0
                                query.forEach(doc => {
                                    down = doc.data().downBalance
                                })
                                let DocRef = db.collection("order").doc(app.idOrder)
                                db.runTransaction(function (transaction) {
                                    return transaction.get(DocRef).then(function (Doc) {
                                        if (!Doc.exists) {
                                            throw "Document does not exist!"
                                        }
                                        let newOrderDetail = Doc.data().detail
                                        app.prodList.forEach(rec => {
                                            let newPos = newOrderDetail.findIndex(detail => detail.Code == rec.Code && detail.frame == rec.frame
                                                && detail.front == rec.front)
                                            newOrderDetail[newPos].numSend -= rec.num
                                        })
                                        transaction.update(DocRef, {
                                            detail: newOrderDetail,
                                            status: "Open"
                                        })
                                    })
                                })
                                    .then(() => {
                                        db.collection("generalLedger").where("refNo", "==", item.invNo).get()
                                            .then(query => {
                                                app.accBalance = []
                                                let i = 0
                                                query.forEach(doc => {
                                                    let accDoc = doc.data()
                                                    app.accBalance.push({
                                                        docId: query.docs[i].id, accId: accDoc.accId,
                                                        accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark
                                                    })
                                                    i++
                                                })
                                                let depRecei = 0
                                                app.accBalance.forEach(rec => {
                                                    if (rec.accId == '214101') {
                                                        depRecei = rec.debit
                                                    }
                                                })
                                                depRecei += down
                                                db.collection("order").doc(app.idOrder).update({
                                                    downBalance: depRecei
                                                })
                                                let docAcc = db.collection("accBalance").doc(year)
                                                db.runTransaction(transaction => {
                                                    return transaction.get(docAcc).then(Doc => {
                                                        if (!Doc.exists) {
                                                            throw "Document does not exist!"
                                                        }
                                                        else {
                                                            app.accBalance.forEach(rec => {
                                                                let docAccId = Doc.data()[rec.accId]
                                                                for (let i = month; i <= 12; i++) {
                                                                    docAccId[(i < 10 ? '0' : '') + i] -= rec.debit
                                                                    docAccId[(i < 10 ? '0' : '') + i] += rec.credit
                                                                    transaction.update(docAcc, {
                                                                        [rec.accId]: docAccId
                                                                    })
                                                                }
                                                                if (rec.debit > 0) {
                                                                    docAccId["debit"] -= rec.debit
                                                                    docAccId["credit"] += rec.debit
                                                                    transaction.update(docAcc, {
                                                                        [rec.accId]: docAccId
                                                                    })
                                                                }
                                                                if (rec.credit > 0) {
                                                                    docAccId["debit"] += rec.credit
                                                                    docAccId["credit"] -= rec.credit
                                                                    transaction.update(docAcc, {
                                                                        [rec.accId]: docAccId
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                })
                                                    .then(() => {
                                                        db.collection("invoice").doc(app.idInv).update({
                                                            status: "Cancelled"
                                                        })
                                                            .then(() => {
                                                                let j = 0
                                                                app.accBalance.forEach(rec => {
                                                                    if (rec.debit > 0) {
                                                                        db.collection("generalLedger").doc(rec).update({
                                                                            debit: 0,
                                                                            credit: rec.debit
                                                                        })
                                                                            .then(() => {
                                                                                j++
                                                                                callback()
                                                                            })
                                                                    }
                                                                    if (rec.credit > 0) {
                                                                        db.collection("generalLedger").doc(rec).update({
                                                                            debit: rec.credit,
                                                                            credit: 0
                                                                        })
                                                                            .then(() => {
                                                                                j++
                                                                                callback()
                                                                            })
                                                                    }
                                                                })
                                                                let callback = function
                                                                    callback() {
                                                                    if (app.accBalance.length === j) {
                                                                        alert("Cancel successfully.")
                                                                    }
                                                                }
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            }
        },
        // Delete selected invoices
        cancelInv(item) {
            let app = this
            if (confirm("Do you want to cancel " + item.invNo + " " + "?") == true) {
                this.idOrder = ''
                this.idInv = ''
                this.prodList = []
                db.collection("invoice").where("invNo", "==", item.invNo).get()
                    .then(querySnapshot => {
                        app.idInv = querySnapshot.docs[0].id
                        querySnapshot.forEach(doc => {
                            app.prodList = doc.data().detail
                        })
                        db.collection("order").where("orderNo", "==", item.orderNo).get()
                            .then(query => {
                                app.idOrder = query.docs[0].id
                                let down = 0
                                query.forEach(doc => {
                                    down = doc.data().downBalance
                                })
                                let DocRef = db.collection("order").doc(app.idOrder)
                                db.runTransaction(function (transaction) {
                                    return transaction.get(DocRef).then(function (Doc) {
                                        if (!Doc.exists) {
                                            throw "Document does not exist!"
                                        }
                                        let newOrderDetail = Doc.data().detail
                                        app.prodList.forEach(rec => {
                                            let newPos = newOrderDetail.findIndex(detail => detail.Code == rec.Code && detail.frame == rec.frame
                                                && detail.front == rec.front)
                                            newOrderDetail[newPos].numSend -= rec.num
                                        })
                                        transaction.update(DocRef, {
                                            detail: newOrderDetail,
                                            status: "Open"
                                        })
                                    })
                                })
                                    .then(() => {
                                        db.collection("generalLedger").where("refNo", "==", item.invNo).get()
                                            .then(query => {
                                                app.accBalance = []
                                                let i = 0
                                                query.forEach(doc => {
                                                    let accDoc = doc.data()
                                                    app.accBalance.push({
                                                        docId: query.docs[i].id, accId: accDoc.accId, glDate: accDoc.glDate,
                                                        accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark
                                                    })
                                                    i++
                                                })
                                                let depRecei = 0
                                                app.accBalance.forEach(rec => {
                                                    if (rec.accId == '214101') {
                                                        depRecei = rec.debit
                                                    }
                                                })
                                                depRecei += down
                                                db.collection("order").doc(app.idOrder).update({
                                                    downBalance: depRecei
                                                })
                                                    .then(() => {
                                                        db.collection("invoice").doc(app.idInv).update({
                                                            balance: 0,
                                                            status: "Cancelled"
                                                        })
                                                        let year = new Date().toISOString().substr(0, 4)
                                                        let subYear = year.substr(2, 2)
                                                        let glNo = []
                                                        db.collection("counter").doc(year).get()
                                                            .then(doc => {
                                                                let typeDoc = doc.data().in + 1
                                                                if (typeDoc <= 9999) {
                                                                    typeDoc = ("000" + typeDoc).slice(-4)
                                                                }
                                                                glNo = "IN" + subYear + typeDoc
                                                            })
                                                            .then(() => {
                                                                let DocCount = db.collection("counter").doc(year)
                                                                return db.runTransaction((transaction) => {
                                                                    return transaction.get(DocCount).then((Doc) => {
                                                                        if (!Doc.exists) {
                                                                            throw "Document does not exist!"
                                                                        }
                                                                        let newGlNo = Doc.data().in + 1
                                                                        transaction.update(DocCount, {
                                                                            ["in"]: newGlNo
                                                                        })
                                                                    })
                                                                })
                                                                    .then(() => {
                                                                        let j = 0
                                                                        app.accBalance.forEach(rec => {
                                                                            if (rec.debit > 0) {
                                                                                db.collection("generalLedger").add({
                                                                                    accId: rec.accId,
                                                                                    accName: rec.accName,
                                                                                    desc: "Invoice payment",
                                                                                    debit: 0,
                                                                                    credit: rec.debit,
                                                                                    glNo: glNo,
                                                                                    refNo: item.invNo,
                                                                                    glDate: rec.glDate,
                                                                                    remark: "",
                                                                                })
                                                                                    .then(() => {
                                                                                        j++
                                                                                        callback()
                                                                                    })
                                                                            }
                                                                            if (rec.credit > 0) {
                                                                                db.collection("generalLedger").add({
                                                                                    accId: rec.accId,
                                                                                    accName: rec.accName,
                                                                                    desc: "Invoice payment",
                                                                                    debit: rec.credit,
                                                                                    credit: 0,
                                                                                    glNo: glNo,
                                                                                    refNo: item.invNo,
                                                                                    glDate: rec.glDate,
                                                                                    remark: "",
                                                                                })
                                                                                    .then(() => {
                                                                                        j++
                                                                                        callback()
                                                                                    })
                                                                            }
                                                                        })
                                                                        let callback = function
                                                                            callback() {
                                                                            if (app.accBalance.length === j) {
                                                                                alert("Cancel successfully.")
                                                                            }
                                                                        }
                                                                    })
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })
            }
        },
        // Update invoice status in the database
        saveEdit() {
            db.collection("invoice").doc(this.idInv).update({
                poRef: this.editInv.po,
                remark: this.editInv.remark,
                status: this.editInv.status
            })
                .then(() => {
                    this.closeEdit()
                    alert("Success.")
                })
        },
        // Close dialog
        closeEdit() {
            this.editInv.invNo = ''
            this.editInv.invDate = ''
            this.editInv.code = ''
            this.editInv.name = ''
            this.editInv.po = ''
            this.editInv.remark = ''
            this.editInv.status = []
            this.showEdit = false
        },
        // Print invoice
        printInvoice(item) {
            db.collection("invoice").where("invNo", "==", item.invNo).get()
                .then(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.invId = docId
                    db.collection("invoice").doc(this.invId).update({
                        printed: item.printed + 1
                    })
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'invReport', query: { invNo: item.invNo } })
                            window.open(routeData.href, '_blank')
                        })
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        // Print invoice pro1
        printInvoicePro1(item) {
            db.collection("invoice").where("invNo", "==", item.invNo).get()
                .then(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.invId = docId
                    db.collection("invoice").doc(this.invId).update({
                        printed: item.printed + 1
                    })
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'invproreport', query: { invNo: item.invNo } })
                            window.open(routeData.href, '_blank')
                        })
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        // Print delivery invoice
        printDI(item) {
            db.collection("invoice").where("invNo", "==", item.invNo).get()
                .then(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.invId = docId
                    db.collection("invoice").doc(this.invId).update({
                        printed: item.printed + 1
                    })
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'invReportDI', query: { invNo: item.invNo } })
                            window.open(routeData.href, '_blank')
                        })
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        // 
        getStock(item) {
            let routeData = this.$router.resolve({
                name: 'proddelivery', query:
                {
                    invNo: item.invNo
                }
            })
            window.location.assign(routeData.href)
            // window.open(routeData.href, '_blank')
        },
        // 
        returnProd(item) {
            let routeData = this.$router.resolve({
                name: 'returnproduct', query:
                {
                    invNo: item.invNo
                }
            })
            window.location.assign(routeData.href)
        }
    },
    computed: {

        // Calculate total
        sumTotal() {
            return this.prodDetail.reduce((total, item) => total + (item.num * item.PriceMM), 0)
        },
    },
    async mounted() {
        let nextMonth = new Date(this.searchMonth)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth = nextMonth.toISOString().substr(0, 7)
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "invoice"), where("invDate", ">", this.searchMonth), where("invDate", "<", nextMonth));
            docRef.forEach(() => {
                this.detail = []
                this.itemCustCode = []
                docRef.forEach(doc => {
                    this.detail.push(doc.data())
                    this.itemCustCode.push(doc.data().code)
                })
                this.itemCustCode.sort()
                this.cloneDetail = this.detail
            })
    }
}
</script>
<style scoped>
.line {
    border-bottom: 1px solid black;
    text-align: right;
    width: 100%;
}

.lineShipAdd {
    border-bottom: 1px solid black;
    width: 100%;
}

.lineShipDate {
    border-bottom: 1px solid black;
    /* width: 100%; */
}

.linePayment {
    border-bottom: 1px solid black;
    /* text-align: right; */
    width: 100%;
}

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

.table {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}

.tableDetail {
    /* border-top: 1px solid black; */
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}

.numeric {
    text-align: right;
    width: 100%;
}

.numericNet {
    text-align: right;
    width: 100%;
    font-weight: bold;
}

.numericBalance {
    text-align: right;
    width: 100%;
    color: red;
    font-weight: bold;
}

.border {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    padding: 0.5%;
}

.down {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid black;
}
</style>