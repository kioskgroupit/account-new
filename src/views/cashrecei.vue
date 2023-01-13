
<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Cash Received Book</h1>
               
                    <hr>
                    <br>

                    <!-- Search month in database -->
                    <v-layout justify-center indigo lighten-2>
                        <v-flex xs2 px-4>
                            <v-menu v-model="menuCashBookDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="searchMonth" color="white" label="Select Month:"
                                        prepend-icon="mdi-calendar" v-on="on" dark></v-text-field>
                                </template>
                                <v-date-picker v-model="searchMonth" color="indigo" @input="menuCashBookDate = false"
                                    :max="nowDate" type="month" @change="searchDate()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>

                    <!-- Add new cash received book -->
                    <v-layout>
                        <v-flex xs1 my-2>
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn fab small color="primary" v-on="on" @click="newCashBook()"><v-icon dark>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>Add new cash received book</span>
                            </v-tooltip>
                            <v-dialog v-model="dialogNew" persistent max-width="600px">
                                <v-card>
                                    <v-card-title class="headline">New Cash Received Book</v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs4>
                                                    <!-- <v-text-field v-model="date" label="Date:" readonly tabindex="-1"></v-text-field> -->
                                                    <v-menu v-model="menuDate" :close-on-content-click="false"
                                                        :nudge-right="40" lazy transition="scale-transition" offset-y
                                                        full-width min-width="290px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-model="date" label="Date:"
                                                                prepend-icon="mdi-canlendar" readonly v-on="on"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="date"
                                                            @input="menuDate = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <v-text-field v-model="refNo" label="Ref no:"
                                                        ref="focusRefNo"></v-text-field>
                                                </v-flex>
                                                <v-flex xs5>
                                                    <v-text-field v-model="custCode" label="Customer code:"
                                                        ref="focusCustCode"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-text-field v-model="desc" label="Description:"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex pt-4>
                                                    <font size=3>Total:</font>
                                                </v-flex>
                                                <v-flex xs6 pt-4>
                                                    <font size=3><vue-numeric ref="focusAmt" separator=","
                                                            :precision="2" class="numeric" v-model="Amt"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                                <v-flex pt-4>
                                                    <font size=3>Discount:</font>
                                                </v-flex>
                                                <v-flex xs6 pt-4>
                                                    <font size=3><vue-numeric separator="," :precision="2"
                                                            class="numeric" v-model="disc"></vue-numeric></font>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex pt-4>
                                                    <font size=3>Net:</font>
                                                </v-flex>
                                                <v-flex xs5 pt-4>
                                                    <font size=3><vue-numeric separator="," :precision="2"
                                                            class="numeric" :value="Amt - disc" disabled></vue-numeric>
                                                    </font>
                                                </v-flex>
                                                <v-flex xs7>
                                                    <v-select :items="itemPayMent" v-model="payMent" label="Payment:"
                                                        ref="payMent"></v-select>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" flat @click="clearAddCashbook()">Cancel</v-btn>
                                        <v-btn color="blue darken-1" flat @click="addCashBook()">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>

                    <!-- Show detail cash received book -->
                    <div>

                        <!-- Detail cash received book -->
                        <v-data-table :headers="headers" :items="detail" class="elevation-1"
                            v-bind:pagination.sync="pagination" :rows-per-page-items="rowsPerPageItems">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td class="text-xs-left">{{ props.item.date.substr(0, 10) }}</td>
                                <td class="text-xs-left">{{ props.item.type }}{{ props.item.refNo.toString() }}</td>
                                <td class="text-xs-left">{{ props.item.custCode }}</td>
                                <td>{{ props.item.desc }}</td>
                                <td class="text-xs-right">
                                    {{ props.item.Amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td class="text-xs-right">
                                    {{ props.item.disc.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                <td class="text-xs-right">{{(props.item.Amt -
                                props.item.disc).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</td>
                                <td class="text-xs-left">{{ props.item.payMent }}</td>
                                <td class="text-xs-left">
                                    {{ props.item.rvNo }}
                                    <v-icon v-if="(props.item.rvNo).length == 0" small class="mr-1"
                                        @click="openRV(props.item)">edit</v-icon>
                                </td>
                            </template>
                        </v-data-table>

                        <!-- Edit detail cash received book -->
                        <v-dialog v-model="dialog" persistent max-width="1280px">
                            <v-card>
                                <v-card-title class="headline">Edit Cash Received Book</v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.date" label="Date:"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.refNo" label="Ref no:"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.custCode"
                                                    label="Customer code:"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.desc"
                                                    label="Description:"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.Amt" label="Amount:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.disc" label="Disc:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.down" label="Down payment:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.cash" label="Cash:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.check" label="Check:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.transfer" label="Transfer:"
                                                    reverse></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md4>
                                                <v-text-field v-model="editedItem.rvNo" label="RV no:"></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
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
// eslint-disable-next-line
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
            idCashbook: '',
            dialog: false,
            dialogNew: false,
            menuCashBookDate: false,
            menuDate: false,
            showDetail: false,
            subTime: new Date().toTimeString().substr(0, 8),
            nowDate: new Date().toISOString().slice(0, 10),

            searchMonth: new Date().toISOString().substr(0, 7),
            date: new Date().toISOString().substr(0, 10),
            type: '',
            refNo: '',
            custCode: '',
            desc: '',
            Amt: '',
            disc: '',
            down: '',
            itemPayMent: [],
            payMent: '',
            rvNo: '',
            showRvNo: false,

            detail: [],
            rowsPerPageItems: [50, 100, 200, 500],
            pagination: { 'sortBy': 'date', 'descending': true },
            headers: [
                { text: 'Date', align: 'left', value: 'date' },
                { text: 'Ref no', sortable: false, align: 'left' },
                { text: 'Customer code', sortable: false, align: 'left' },
                { text: 'Description', sortable: false, align: 'left' },
                { text: 'Total', sortable: false, align: 'right' },
                { text: 'Disc', sortable: false, align: 'right' },
                { text: 'Net Amount', sortable: false, align: 'right' },
                { text: 'Payment', sortable: false, align: 'left' },
                { text: 'RV no.', sortable: false, align: 'left' },
                // { text: 'Actions', sortable: false }
            ],
            itemType: [
                { id: 'rv', name: 'RV' },
                { id: 'in', name: 'IN' },
            ],
            editIndex: -1,
            editedItem: {
                date: '',
                refNo: '',
                custCode: '',
                desc: '',
                Amt: 0,
                disc: 0,
                down: 0,
                payMent: '',
                rvNo: '',
            },
        }
    },
    methods: {
        // Focus when select order type in new cash received
        changeFocusRefNo() {
            this.$refs.refNo.focus()
        },
        // Search cash received book from searchDate
        searchDate() {
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            let app = this
            db.collection("cashReceiBook").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
                .onSnapshot(function (querySnapshot) {
                    app.detail = []
                    let i = 0
                    querySnapshot.forEach(function (doc) {
                        app.detail.push({ ...doc.data(), id: querySnapshot.docs[i].id })
                        i++
                    })
                })
        },
        // 
        newCashBook() {
            this.dialogNew = true
            db.collection("chartAccount").where("cash", "==", "Y").get()
                .then(payment => {
                    this.itemPayMent = []
                    payment.forEach(doc => {
                        let readDoc = doc.data().accName
                        this.itemPayMent.push(readDoc)
                    })
                })
            this.$nextTick(() => { this.$refs.focusRefNo.focus() })
        },
        // Add new cash received book
        addCashBook() {
            let haveError = false
            let msg = ''
            if (this.refNo == "") {
                haveError = true
                msg = 'Please input ref no.'
            }
            if (this.Amt == "") {
                haveError = true
                msg += '\nPlease input amount.'
            }
            if (this.payMent == "") {
                haveError = true
                msg += '\nPlease select payment.'
            }
            if (haveError) {
                alert(msg)
            }
            else {
                db.collection("cashReceiBook").add({
                    date: this.date + " " + this.subTime,
                    // type: this.type,
                    refNo: this.refNo,
                    // refNo: this.type + this.refNo,
                    custCode: this.custCode.toUpperCase(),
                    desc: this.desc,
                    Amt: this.Amt * 1,
                    disc: this.disc * 1,
                    payMent: this.payMent,
                    rvNo: ''
                })
                    .then(() => {
                        alert("Add successful.....")
                        this.clearAddCashbook()
                        this.dialogNew = false
                    })
            }
        },
        // Clear new cash received book
        clearAddCashbook() {
            this.date = new Date().toISOString().substr(0, 10)
            this.type = []
            this.refNo = ''
            this.custCode = ''
            this.desc = ''
            this.Amt = ''
            this.disc = ''
            this.down = ''
            this.payMent = []
            this.dialogNew = false
        },
        editItem(item) {
            this.editedIndex = this.detail.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            db.collection("cashReceiBook").where("refNo", "==", this.editedItem.refNo).get()
                .then(querySnapshot => {
                    let docIdCashbook = querySnapshot.docs[0].id
                    this.idCashbook = docIdCashbook
                    // console.log(docIdCashbook)
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        // Close new cash received book
        close() {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        // Edit cash received book
        save() {
            db.collection('cashReceiBook').doc(this.idCashbook).update({
                date: this.editedItem.date,
                refNo: this.editedItem.refNo,
                custCode: this.editedItem.custCode,
                desc: this.editedItem.desc,
                Amt: this.editedItem.Amt * 1,
                disc: this.editedItem.disc * 1,
                down: this.editedItem.down * 1,
                cash: this.editedItem.cash * 1,
                check: this.editedItem.check * 1,
                transfer: this.editedItem.transfer * 1,
                // rvNo: this.editedItem.rvNo,
            })
                .then(() => {
                    this.close()
                    alert("Update successful.....")
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Update failed.....");
                });
        },
        // Send info to new page for create RV
        openRV(item) {
            let routeData = this.$router.resolve({
                name: 'newrv', query:
                {
                    id: item.id,
                    type: item.type,
                    date: item.date,
                    refNo: item.refNo,
                    custCode: item.custCode,
                    desc: item.desc,
                    payMent: item.payMent,
                    Amt: item.Amt - item.disc,
                }
            })
            window.open(routeData.href, '_blank')
        },
    },
    mounted() {
        let nextMonth = new Date(this.searchMonth)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth = nextMonth.toISOString().substr(0, 7)
        let app = this
        db.collection("cashReceiBook").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
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
.inputCust {
    height: 30px;
    padding: 13px 10px;
    display: inline-block;
    border-bottom: 1px solid black;
}

.padDing {
    padding: 0.5%;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    padding: 1.4%;
}
</style>