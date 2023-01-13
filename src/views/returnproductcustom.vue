<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <v-layout>
                        <v-flex>
                            <h1 class="pt-2 pb-1">Retrun Products</h1>
                        </v-flex>
                    </v-layout>
                    <hr>
                    <v-layout justify-end>
                        <v-flex xs2 text-xs-right>
                            <v-text-field label="Return no:" v-model="dnNo" readonly tabindex="-1"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-end>
                        <v-flex xs2>
                            <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="Date:" prepend-icon="mdi-calendar" v-on="on"
                                        readonly></v-text-field>
                                </template>
                                <v-date-picker v-model="date" @input="menuDate = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-end>
                        <v-flex xs2 text-xs-right>
                            <v-text-field label="Invocie no:" v-model="invNo" ref="invNo"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-center>
                        <v-flex xs2>
                            <v-select :items="itemsWarehouse" v-model="warehouse" label="Warehouse:"></v-select>
                        </v-flex>
                    </v-layout>

                    <!-- Header product detail -->
                    <v-layout pt-2 pb-2 indigo lighten-4>
                        <v-flex xs1 ml-1 mr-2><strong>No</strong></v-flex>
                        <v-flex xs3 mr-3><strong>Model</strong></v-flex>
                        <v-flex xs1 mr-2 pr-1 text-xs-center><strong>Frame</strong></v-flex>
                        <v-flex xs1 mr-2 text-xs-center><strong>Front</strong></v-flex>
                        <v-flex xs3 mr-3><strong>Quality control</strong></v-flex>
                        <v-flex xs2 mr-2 text-xs-right><strong>Amount</strong></v-flex>
                        <v-flex xs2></v-flex>
                    </v-layout>
                    <hr>
                    <!-- <v-layout wrap v-for="(item,i) in detail" :key="i" collapse>
                        <v-flex xs1 ml-1 mr-2>
                            <v-text-field :value="i+1" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs3 mr-2>
                            <v-text-field v-model="item.Code" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs1 mr-2 v-if="!item.subProd">
                            <v-select :items="itemFrame" v-model="item.frame" ref="frame"></v-select>
                        </v-flex>
                        <v-flex xs1 mr-2 v-if="!item.subProd">
                            <v-select :items="itemFront" v-model="item.front" ref="front"></v-select>
                        </v-flex>
                        <v-flex xs3 mr-2 v-if="!item.subProd">
                            <v-autocomplete :items="item.itemQC" v-model="item.qc" ref="qc" @change="onChangeQC(item)"
                                :color="!item.qc ? 'red' : 'primary'"></v-autocomplete>
                        </v-flex>
                        </v-layout> -->
                    <v-layout wrap v-for="(item, i) in detail" :key="i" collapse>
                        <v-flex xs1 ml-1 mr-2>
                            <v-text-field :value="i + 1" readonly tabindex="-1"></v-text-field>
                        </v-flex>
                        <v-flex xs3 mr-2>
                            <v-text-field :item="item.Code" v-model="item.Code" ref="Code"
                                @keypress.enter="getProd(item, i)" @input="uppercase(item)"></v-text-field>
                        </v-flex>
                        <v-flex xs1 mr-2 v-if="!item.subProd">
                            <v-text-field :item="item.frame" v-model="item.frame" ref="frame" tabindex="-1"
                                readonly></v-text-field>
                        </v-flex>
                        <v-flex xs1 mr-2 v-if="!item.subProd">
                            <v-text-field :item="item.front" v-model="item.front" ref="front" tabindex="-1"
                                readonly></v-text-field>
                        </v-flex>
                        <v-flex xs3 mr-2 v-if="!item.subProd">
                            <v-text-field v-model="item.qc" ref="qc" @input="upperQC(item)"
                                :color="!item.qc ? 'red' : 'primary'" @keypress.enter="getQC(item)"></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-btn fab small color="primary" @click="addSubProd" tabindex="-1" v-if="item.subProd">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                            <v-btn fab small color="primary" @click="addSubProd" tabindex="-1" v-if="!item.subProd"
                                :disabled="!item.Code || !item.frame || !item.front || !item.qc">
                                <v-icon dark>add</v-icon>
                            </v-btn>
                            <v-btn :disabled="detail.length == 1" fab small color="error" @click="delProd(item)"
                                tabindex="-1">
                                <v-icon dark>remove</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-layout v-for="(item, j) in item.subProd" :key="j">
                            <v-flex xs1 ml-1 mr-2></v-flex>
                            <v-flex xs3 mr-2>
                                <v-text-field v-model="item.subCode" :readonly="j != detail[i].subProd.length - 1"
                                    ref="subCode" tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs1 mr-2>
                                <v-text-field v-model="item.frame" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs1 mr-2>
                                <v-text-field v-model="item.front" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs3 mr-2>
                                <v-text-field v-model="item.qc" ref="qc" @input="upperQC(item)"
                                    :color="!item.qc ? 'red' : 'primary'"
                                    @keypress.enter="getSupQC(item)"></v-text-field>
                            </v-flex>
                            <v-flex>
                                <!-- <v-btn fab small color="primary" @click="addSubCode(i)" 
                                :disabled="item.subCode == '' || !item.qc || j != detail[i].subProd.length - 1">
                                    <v-icon dark>add</v-icon>
                                </v-btn> -->
                                <!-- <v-btn fab small color="error" @click="delSubCode(item,i)" tabindex="-1">
                                    <v-icon dark>remove</v-icon>
                                </v-btn> -->
                            </v-flex>
                        </v-layout>
                    </v-layout>
                    <hr>
                    <br>

                    <!-- Button save and cancel -->
                    <v-layout align-center column>
                        <v-flex>
                            <v-btn class="mr-2" @click="openGL">
                                <v-icon dark>mdi-content-save</v-icon>
                                Save
                            </v-btn>
                            <v-btn class="ml-2" @click="cancelPage">
                                <v-icon dark>mdi-close</v-icon>
                                Cancel
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>

            <v-dialog v-model="dialogGl" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dark color="indigo">
                    </v-toolbar>
                    <v-container fluid>
                        <v-card>
                            <v-card-text>
                                <h1>General Ledger</h1>
                                <hr>
                                <v-layout>
                                    <v-flex xs12 text-xs-right my-4>
                                        <h3>Gl no:</h3>
                                    </v-flex>
                                    <v-flex xs2 pa-1>
                                        <v-text-field v-model="glNo" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- Select gl date -->
                                <v-layout justify-end>
                                    <v-flex xs2>
                                        <v-text-field v-model="dateGl" label="Date:" prepend-icon="event"
                                            readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- Select ref no -->
                                <v-layout justify-end>
                                    <v-flex xs1>
                                        <v-text-field v-model="refNo" label="Ref no:" ref="refNo"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <br>
                                <!-- Input Description -->
                                <v-layout>
                                    <v-flex xs4 text-xs-right my-3>
                                        <h3>Description:</h3>
                                    </v-flex>
                                    <v-flex xs4 pa-1 px-2>
                                        <v-text-field v-model="desc" single-line solo ref="desc"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- Header account detail -->
                                <hr>
                                <v-layout ma-2>
                                    <v-flex text-xs-center pr-2>
                                        <h4>No.</h4>
                                    </v-flex>
                                    <v-flex xs2 pl-1>
                                        <h4>Acc code</h4>
                                    </v-flex>
                                    <v-flex xs3 pl-1>
                                        <h4>Acc name</h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right>
                                        <h4>Debit</h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right>
                                        <h4>Credit</h4>
                                    </v-flex>
                                    <v-flex xs2 text-xs-center>
                                        <h4>Remark</h4>
                                    </v-flex>
                                    <v-flex xs2></v-flex>
                                </v-layout>
                                <hr>
                                <!-- Account detail -->
                                <v-layout v-for="(item, i) in detailAcc" :key="i" collapse>
                                    <v-flex my-3 pl-3 pr-3 pa-1 text-xs-center>
                                        <font size=4>{{ i+ 1}}</font>
                                    </v-flex>
                                    <v-flex xs2 pr-2>
                                        <v-text-field v-model="item.accId" @keypress.enter="getAcc(item, i)"
                                            ref="focusAccId"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3>
                                        <v-text-field v-model="item.accName" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3 my-3 pa-2 ml-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.debit"
                                                class="numeric" @blur="changeDebit(item)"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs3 my-3 pa-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.credit"
                                                class="numeric" @blur="changeCredit(item)"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2>
                                        <v-text-field v-model="item.remark" ref="accRemark"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 text-xs-center my-2>
                                        <v-btn fab small color="primary" @click="addDetail(item)" :disabled="item.accId == '' || item.accName == '' ||
                                        item.debit == 0 && item.credit == 0 || i != detailAcc.length - 1">
                                            <v-icon dark>add</v-icon>
                                        </v-btn>
                                        <v-btn fab small color="error" @click="delDetail(item)" tabindex="-1"
                                            :disabled="detailAcc.length == 1"><v-icon dark>remove</v-icon></v-btn>
                                    </v-flex>
                                </v-layout>
                                <hr>

                                <!-- Display sum debit and credit  -->
                                <br>
                                <v-layout>
                                    <v-flex text-xs-center pl-3>
                                        <h4></h4>
                                    </v-flex>
                                    <v-flex xs2 pl-5>
                                        <h4></h4>
                                    </v-flex>
                                    <v-flex xs3 pl-5>
                                        <h4></h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right pr-2 ml-4>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" :value="sumDebit"
                                                class="sumNumeric" disabled></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right mr-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" :value="sumCredit"
                                                class="sumNumeric" disabled></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 text-xs-center>
                                        <h4></h4>
                                    </v-flex>
                                    <v-flex xs2></v-flex>
                                </v-layout>
                                <br>
                                <hr>

                                <!-- Show account info from the search in database -->
                                <v-dialog v-model="dialogAcc" max-width="600px">
                                    <v-card>
                                        <v-card-text>
                                            <v-data-table :headers="headers" :items="chartAccount" class="elevation-1">
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

                                <br>
                                <v-layout align-center column>
                                    <v-flex>
                                        <v-btn @click="addReturn">
                                            <v-icon dark>save</v-icon>
                                            Save
                                        </v-btn>
                                        <v-btn @click="clearReturn">
                                            <v-icon dark>clear</v-icon>
                                            Cancel
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-card>
            </v-dialog>

            <!-- Show product info from the search in database -->
            <v-dialog v-model="showProdCode" max-width="1024px">
                <v-card>
                    <v-card-title><span class="headline">List product</span></v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headerProCode" :items="listProduct" class="elevation-1">
                            <template v-slot:items="props">
                                <td>{{ props.item.Code }}</td>
                                <td>{{ props.item.NameMM }}</td>
                                <td class="text-xs-right">
                                    {{ props.item.PriceMM.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="justify-center layout px-0">
                                    <v-icon class="mr-1"
                                        @click="selectProCode(props.item)">check_circle_outline</v-icon>
                                    <!-- <v-tooltip left>
                                        <template v-slot:activator="{ on }">
                                            <v-icon class="mr-1" @click="selectProCode(props.item)" v-on="on">check_circle_outline</v-icon>
                                        </template>
                                        <span>Choose this product</span>
                                    </v-tooltip> -->
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="showLoading" persistent width="unset">
                <div class="text-center">
                    <v-card>
                        <v-card-text>
                            <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                        </v-card-text>
                    </v-card>
                </div>
            </v-dialog>
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
            itemsWarehouse: [],
            warehouse: '',
            headers: [
                { text: 'Account code', align: 'left', value: 'accId' },
                { text: 'Account name', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' }
            ],
            chartAccount: [],
            refNo: '',
            desc: '',
            detailAcc: [],
            dialogAcc: false,
            dateGl: '',
            glNo: '',
            dialogGl: false,
            showLoading: false,
            headerProCode: [
                { text: 'Product code', value: 'Code' },
                { text: 'Product name', sortable: false, },
                { text: 'Price', align: 'right', sortable: false, },
                { text: '', align: 'right', sortable: false, },
            ],
            showProdCode: false,
            listProduct: [],
            detail: [],
            dnNo: '',
            menuDate: false,
            date: new Date().toISOString().substr(0, 10),
            invNo: '',
            posProdCode: 0,
        }
    },
    methods: {
        test() {
            db.collection("stock").add({
                amt: 500,
                date: "2020-02-20",
                dnDate: '2020-02-26',
                dnNo: 'DN200001',
                frame: "DG",
                front: "BL",
                invNo: 'V190307',
                itemCode: "SGD-3K",
                lastEdit: '',
                puNo: "PU200001",
                qc: "4568SWFOD3",
                status: 'Closed',
                warehouse: "00 : Head office"
            })
                .then(() => {
                    console.log("Success.")
                })
        },
        // Get warehouse
        getWarehouse() {
            db.collection("warehouse").get()
                .then(query => {
                    this.itemsWarehouse = []
                    query.forEach(doc => {
                        this.itemsWarehouse.push(doc.data().code + " " + ":" + " " + doc.data().name)
                    })
                    this.itemsWarehouse.sort()
                    this.warehouse = this.itemsWarehouse[0]
                })
        },
        getAcc(item, index) {
            let app = this
            if (item.accId == '') {
                alert("Please input Account code.")
                this.$refs.focusAccId.focus()
            }
            else {
                db.collection("chartAccount").orderBy("accId").startAt(item.accId).endAt(item.accId + "\uf8ff").get()
                    .then(querySnapshot => {
                        app.chartAccount = []
                        querySnapshot.forEach(doc => {
                            let searchDoc = doc.data()
                            app.chartAccount.push(searchDoc)
                        })
                        if (app.chartAccount.length == 0) {
                            app.dialogAcc = false
                            alert("This account code is not in the system......")
                            app.itemAcc = []
                        }
                        else {
                            app.dialogAcc = true
                            app.posiAcc = index
                        }
                    })
            }
        },
        // Select data from the search in database
        selectAcc(item) {
            this.detailAcc[this.posiAcc].accId = item.accId
            this.detailAcc[this.posiAcc].accName = item.accName
            this.dialogAcc = false
        },
        // Add detail in new line
        addDetail(item) {
            let i = this.detailAcc.length - 1
            if (item.accId == '') {
                alert("Please input acc code or delete line no." + (i + 1))
                this.$nextTick(() => {
                    let input = this.$refs.focusAccId[i]
                    input.focus()
                })
            }
            else if (item.debit || item.credit > 0) {
                this.detailAcc.push({ accId: '', accName: '', debit: 0, credit: 0, remark: '' })
                this.$nextTick(() => {
                    let i = this.detailAcc.length - 1
                    let input = this.$refs.focusAccId[i]
                    input.focus()
                })
            }
            else {
                alert("Please input debit or credit no." + (i + 1))
            }
        },
        // Delete the selected account
        delDetail(item) {
            if (this.detailAcc.length > 1) {
                this.detailAcc.splice(this.detailAcc.findIndex(detail => detail == item), 1)
            }
            else {
                this.detailAcc.splice(this.detailAcc.findIndex(detail => detail == item), 1)
                this.showOpenDetail = true
                this.showDetails = false
            }
        },
        addReturn() {
            let app = this
            if (app.sumDebit != app.sumCredit) {
                alert("Please check again.\nDebit and credit must be equal.")
            }
            else {
                app.showLoading = true
                let year = new Date().toISOString().substr(0, 4)
                let DocRef = db.collection("counter").doc(year)
                db.runTransaction((transaction) => {
                    return transaction.get(DocRef).then((Doc) => {
                        if (!Doc.exists) {
                            throw "Document does not exist!"
                        }
                        else {
                            let newRt = Doc.data().rt + 1
                            let newGl = Doc.data().gr + 1
                            transaction.update(DocRef, {
                                rt: newRt,
                                gr: newGl
                            })
                        }
                    })
                })
                    .then(() => {
                        let j = 0
                        let i = 0
                        app.detailAcc.forEach(obj => {
                            if (obj.debit > 0) {
                                db.collection("generalLedger").add({
                                    glNo: app.glNo,
                                    refNo: app.refNo,
                                    glDate: app.date,
                                    desc: app.desc,
                                    accId: obj.accId,
                                    accName: obj.accName,
                                    debit: obj.debit,
                                    credit: 0,
                                    remark: "",
                                })
                                    .then(() => {
                                        j++
                                        callback()
                                    })
                            }
                            if (obj.credit > 0) {
                                db.collection("generalLedger").add({
                                    glNo: app.glNo,
                                    refNo: app.refNo,
                                    glDate: app.date,
                                    desc: app.desc,
                                    accId: obj.accId,
                                    accName: obj.accName,
                                    debit: 0,
                                    credit: obj.credit,
                                    remark: "",
                                })
                                    .then(() => {
                                        j++
                                        callback()
                                    })
                            }
                        })
                        app.detail.forEach(rec => {
                            if (rec.subProd) {
                                rec.subProd.forEach(a => {
                                    db.collection("stock").add({
                                        puNo: a.puNo,
                                        date: app.date,
                                        lastEdit: '',
                                        itemCode: a.subCode,
                                        frame: a.frame,
                                        front: a.front,
                                        qc: a.qc,
                                        amt: a.cost,
                                        warehouse: app.warehouse,
                                        invNo: '',
                                        dnNo: '',
                                        dnDate: '',
                                        status: 'Open'
                                    })
                                        .then(() => {
                                            i++
                                            callback()
                                        })
                                })
                            }
                            else {
                                db.collection("stock").add({
                                    puNo: rec.puNo,
                                    date: app.date,
                                    lastEdit: '',
                                    itemCode: rec.Code,
                                    frame: rec.frame,
                                    front: rec.front,
                                    qc: rec.qc,
                                    amt: rec.cost,
                                    warehouse: app.warehouse,
                                    invNo: '',
                                    dnNo: '',
                                    dnDate: '',
                                    status: 'Open'
                                })
                                    .then(() => {
                                        i++
                                        callback()
                                    })
                            }
                        })
                        let callback = function
                            callback() {
                            if (j === app.detailAcc.length && i === app.detail.length) {
                                app.showLoading = false
                                app.cancelPage()
                                // db.collection("invoice").doc(app.idInvoice).update({
                                //     status: 'Closed'
                                // })
                                // .then(()=>{
                                //     app.showLoading = false
                                //     let routeData = app.$router.resolve({ name: 'invStatus' })
                                //     window.location.assign(routeData.href)
                                // })
                            }
                        }
                    })
            }
        },
        clearReturn() {
            let app = this
            app.detailAcc = []
            app.glNo = ''
            app.refNo = ''
            app.desc = ''
            app.dateGl = new Date().toISOString().substr(0, 10)
            app.dialogGl = false
        },
        openGL() {
            let app = this
            let count = 0
            app.detail.every(rec => {
                if (rec.subProd) {
                    rec.subProd.every(a => {
                        if (!a.qc) {
                            alert("Please enter the qc")
                            count++
                            return false
                        }
                        else {
                            if (!a.idStock) {
                                alert("Please press enter at qc")
                                count++
                                return false
                            }
                            else {
                                count = 0
                                return true
                            }
                        }
                    })
                }
                else {
                    if (!rec.qc) {
                        alert("Please enter the qc")
                        count++
                        return false
                    }
                    else {
                        if (!rec.idStock) {
                            alert("Please press enter at qc")
                            count++
                            return false
                        }
                        else {
                            count = 0
                            return true
                        }
                    }
                }
            })
            if (count == 0) {
                let sumAmt = 0
                app.detail.forEach(rec => {
                    if (rec.subProd) {
                        rec.subProd.forEach(a => {
                            if (a.cost) {
                                sumAmt += a.cost
                            }
                        })
                    }
                    else {
                        sumAmt += rec.cost
                    }
                })
                app.showLoading = true
                db.collection("chartAccount").where("accId", "==", "113301").get()
                    .then(query => {
                        app.detailAcc = []
                        query.forEach(doc => {
                            let accId = doc.data().accId
                            let accName = doc.data().accName
                            app.detailAcc.push({ accId: accId, accName: accName, debit: sumAmt, credit: 0, remark: '' })
                        })
                        db.collection("chartAccount").where("accId", "==", "500101").get()
                            .then(query => {
                                query.forEach(doc => {
                                    let accId = doc.data().accId
                                    let accName = doc.data().accName
                                    app.detailAcc.push({ accId: accId, accName: accName, debit: 0, credit: sumAmt, remark: '' })
                                })
                                let year = new Date().toISOString().substr(0, 4)
                                let subYear = year.substr(2, 2)
                                db.collection("counter").doc(year).get()
                                    .then(doc => {
                                        let typeDoc = doc.data().gr + 1
                                        if (typeDoc <= 9999) {
                                            typeDoc = ("000" + typeDoc).slice(-4)
                                        }
                                        app.glNo = "GR" + subYear + typeDoc
                                        app.refNo = app.invNo
                                        app.desc = "Return Products"
                                        app.dateGl = app.date
                                        app.showLoading = false
                                        app.dialogGl = true
                                    })
                            })
                    })
            }
        },
        cancelPage() {
            this.date = new Date().toISOString().substr(0, 10)
            this.detail = []
            this.detailAcc = []
            this.dialogGl = false
            this.warehouse = this.itemsWarehouse[0]
            this.getDnNo()
            this.$nextTick(() => this.$refs.invNo.focus())
            this.detail.push({ Code: '', frame: '', front: '', qc: '' })
        },
        // Find QC
        getQC(item) {
            let app = this
            db.collection("stock").orderBy("date", "desc").where("qc", "==", item.qc).where("status", "==", "Closed").limit(1).get()
                .then(query => {
                    if (!query.docs[0]) {
                        alert("Data not found.")
                    }
                    else {
                        query.forEach(doc => {
                            let data = doc.data()
                            if (item.Code != data.itemCode || item.qc != data.qc) {
                                item.qc = ''
                                alert("The QC: " + item.qc + " does not match the product code.")
                            }
                            else {
                                let checkDup = []
                                app.detail.forEach(a => {
                                    if (a.qc == item.qc) {
                                        checkDup.push(item.qc)
                                    }
                                })
                                if (checkDup.length > 1) {
                                    item.qc = ''
                                    alert("QC must be unique")
                                }
                                else {
                                    alert("The QC: " + item.qc + " match the product code.")
                                    item.frame = data.frame
                                    item.front = data.front
                                    item.cost = data.amt
                                    item.warehouse = data.warehouse
                                    item.puNo = data.puNo
                                    item.idStock = query.docs[0].id
                                }
                            }
                        })
                    }
                })
        },
        // Find QC (Set Product)
        getSupQC(item) {
            let app = this
            db.collection("stock").orderBy("date", "desc").where("qc", "==", item.qc).where("status", "==", "Closed").limit(1).get()
                .then(query => {
                    if (!query.docs[0]) {
                        alert("Data not found.")
                    }
                    else {
                        query.forEach(doc => {
                            let data = doc.data()
                            if (item.subCode != data.itemCode || item.qc != data.qc) {
                                item.qc = ''
                                alert("The QC: " + item.qc + " does not match the product code.")
                            }
                            else {
                                let checkDup = []
                                app.detail.forEach(a => {
                                    if (a.subProd) {
                                        a.subProd.forEach(b => {
                                            if (b.qc == item.qc) {
                                                checkDup.push(item.qc)
                                            }
                                        })
                                    }
                                })
                                if (checkDup.length > 1) {
                                    item.qc = ''
                                    alert("QC must be unique")
                                }
                                else {
                                    alert("The QC: " + item.qc + " match the product code.")
                                    item.frame = data.frame
                                    item.front = data.front
                                    item.cost = data.amt
                                    item.warehouse = data.warehouse
                                    item.puNo = data.puNo
                                    item.idStock = query.docs[0].id
                                }
                            }
                        })
                    }
                })
        },
        // Delete sub code
        delSubCode(item, i) {
            // if(this.detail[i].subProd.length == 1){
            //     this.detail[i].subProd.splice(this.detail[i].subProd.findIndex(rec=>rec == item),1)
            // }
            // else{
            console.log(this.detail[i].subProd, item)
            this.detail[i].subProd.splice(this.detail[i].subProd.findIndex(rec => rec == item), 1)
            // }
        },
        // Delete items don't want to send
        delProd(item) {
            this.detail.splice(this.detail.findIndex(rec => rec == item), 1)
        },
        // Add sub product
        addSubProd() {
            this.detail.push({ Code: '', frame: '', front: '', qc: '' })
            let i = this.detail.length - 1
            this.$nextTick(() => this.$refs.Code[i].focus())
        },
        inputCurrency(item) {
            if (item.amt != item.amt * 1) {
                let amtSplit = item.amt.split(",")
                let sumSplit = ''
                for (let i = 0; i < amtSplit.length; i++) {
                    sumSplit += amtSplit[i]
                }
                sumSplit = sumSplit * 1
                item.amt = sumSplit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            else {
                item.amt = item.amt * 1
                item.amt = item.amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        },
        // Add purchase list
        addPurchaseList() {
            this.detail.push({ Code: '', frame: '', front: '', qc: '', amt: 0 })
            let i = this.detail.length - 1
            this.$nextTick(() => { this.$refs.Code[i].focus() })
        },
        // Get delivery no
        getDnNo() {
            let year = new Date().toISOString().substr(0, 4)
            let subYear = year.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().rt + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.dnNo = "RT" + subYear + typeDoc
                })
        },
        selectProCode(item) {
            if (item.subProd) {
                this.detail[this.posProdCode].frame = ''
                this.detail[this.posProdCode].front = ''
                this.detail[this.posProdCode].qc = ''
                item.subProd.forEach(rec => {
                    this.$set(rec, "frame", '')
                    this.$set(rec, "front", '')
                    this.$set(rec, "qc", '')
                })
                this.detail[this.posProdCode].subProd = item.subProd
                this.showProdCode = false
            }
            else {
                delete this.detail[this.posProdCode].subProd
                this.detail[this.posProdCode].Code = item.Code
                this.showProdCode = false
            }
        },
        // Get product
        getProd(item, i) {
            let app = this
            if (!item.Code) {
                alert("Please input product code.")
                item.Code = ''
            }
            else {
                app.listProduct = []
                db.collection("code").doc("productcode").collection("proCode").orderBy("Code")
                    .startAt(item.Code).endAt(item.Code + "\uf8ff").get()
                    .then(query => {
                        query.forEach(doc => {
                            app.listProduct.push(doc.data())
                        })
                        if (app.listProduct.length == 0) {
                            app.showProdCode = false
                            alert("This product code is not in the system.")
                            item.Code = ''
                        }
                        else {
                            app.showProdCode = true
                            item.frame = ''
                            item.front = ''
                            item.qc = ''
                            app.posProdCode = i
                        }
                    })
            }
        },
        // Change credit value = 0 when debit value > 0
        changeDebit(item) {
            if (item.debit > 0) {
                item.credit = 0
            }
        },
        // Change debit value = 0 when credit value > 0
        changeCredit(item) {
            if (item.credit > 0) {
                item.debit = 0
            }
        },
        upperQC(item) {
            item.qc = item.qc.toUpperCase()
        },
        uppercase(item) {
            item.Code = item.Code.toUpperCase()
        }
    },
    computed: {
        sumDebit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.debit), 0)
        },
        sumCredit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.credit), 0)
        },
    },
    mounted() {
        // this.getProd()
        // this.getFrameFront()
        //
        this.getWarehouse()
        this.getDnNo()
        this.$nextTick(() => this.$refs.invNo.focus())
        this.detail.push({ Code: '', frame: '', front: '', qc: '' })
    }
}
</script>
<style scoped>
.sumNumeric {
    text-align: right;
    width: 100%;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
}
</style>