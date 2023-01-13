
<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Cash Payment Book</h1>

                    <hr>
                    <br>

                    <!-- Search month in database -->
                    <v-layout justify-center green lighten-1>
                        <v-flex xs2 px-4>
                            <v-menu v-model="menuCashBookDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="searchMonth" color="white" label="Select Month:"
                                        prepend-icon="mdi-calendar" v-on="on" dark></v-text-field>
                                </template>
                                <v-date-picker v-model="searchMonth" color="green" @input="menuCashBookDate = false"
                                    :max="nowDate" type="month" @change="searchDate"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>

                    <!-- Add new cash payment book -->
                    <v-layout>
                        <v-flex xs1 my-2>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn fab small color="success" v-on="on" @click="newCashBook"><v-icon
                                            dark>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>Add new cash payment book</span>
                            </v-tooltip>
                            <v-dialog v-model="dialogNew" persistent max-width="600px">
                                <v-card>
                                    <v-card-text>
                                        <span class="headline">New Cash Payment Book</span>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs4>
                                                    <!-- <v-text-field color="success" v-model="date" label="Date:" readonly prepend-icon="event" 
                                                    tabindex="-1"></v-text-field> -->
                                                    <v-menu v-model="menuDate" :close-on-content-click="false"
                                                        :nudge-right="40" lazy transition="scale-transition" offset-y
                                                        full-width min-width="290px" color="success">
                                                        <template v-slot:activator="{ on }" color="success">
                                                            <v-text-field v-model="date" label="Date:"
                                                                prepend-icon="event" readonly v-on="on"
                                                                color="success"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="date" @input="menuDate = false"
                                                            color="success" @change="getRefNo"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                                <v-flex xs5>
                                                    <v-text-field color="success" v-model="refNo" label="Ref no:"
                                                        readonly tabindex="-1"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-text-field color="success" v-model="desc" label="Description:"
                                                        ref="focusDesc"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs8>
                                                    <v-select :items="itemPayMent" v-model="payMent" label="Payment:"
                                                        ref="payMent" color="success"></v-select>
                                                </v-flex>
                                                <v-flex pt-4 text-xs-right>
                                                    <font size=3>Amount:</font>
                                                </v-flex>
                                                <v-flex xs5 pt-3>
                                                    <font size=3><vue-numeric separator="," :precision="2"
                                                            class="newNumeric" v-model="Amt"></vue-numeric></font>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" flat @click="clearNewCashpay">Cancel</v-btn>
                                        <v-btn color="green darken-1" flat @click="addCashpay">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>

                    <!-- Cash payment book detail -->
                    <v-layout>
                        <v-flex>
                            <v-data-table :headers="headerAccDetail" :items="detail" class="elevation-1"
                                v-bind:pagination.sync="pagination" :rows-per-page-items="rowsPerPageItems">
                                <template v-slot:no-data>
                                    <v-progress-linear v-slot:progress color="success"
                                        indeterminate></v-progress-linear>
                                </template>
                                <template v-slot:items="props">
                                    <td class="text-xs-left">{{ props.item.date.substr(0, 10) }}</td>
                                    <td>{{ props.item.refNo }}</td>
                                    <td>{{ props.item.desc }}</td>
                                    <td class="text-xs-right">
                                        {{ props.item.Amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                    </td>
                                    <td class="text-xs-left">{{ props.item.payMent }}</td>
                                    <td class="text-xs-left">
                                        {{ props.item.pvNo }}
                                        <v-icon v-if="(props.item.pvNo).length == 0" small class="mr-1"
                                            @click="openPV(props.item)">edit</v-icon>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
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
            menuDate: false,
            nowDate: new Date().toISOString().slice(0, 10),
            menuCashBookDate: false,
            searchMonth: new Date().toISOString().substr(0, 7),
            headerAccDetail: [
                { text: 'Account date', value: 'date' },
                { text: 'Ref no', value: 'refNo' },
                { text: 'Description', sortable: false, },
                { text: 'Amount', sortable: false, align: 'right' },
                { text: 'Payment', sortable: false, align: 'left' },
                { text: 'PV no', sortable: false, },
            ],
            rowsPerPageItems: [50, 100, 200, 500],
            pagination: { 'sortBy': 'date', 'descending': true },
            detail: [],
            dialogNew: false,
            date: new Date().toISOString().substr(0, 10),
            subTime: new Date().toTimeString().substr(0, 8),
            refNo: '',
            desc: '',
            itemPayMent: [],
            payMent: '',
            Amt: 0,
        }
    },
    methods: {
        // Search cash received book from searchDate
        searchDate() {
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            let app = this
            db.collection("cashPayBook").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
                .onSnapshot(function (querySnapshot) {
                    app.detail = []
                    let i = 0
                    querySnapshot.forEach(function (doc) {
                        app.detail.push({ ...doc.data(), id: querySnapshot.docs[i].id })
                        i++
                    })
                })
        },
        // Open new cash payment
        newCashBook() {
            let year = this.date.substr(0, 4)
            let subYear = this.date.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().cp + 1
                    if (typeDoc <= 99999) {
                        typeDoc = ("0000" + typeDoc).slice(-5)
                    }
                    this.refNo = subYear + typeDoc
                })
            db.collection("chartAccount").where("cash", "==", "Y").get()
                .then(payment => {
                    this.itemPayMent = []
                    payment.forEach(doc => {
                        let readDoc = doc.data().accName
                        this.itemPayMent.push(readDoc)
                    })
                })
            this.dialogNew = true
            this.$nextTick(() => { this.$refs.focusDesc.focus() })
        },
        // Get refNo from date
        getRefNo() {
            let year = this.date.substr(0, 4)
            let subYear = this.date.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().cp + 1
                    if (typeDoc <= 99999) {
                        typeDoc = ("0000" + typeDoc).slice(-5)
                    }
                    this.refNo = subYear + typeDoc
                })
        },
        // Clear new cash payment
        clearNewCashpay() {
            this.dialogNew = false
            this.date = new Date().toISOString().substr(0, 10)
            this.refNo = ''
            this.desc = ''
            this.payMent = []
            this.Amt = 0
            this.pay = 0
        },
        // Add new cash payment book
        addCashpay() {
            if (this.payMent == '') {
                alert("Please enter description.")
                this.$nextTick(() => { this.$refs.focusPayment.focus() })
            }
            else if (this.Amt == 0) {
                alert("Please enter amount.")
            }
            else {
                let year = this.date.substr(0, 4)
                let DocRef = db.collection("counter").doc(year)
                db.runTransaction((transaction) => {
                    return transaction.get(DocRef).then((Doc) => {
                        if (!Doc.exists) {
                            throw "Document does not exist!"
                        }
                        let newRefNo = Doc.data().cp + 1
                        transaction.update(DocRef, {
                            cp: newRefNo
                        })
                    })
                })
                    .then(() => {
                        db.collection("cashPayBook").add({
                            date: this.date + " " + this.subTime,
                            refNo: this.refNo,
                            desc: this.desc,
                            payMent: this.payMent,
                            Amt: this.Amt * 1,
                            pvNo: ''
                        })
                            .then(() => {
                                alert("Add new cash payment success.")
                                this.clearNewCashpay()
                            })
                    })
            }
        },
        // Send info to new page for create PV
        openPV(item) {
            let routeData = this.$router.resolve({
                name: 'newpv', query:
                {
                    id: item.id,
                    date: item.date.substr(0, 10),
                    refNo: item.refNo,
                    desc: item.desc,
                    payMent: item.payMent,
                    Amt: item.Amt,
                }
            })
            window.open(routeData.href, '_blank')
        }
    },
    mounted() {
        let nextMonth = new Date(this.searchMonth)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth = nextMonth.toISOString().substr(0, 7)
        let app = this
        db.collection("cashPayBook").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
            .onSnapshot(querySnapshot => {
                app.detail = []
                let i = 0
                querySnapshot.forEach(doc => {
                    app.detail.push({ ...doc.data(), id: querySnapshot.docs[i].id })
                    i++
                })
            })
    }
}
</script>
<style scoped>
.newNumeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    padding: 2%;
    padding-top: 4.6%;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    padding: 2%;
    padding-top: 2%;
}
</style>