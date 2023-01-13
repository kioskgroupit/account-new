<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Report General Ledger</h1>
                  
                    <hr>
                    <!-- Search report -->
                    <div>
                        <v-layout justify-center>
                            <v-flex xs2 d-flex justify-end my-4>
                                <h3>Account id:</h3>
                            </v-flex>
    
                            <v-flex xs1 pa-1 px-2>
                                <v-text-field v-model="accId" ref="focusAccId"
                                    @keypress.enter="searchAcc()"></v-text-field>
                                <!-- <v-text-field :value="'110001'" ref="focusAccId" @keypress.enter="searchAcc()"></v-text-field> -->
                            </v-flex>
                                <v-flex xs2 d-flex justify-end my-4>
                                    <h3>Account name:</h3>
                                </v-flex>
                            <v-flex xs3 pa-1 px-1>
                                <v-text-field v-model="accName" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs2 mt-1>
                                <v-menu v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="startDate" label="Start date:" prepend-icon="mdi-calendar"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="startDate" @input="menuStartDate = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs2 mt-1>
                                <v-menu v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="endDate" label="Ending date:" prepend-icon="mdi-calendar"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="endDate" @input="menuEndDate = false" :min="startDate"
                                        :max="nowDate"></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex>
                                <v-btn fab small color="indigo lighten-1" dark
                                    @click="searchReport"><v-icon>mdi-magnify</v-icon></v-btn>
                            </v-flex>
                        </v-layout>

                        <!-- Show account info from the search in database -->
                        <v-dialog v-model="showSearch" max-width="600px">
                            <v-card>
                                <v-card-text>
                                    <v-data-table :headers="headers" :items="chartAccount" class="elevation-1"
                                        v-bind:pagination.sync="pagination">
                                        <template v-slot:items="props">
                                            <td>{{ props.item.accId }}</td>
                                            <td>{{ props.item.accName }}</td>
                                            <td class="justify-center layout px-0">
                                                <v-tooltip right>
                                                    <template v-slot:activator="{ on }">
                                                        <v-icon class="mr-1" @click="selectAcc(props.item)"
                                                            v-on="on">check_circle_outline</v-icon>
                                                    </template>
                                                    <span>Choose this general ledger account number</span>
                                                </v-tooltip>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </div>
                    <hr>

                    <!-- Detail report gl -->
                    <div v-if="showDetial">

                        <!-- Report gl detail -->
                        <div>
                            <v-layout>
                                <v-flex xs10 text-xs-right pr-4>
                                    <font color="red">B/F:</font>
                                </v-flex>
                                <v-flex pr-4>
                                    <font color="red">
                                        <vue-numeric :value="balance.toString()" separator="," :precision="2"
                                            class="numericBalance" disabled></vue-numeric>
                                    </font>
                                </v-flex>
                            </v-layout>
                        </div>
                        <hr>
                        <div>
                            <v-data-table :headers="headerDetail" :items="detail" class="elevation-1"
                                v-bind:pagination.sync="paginationDetail">
                                <template v-slot:items="props">
                                    <td>{{ props.item.glDate.substr(0, 10) }}</td>
                                    <td>{{ props.item.glNo }}</td>
                                    <td>{{ props.item.desc }}</td>
                                    <td class="text-xs-right">
                                        {{ props.item.debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                    </td>
                                    <td class="text-xs-right">
                                        {{
                                            props.item.credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                                ",")
                                        }}</td>
                                    <td class="text-xs-right">
                                        {{
                                            props.item.balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                                ",")
                                        }}</td>
                                </template>
                                <template v-slot:footer>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><strong>Total:</strong></td>
                                    <td class="text-xs-right">
                                        <strong>{{
                                            net.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                                ",")
                                        }}</strong></td>
                                </template>
                            </v-data-table>
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
            nowDate: new Date().toISOString().slice(0, 10),
            accId: '',
            accName: '',
            showSearch: false,
            chartAccount: [],
            headers: [
                { text: 'Account code', align: 'left', value: 'accId' },
                { text: 'Account name', sortable: false, align: 'left' }
            ],
            pagination: { 'sortBy': 'accId' },
            menuStartDate: false,
            startDate: new Date().toISOString().substr(0, 10),
            menuEndDate: false,
            endDate: new Date().toISOString().substr(0, 10),

            showDetial: false,
            headerDetail: [
                { text: 'Date', align: 'left', value: 'glDate' },
                { text: 'General Ledger no', sortable: false, align: 'left' },
                { text: 'Description', sortable: false, align: 'left' },
                { text: 'Debit', sortable: false, align: 'right' },
                { text: 'Credit', sortable: false, align: 'right' },
                { text: 'Balance', sortable: false, align: 'right' },
            ],
            paginationDetail: { 'sortBy': 'glDate', 'descending': false },
            balance: 0,
            detail: []
        }
    },
    methods: {

        // Show account info from the search in the database
        searchAcc() {
            let app = this
            if (this.accId == '') {
                alert("Please input Account code.")
                this.$refs.focusAccId.focus()
            }
            else {
                db.collection("chartAccount").orderBy("accId").startAt(this.accId).endAt(this.accId + "\uf8ff").get()
                    .then(querySnapshot => {
                        app.chartAccount = []
                        querySnapshot.forEach(doc => {
                            let searchDoc = doc.data()
                            app.chartAccount.push(searchDoc)
                        })
                        if (app.chartAccount.length == 0) {
                            app.showSearch = false
                            alert("This account code is not in the system......")
                        }
                        else {
                            app.showSearch = true
                        }
                    })
            }
        },

        // Select data from the search in database
        selectAcc(item) {
            this.accId = item.accId
            this.accName = item.accName
            this.showSearch = false
        },

        // Search gl report from accId by start date to end date in the database
        searchReport() {
            this.showDetial = false
            this.balance = 0
            let app = this
            let year = this.startDate.substr(0, 4)
            db.collection("generalLedger").where("accId", "==", this.accId)
                .where("glDate", ">", year + "-01")
                .where("glDate", "<", this.startDate).get()
                .then(query => {
                    let debit = 0
                    let credit = 0
                    query.forEach(doc => {
                        debit += doc.data().debit
                        credit += doc.data().credit
                    })
                    this.balance = debit - credit
                    db.collection("generalLedger").where("accId", "==", this.accId).orderBy("glDate").where("glDate", ">=", this.startDate)
                        .where("glDate", "<=", this.endDate).get()
                        .then(snapshot => {
                            app.detail = []
                            let bala = app.balance
                            snapshot.forEach(doc => {
                                let data = doc.data()
                                bala = bala * 1 + (data.debit - data.credit)
                                app.detail.push({ ...data, balance: bala })
                            })
                            if (app.detail.length == 0) {
                                alert("Data not found.\nPlease try again.")
                            }
                            else {
                                app.showDetial = true
                            }
                        })
                })
        },

        test() {
            this.showDetial = false
            this.balance = 0
            let app = this
            let minus = this.startDate.substr(5, 2) * 1 - 1
            let plus = this.startDate.substr(5, 2) * 1 + 1
            let year = new Date().toISOString().substr(0, 4)
            let monthMinus = (minus < 10 ? '0' : '') + minus
            let monthPlus = year + "-" + (plus < 10 ? '0' : '') + plus
            if (this.startDate.substr(0, 7) < monthPlus) {
                db.collection("accBalance").doc(year).get()
                    .then(doc => {
                        app.balance = doc.data()[app.accId][monthMinus]
                    })
            }

            let lastMonth = this.startDate.substr(0, 7)
            db.collection("generalLedger").where("accId", "==", this.accId).orderBy("glDate").where("glDate", ">=", lastMonth + "-" + "01")
                .where("glDate", "<", this.startDate).get()
                .then(query => {
                    let data = []
                    query.forEach(doc => {
                        data = doc.data()
                        app.balance += data.debit - data.credit
                    })
                    db.collection("generalLedger").where("accId", "==", this.accId).orderBy("glDate").where("glDate", ">=", this.startDate)
                        .where("glDate", "<=", this.endDate).get()
                        .then(snapshot => {
                            app.detail = []
                            let bala = app.balance
                            snapshot.forEach(doc => {
                                let data = doc.data()
                                bala = bala * 1 + (data.debit - data.credit)
                                app.detail.push({ ...data, balance: bala })
                            })
                            if (app.detail.length == 0) {
                                alert("Data not found.\nPlease try again.")
                            }
                            else {
                                app.showDetial = true
                            }
                        })
                })
        },

    },
    computed: {

        total() {
            return this.detail.reduce((total, item) => total + (item.debit - item.credit), 0)
        },

        net() {
            return this.total + this.balance * 1
        }
    },
    mounted() {
        this.$nextTick(() => { this.$refs.focusAccId.focus() })
    }
}
</script>

<style scoped>
.padDing {
    padding: 0.5%;
}

.txtCenter {
    text-align: center;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid black;
    padding: 1.5%;
}

.numericBalance {
    text-align: right;
    width: 100%;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}
</style>
