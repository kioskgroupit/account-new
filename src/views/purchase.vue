
<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1>Purchase</h1>
                    <hr>
                    <v-layout>
                        <v-flex xs12 text-xs-right my-4>
                            <h3>Purchase no:</h3>
                        </v-flex>
                        <v-flex xs2 pa-1>
                            <v-text-field v-model="puNo" readonly tabindex="-1"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-end>
                        <v-flex xs2>
                            <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="date" label="Date:" prepend-icon="event"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" @input="menuDate = false"
                                    @change="focusPudetail"></v-date-picker>
                            </v-menu>
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
                        <v-flex xs3 mr-3><strong>Item code</strong></v-flex>
                        <v-flex xs1 mr-2 pr-1 text-xs-center><strong>Frame</strong></v-flex>
                        <v-flex xs1 mr-2 text-xs-center><strong>Front</strong></v-flex>
                        <v-flex xs3 mr-3><strong>Quality control</strong></v-flex>
                        <v-flex xs2 mr-2 text-xs-right><strong>Amount</strong></v-flex>
                        <v-flex xs2></v-flex>
                    </v-layout>
                    <hr>
                    <v-layout v-for="(item, i) in puDetail" :key="i" collapse>
                        <v-flex xs1 ml-1 mr-2>
                            <v-text-field :value="i + 1" readonly></v-text-field>
                        </v-flex>
                        <v-flex xs3 mr-2>
                            <v-autocomplete :items="itemProdCode" v-model="item.itemCode" ref="itemCode"
                                :color="!item.itemCode ? 'red' : 'primary'"></v-autocomplete>
                        </v-flex>
                        <v-flex xs1 mr-2>
                            <v-select :items="itemFrame" v-model="item.frame" ref="frame"
                                :color="!item.frame ? 'red' : 'primary'"></v-select>
                        </v-flex>
                        <v-flex xs1 mr-2>
                            <v-select :items="itemFront" v-model="item.front" ref="front"
                                :color="!item.front ? 'red' : 'primary'"></v-select>
                        </v-flex>
                        <v-flex xs3 mr-2>
                            <v-text-field v-model="item.qc" ref="qc" @input="uppercase(item)"
                                :color="!item.qc ? 'red' : 'primary'"></v-text-field>
                        </v-flex>
                        <v-flex xs2 mr-2>
                            <v-text-field v-model="item.amt" @blur="inputCurrency(item)" ref="amt" reverse
                                :color="!item.amt || item.amt == 0 ? 'red' : 'primary'"></v-text-field>
                            <!-- <font size=3>
                                <vue-numeric separator="," :precision="2" v-model="item.amt" class="line" ref="amt"></vue-numeric>
                            </font> -->
                        </v-flex>
                        <v-flex xs2 text-xs-center>
                            <v-btn fab small color="primary" @click="addPurchaseList" :disabled="item.itemCode == '' || item.frame == '' || item.front == '' ||
                            item.qc == '' || item.amt == 0 || i != puDetail.length - 1"><v-icon dark>add</v-icon>
                            </v-btn>
                            <v-btn :disabled="puDetail.length == 1" fab small color="error"
                                @click="delPurchaseList(item)" tabindex="-1">
                                <v-icon dark>remove</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <hr>
                    <br>

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
                                                <v-text-field v-model="date" label="Date:" prepend-icon="event"
                                                    readonly></v-text-field>
                                            </v-flex>
                                        </v-layout>
                                        <!-- Select ref no -->
                                        <v-layout justify-end>
                                            <v-flex xs1>
                                                <v-text-field v-model="puNo" label="Ref no:"
                                                    ref="fucusRvNo"></v-text-field>
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
                                                <v-text-field v-model="item.accName" readonly
                                                    tabindex="-1"></v-text-field>
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
                                                    :disabled="detailAcc.length == 1"><v-icon
                                                        dark>remove</v-icon></v-btn>
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
                                                    <v-data-table :headers="headers" :items="chartAccount"
                                                        class="elevation-1">
                                                        <template v-slot:items="props">
                                                            <td>{{ props.item.accId }}</td>
                                                            <td>{{ props.item.accName }}</td>
                                                            <td class="justify-center layout px-0">
                                                                <v-tooltip right>
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-icon class="mr-1"
                                                                            @click="selectAcc(props.item)"
                                                                            v-on="on">check_circle_outline</v-icon>
                                                                    </template>
                                                                    <span>Choose this general ledger account
                                                                        number</span>
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
                                                <v-btn @click="addPurchase">
                                                    <v-icon dark>save</v-icon>
                                                    Save
                                                </v-btn>
                                                <v-btn @click="clearPurchase">
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

                    <!-- Button save and cancel to Gl-->
                    <v-layout align-center column>
                        <v-flex>
                            <v-btn @click="showDialog">
                                <v-icon dark>save</v-icon>
                                Save
                            </v-btn>
                            <v-btn @click="clearPurchase">
                                <v-icon dark>clear</v-icon>
                                Cancel
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
import { db } from '@/firebase'
import mainMenu from '@/components/mainMenu.vue'
import VueNumeric from 'vue-numeric'
export default {
    components: {
        mainMenu,
        VueNumeric
    },
    data() {
        return {
            itemProdCode: [],
            puNo: '',
            glNo: '',
            menuDate: false,
            date: new Date().toISOString().substr(0, 10),
            itemsWarehouse: [],
            warehouse: '',
            puDetail: [],
            itemFrame: [],
            itemFront: [],
            dialogGl: false,
            desc: '',
            detailAcc: [],
            itemAcc: {
                accId: '',
                accName: ''
            },
            chartAccount: [],
            posiAcc: 0,
            dialogAcc: false,
            headers: [
                { text: 'Account code', align: 'left', value: 'accId' },
                { text: 'Account name', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' }
            ],
        }
    },
    methods: {
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
        // Uppercase
        uppercase(item) {
            item.qc = item.qc.toUpperCase()
        },
        // Get product
        getProd() {
            db.collection("code").doc("productcode").collection("proCode").get()
                .then(query => {
                    this.itemProdCode = []
                    let result = []
                    let prodDetail = []
                    let i = 0
                    query.forEach(doc => {
                        result.push({
                            id: query.docs[i].id, Code: doc.data().Code, NameMM: doc.data().NameMM,
                            subProd: doc.data().subProd, PriceMM: doc.data().PriceMM
                        })
                        i++
                    })
                    sessionStorage.prod = JSON.stringify(result)
                    prodDetail = JSON.parse(sessionStorage.prod)
                    prodDetail.forEach(rec => {
                        this.itemProdCode.push(rec.Code)
                    })
                    this.itemProdCode.sort()
                })
        },
        // Get Gl no
        getGl() {
            let year = new Date().toISOString().substr(0, 4)
            let subYear = year.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().gr + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.glNo = "GR" + subYear + typeDoc
                })
        },
        // Get purchase no
        getPuNo() {
            let year = new Date().toISOString().substr(0, 4)
            let subYear = year.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().pu + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.puNo = "PU" + subYear + typeDoc
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

        // New purchase list
        getPuDetail() {
            this.puDetail.push({ itemCode: '', frame: '', front: '', qc: '', amt: 0 })
            this.getFrameFront()
        },
        // Get Frame and Front from database
        getFrameFront() {
            this.itemFrame = []
            this.itemFront = []
            db.collection("code").doc("color").get()
                .then(doc => {
                    doc.data().frame.forEach(rec => {
                        this.itemFrame.push(rec)
                    })
                    doc.data().front.forEach(rec => {
                        this.itemFront.push(rec)
                    })
                })
        },
        // Add purchase list
        addPurchaseList() {
            this.puDetail.push({ itemCode: '', frame: '', front: '', qc: '', amt: 0 })
            let i = this.puDetail.length - 1
            this.$nextTick(() => { this.$refs.itemCode[i].focus() })
        },
        // Dialog general ledgerk
        showDialog() {
            let checkNull = []
            for (let i = 0; i < this.puDetail.length; i++) {
                let data = this.puDetail[i]
                if (!data.itemCode) {
                    this.$refs.itemCode[i].focus()
                    checkNull.push(data.itemCode)
                }
                else if (!data.frame) {
                    this.$refs.frame[i].focus()
                    checkNull.push(data.frame)
                }
                else if (!data.front) {
                    this.$refs.front[i].focus()
                    checkNull.push(data.front)
                }
                else if (!data.qc) {
                    this.$refs.qc[i].focus()
                    checkNull.push(data.qc)
                }
                else if (!data.amt || data.amt == 0) {
                    this.$refs.amt[i].focus()
                    checkNull.push(data.amt)
                }
            }
            if (checkNull.length == 0) {
                let app = this
                this.puDetail.forEach(rec => {
                    let amtSplit = rec.amt.split(",")
                    let sumSplit = ''
                    for (let i = 0; i < amtSplit.length; i++) {
                        sumSplit += amtSplit[i]
                    }
                    rec.amt = sumSplit * 1
                })
                db.collection("chartAccount").where("accId", "==", "113301").get()
                    .then(query => {
                        app.detailAcc = []
                        query.forEach(doc => {
                            let accId = doc.data().accId
                            let accName = doc.data().accName
                            app.detailAcc.push({ accId: accId, accName: accName, debit: app.sumAmt, credit: 0, remark: '' })
                        })
                        db.collection("chartAccount").where("accId", "==", "211001").get()
                            .then(query => {
                                query.forEach(doc => {
                                    let accId = doc.data().accId
                                    let accName = doc.data().accName
                                    app.detailAcc.push({ accId: accId, accName: accName, debit: 0, credit: app.sumAmt, remark: '' })
                                })
                                app.dialogGl = true
                            })
                    })
            }
        },
        // 
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
        // Delete purchase list
        delPurchaseList(item) {
            this.puDetail.splice(this.puDetail.findIndex(detail => detail == item), 1)
        },
        // Add purchase list
        addPurchase() {
            let app = this
            if (app.sumDebit != app.sumCredit) {
                alert("Please check again.\nDebit and credit must be equal.")
            }
            else {
                let year = new Date().toISOString().substr(0, 4)
                let DocRef = db.collection("counter").doc(year)
                db.runTransaction((transaction) => {
                    return transaction.get(DocRef).then((Doc) => {
                        if (!Doc.exists) {
                            throw "Document does not exist!"
                        }
                        else {
                            let newPu = Doc.data().pu + 1
                            let newGl = Doc.data().gr + 1
                            transaction.update(DocRef, {
                                pu: newPu,
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
                                    refNo: app.puNo,
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
                                    refNo: app.puNo,
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
                        app.puDetail.forEach(rec => {
                            db.collection("stock").add({
                                puNo: app.puNo,
                                date: app.date,
                                lastEdit: '',
                                itemCode: rec.itemCode.toUpperCase(),
                                frame: rec.frame,
                                front: rec.front,
                                qc: rec.qc.toUpperCase(),
                                amt: rec.amt,
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
                        let callback = function
                            callback() {
                            if (app.detailAcc.length === j && app.puDetail.length === i) {
                                alert("Success.")
                                app.clearPurchase()
                            }
                        }
                    })
            }
        },
        // Clear web page
        clearPurchase() {
            this.getGl()
            this.getPuNo()
            this.date = new Date().toISOString().substr(0, 10)
            this.warehouse = this.itemsWarehouse[0]
            this.puDetail = []
            this.addPurchaseList()
            if (this.dialogGl == true) {
                this.dialogGl = false
                this.puNo = ''
                this.desc = ''
                this.detailAcc = []
            }
        },
        // If the date has changed, focus again.
        focusPudetail() {
            let i = this.puDetail.length - 1
            this.$nextTick(() => { this.$refs.itemCode[i].focus() })
        },
    },
    computed: {
        sumAmt() {
            return this.puDetail.reduce((total, item) => total + (item.amt), 0)
        },
        sumDebit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.debit), 0)
        },
        sumCredit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.credit), 0)
        },
    },
    mounted() {
        if (!sessionStorage.prod) {
            this.getProd()
        }
        else {
            let prodDetail = []
            prodDetail = JSON.parse(sessionStorage.prod)
            prodDetail.forEach(rec => {
                this.itemProdCode.push(rec.Code)
            })
            this.itemProdCode.sort()
        }
        this.getGl()
        this.getPuNo()
        this.getWarehouse()
        this.getPuDetail()
        let i = this.puDetail.length - 1
        this.$nextTick(() => { this.$refs.itemCode[i].focus() })
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

.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
}

.my-input input {
    text-transform: uppercase;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    /* padding: 1%; */
}

.sumNumeric {
    text-align: right;
    width: 100%;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    /* padding: 2%; */
}
</style>