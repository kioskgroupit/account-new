<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-4">Order Status</h1>
                    <v-layout>
                        <v-flex xs2>
                            <v-menu v-model="menuMonth" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="searchMonth" label="Select Month:" prepend-icon="mdi-calendar"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="searchMonth" @input="menuMonth = false" :max="nowDate"
                                    type="month" @change="changeMonth()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs1>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn @click="searchYear" v-on="on"><v-icon>mdi-calendar</v-icon>year</v-btn>
                                </template>
                                <span>Search order by last year</span>
                            </v-tooltip>
                        </v-flex>
                        <v-flex xs2>
                            <!-- <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn @click="searchYear" v-on="on"><v-icon>date_range</v-icon>year</v-btn>
                                </template>
                                <span>Search order by last year</span>
                            </v-tooltip> -->
                            <v-select :items="itemSearchStatus" v-model="status" label="Search from status:"
                                @change="searchStatus"></v-select>
                        </v-flex>
                    </v-layout>
                    <div>
                        <!-- Order status -->
                        <v-data-table :headers="headers" :items="detail" class="elevation-1"
                            v-bind:pagination.sync="pagination" :items-per-page-options="rowsPerPageItems">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td>{{ props.item.orderNo }}</td>
                                <td>{{ props.item.orderDate.substr(0, 10) }}</td>
                                <td>{{ props.item.code }}</td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.contact }}</td>
                                <td>{{ props.item.district }}</td>
                                <td>{{ props.item.shipDate }}</td>
                                <td>{{ props.item.status }}</td>
                                <td class="text-xs-center">{{ props.item.printed }}</td>
                                <td class="text-xs-left">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small class="mr-2" @click="viewOrder(props.item)"
                                                v-on="on">visibility</v-icon>
                                        </template>
                                        <span>View order details</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-icon small class="mr-2" @click="editItem(props.item)"
                                                v-on="on">edit</v-icon>
                                        </template>
                                        <span>Edit order</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && (props.item.code).substr(0, 1) !== 'M'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon small @click="printOrder(props.item)" v-on="on">print</v-icon>
                                        </template>
                                        <span>Print order</span>
                                    </v-tooltip>
                                    <v-tooltip bottom
                                        v-if="props.item.status == 'Open' && (props.item.code).substr(0, 1) == 'M'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon small @click="printPro1(props.item)" v-on="on">print</v-icon>
                                        </template>
                                        <span>Print order</span>
                                    </v-tooltip>
                                </td>
                                <!-- <td class="text-xs-left">
                                    <v-tooltip bottom v-if="props.item.status == 'Open' && (props.item.code).substr(0, 1) == 'M'">
                                        <template v-slot:activator="{ on }">
                                            <v-icon small v-on="on" color="red" @click="printDO(props.item)">print</v-icon>
                                        </template>
                                        <span>Print delivery order(DO)</span>
                                    </v-tooltip>
                                </td> -->
                            </template>
                        </v-data-table>

                        <!-- View order -->
                        <v-dialog v-model="showViewOrder" max-width="1220px">
                            <v-card>
                                <v-card-title class="headline">
                                    <v-flex xs2>
                                        View Order
                                    </v-flex>
                                    <v-flex text-xs-right>
                                        <v-icon @click="showViewOrder = false">clear</v-icon>
                                    </v-flex>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <v-container>
                                        <!-- Order Form     -->
                                        <!-- Date selector -->
                                        <v-layout>
                                            <v-flex xs11 text-xs-right>Order no: </v-flex>
                                            <v-flex xs1 text-xs-right>
                                                <input type="text" class="line" v-model="orderNo" disabled>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs11 text-xs-right>Order date: </v-flex>
                                            <v-flex xs1 text-xs-right>
                                                <input type="text" class="line" v-model="orderDate" disabled>
                                            </v-flex>
                                        </v-layout>

                                        <!-- customer info -->
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
                                                <input type="text" class="inputCust" size="65" v-model="address"
                                                    disabled>
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

                                        <!-- Order detail -->
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
                                        <v-layout v-for="(item, i) in orderDetails" :key="i" collapse tableDetail>
                                            <v-flex xs1 text-xs-center>
                                                <font size=2>{{ i+ 1}}</font>
                                            </v-flex>
                                            <v-flex xs1>
                                                <font size=2>{{ item.Code }}</font>
                                            </v-flex>
                                            <v-flex xs3>
                                                <font size=2>{{ item.NameThai }}</font>
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
                                                        <input class="lineDate" v-model="shipDate" size="10" disabled>
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
                                                        <vue-numeric separator="," :precision="2" disabled
                                                            v-model="disc" class="numericNet"></vue-numeric>
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
                                            </v-flex>
                                        </v-layout>
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

                        <!-- Edit order status -->
                        <v-dialog v-model="showEdit" persistent max-width="600px">
                            <v-card>
                                <v-card-title class="headline">Edit Order Status</v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout>
                                            <v-flex xs5>
                                                <v-text-field v-model="editOrder.orderNo" label="Order no:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs6>
                                                <v-text-field v-model="editOrder.orderDate" label="Order date:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs3>
                                                <v-text-field v-model="editOrder.code" label="Customer id:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                            <v-flex xs9>
                                                <v-text-field v-model="editOrder.name" label="Customer name:"
                                                    readonly></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex>
                                                <v-text-field v-model="editOrder.poRef" label="PO Ref:"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs12>
                                                <v-text-field v-model="editOrder.shipAdd" label="Shipping address:"
                                                    ref="focusShipAdd"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs3>
                                                <v-menu v-model="menuShipDate" :close-on-content-click="false"
                                                    :nudge-right="40" lazy transition="scale-transition" offset-y
                                                    full-width min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field v-model="editOrder.shipDate"
                                                            label="Shipping date:" prepend-icon="event"
                                                            v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editOrder.shipDate"
                                                        @input="menuShipDate = false" :min="nowDate"></v-date-picker>
                                                </v-menu>
                                            </v-flex>
                                            <v-flex>
                                                <v-text-field v-model="editOrder.remark" label="Remark:"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs3>
                                                <v-select :items="itemStatus" v-model="editOrder.status"
                                                    label="Status:"></v-select>
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
import { collection, getDocs, where, getFirestore, setDoc, getDocFromServer, addDoc, orderBy, doc } from "firebase/firestore";
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
            itemSearchStatus: ['Open', 'Closed', 'Cancelled'],
            status: '',
            detail: [],
            cloneDetail: [],

            headers: [
                { text: 'Order no', value: 'orderNo', align: 'left' },
                { text: 'Order date', value: 'orderDate', align: 'left' },
                { text: 'Customer id', value: 'code', align: 'left' },
                { text: 'Customer name', sortable: false, align: 'left' },
                { text: 'Contact name', sortable: false, align: 'left' },
                { text: 'Districts', sortable: false, align: 'left' },
                { text: 'Shipping Date', value: 'shipDate', align: 'left' },
                { text: 'Order status', value: 'status', align: 'left' },
                { text: 'Printed', sortable: false, align: 'center' },
                { text: '', sortable: false, align: 'left' },
            ],
            rowsPerPageItems: [50, 100, 200, 500],
            pagination: { 'sortBy': 'orderDate', 'descending': true },

            showViewOrder: false,
            orderNo: '',
            orderDate: '',
            code: '',
            name: '',
            address: '',
            district: '',
            poRef: '',
            contact: '',
            tel: '',
            shipAdd: '',
            shipDate: '',
            remark: '',

            orderDetails: [],

            disc: 0,
            net: 0,

            showEdit: false,
            idOrder: '',
            editOrder: {
                orderNo: '',
                orderDate: '',
                code: '',
                name: '',
                poRef: '',
                shipAdd: '',
                shipDate: new Date().toISOString().substr(0, 10),
                remark: '',
                status: ''
            },
            menuShipDate: false,
            itemStatus: ['Open', 'Closed', 'Cancelled'],

            countPayment: []
        }
    },
    methods: {

        // Search order by select month
        changeMonth() {
            this.status = ""
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            db.collection("order").where("orderDate", ">", this.searchMonth).where("orderDate", "<", nextMonth)
                .onSnapshot(querySnapshot => {
                    this.detail = []
                    this.cloneDetail = []
                    querySnapshot.forEach(doc => {
                        this.detail.push(doc.data())
                    })
                    this.cloneDetail = this.detail
                })
        },

        // Search order by last year
        async searchYear() {
            this.status = ""
            let year = new Date().toISOString().substr(0, 4)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), orderBy("orderDate"), startAt(year), endAt(year + "\uf8ff"));
                docRef.forEach(()=> {
                    this.detail = []
                    this.cloneDetail = []
                    docRef.forEach(doc => {
                        this.detail.push(doc.data())
                    })
                    this.cloneDetail = this.detail
                })
        },

        // Filter from status
        searchStatus() {
            // 'Open','Closed','Cancelled'
            this.detail = this.cloneDetail.filter(rec => rec.status == this.status)
        },

        async viewOrder(item) {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", item.orderNo));
                docRef.forEach(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("Order No is not correct...\nPlease Try again")
                        this.$refs.orderNo.focus()
                    } else {
                        this.showViewOrder = true
                        let doc = querySnapshot.docs[0].data()
                        let docId = querySnapshot.docs[0].id

                        this.orderId = docId
                        this.orderNo = doc.orderNo
                        this.orderDate = doc.orderDate.substr(0, 10)
                        this.code = doc.code
                        this.name = doc.name
                        this.address = doc.address
                        this.poRef = doc.poRef
                        this.contact = doc.contact
                        this.tel = doc.tel
                        this.orderDetails = doc.detail
                        this.shipAdd = doc.shipAdd
                        this.shipDate = doc.shipDate
                        this.district = doc.district
                        this.countPayment = doc.countPayment
                        this.disc = doc.disc
                        this.remark = doc.remark
                    }
                })
        },

        // Open dialog for edit order status
        async editItem(item) {
            this.showEdit = true
            this.$nextTick(() => { this.$refs.focusShipAdd.focus() })
            this.editOrder.orderNo = item.orderNo
            this.editOrder.orderDate = item.orderDate.substr(0, 10)
            this.editOrder.code = item.code
            this.editOrder.name = item.name
            this.editOrder.shipAdd = item.shipAdd
            this.editOrder.shipDate = item.shipDate
            this.editOrder.remark = item.remark
            this.editOrder.status = item.status
            this.editOrder.poRef = item.poRef
            const db  = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", this.editOrder.orderNo));
                docRef.forEach(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.idOrder = docId
                })
                // .catch(function (error) {
                //     console.log("Error getting documents: ", error)
                // })
        },

        // Update order status in the database
        saveEdit() {
            const db = getFirestore()
            addDoc(collection(db, "order"). doc(this.idOrder). update({
                poRef: this.editOrder.poRef,
                shipAdd: this.editOrder.shipAdd,
                shipDate: this.editOrder.shipDate,
                remark: this.editOrder.remark,
                status: this.editOrder.status
            }))
                .then(() => {
                    this.closeEdit()
                    alert("Update successfully.")
                })
        },

        // Close dialog
        closeEdit() {
            this.editOrder.orderNo = ''
            this.editOrder.orderDate = ''
            this.editOrder.code = ''
            this.editOrder.name = ''
            this.editOrder.shipAdd = ''
            this.editOrder.shipDate = new Date().toISOString().substr(0, 7)
            this.editOrder.remark = ''
            this.editOrder.status = []
            this.showEdit = false
        },

        // Print order
        async printOrder(item) {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", item.orderNo));
                docRef.forEach(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.idOrder = docId
                    // console.log(this.idOrder)
                    addDoc(collection(db, "order").doc(this.idOrder).update({
                        printed: item.printed + 1
                    }))
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'orderReport', query: { orderNo: item.orderNo } })
                            window.open(routeData.href, "_blank")
                        })
                })
                // .catch(function (error) {
                //     console.log("Error getting documents: ", error)
                // })
        },

        // Print pro1 order
        async printPro1(item) {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", item.orderNo));
                docRef.forEach(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.idOrder = docId
                    // console.log(this.idOrder)
                    addDoc(collection(db, "order").doc(this.idOrder).update({
                        printed: item.printed + 1
                    }))
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'orderproreport', query: { orderNo: item.orderNo } })
                            window.open(routeData.href, "_blank")
                        })
                })
                // .catch(function (error) {
                //     console.log("Error getting documents: ", error)
                // })
        },

        // Print delivery order
        async printDO(item) {
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", item.orderNo));
                docRef.forEach(querySnapshot => {
                    let docId = querySnapshot.docs[0].id
                    this.idOrder = docId
                    addDoc(collection(db, "order").doc(this.idOrder).update({
                        printed: item.printed + 1
                    }))
                        .then(() => {
                            let routeData = this.$router.resolve({ name: 'orderReportDO', query: { orderNo: item.orderNo } })
                            window.open(routeData.href, "_blank")
                        })
                })
                // .catch(function (error) {
                //     console.log("Error getting documents: ", error)
                // })
        }
    },
    computed: {

        // Calculate total
        sumTotal() {
            return this.orderDetails.reduce((total, item) => total + (item.amt), 0)
        },
    },
    async mounted() {
        let nextMonth = new Date(this.searchMonth)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth = nextMonth.toISOString().substr(0, 7)
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "order"), where("orderDate", ">", this.searchMonth), where("orderDate", "<", nextMonth))
            docRef.forEach(() => {
                this.detail = []
                this.cloneDetail = []
                docRef.forEach(doc => {
                    this.detail.push(doc.data())
                })
                this.cloneDetail = this.detail
            })
    }
}
</script>
<style scoped>
.down {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid black;
}

.border {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    padding: 0.5%;
}

.line {
    border-bottom: 1px solid black;
    text-align: right;
    width: 100%;
}

.lineShipAdd {
    border-bottom: 1px solid black;
    /* text-align: right; */
    width: 100%;
}

.lineDate {
    border-bottom: 1px solid black;
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
</style>
