<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Edit General Ledger</h1>
                    <!-- <v-btn @click="test"></v-btn> -->
                    <!-- <v-btn @click="accBalancePlus" ref="focusAccbalncePlus">
                        <v-icon>add</v-icon>
                    </v-btn> -->
                    <!-- <v-btn @click="accBalanceMinus">
                        <v-icon>remove</v-icon>
                    </v-btn> -->
                    <hr>

                    <!-- Search gl in the database by glNo and refNo -->
                    <v-layout justify-center>
                        <v-flex xs2 d-flex justify-end my-4>
                            <h3>Search gl no:</h3>
                        </v-flex>
                        <v-flex xs2 pa-1 px-2>
                            <v-text-field v-model="searchGlNo" ref="focusSearchGlNo" @keypress.enter="getGlNo"
                                @input="uppercase"></v-text-field>
                        </v-flex>
                        <v-flex xs2 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="getGlNo">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs2 d-flex justify-end my-4>
                            <h3>Search ref no:</h3>
                        </v-flex>
         
                        <v-flex xs2 pa-1 px-2>
                            <v-text-field v-model="searchRefNo" ref="focusSearchRefNo" @keypress.enter="getRefNo"
                                @input="uppercase"></v-text-field>
                        </v-flex>
                        <v-flex xs2 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="getRefNo">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <hr>

                    <div v-if="showGlDetail">
                        <v-layout>
                            <v-flex xs12 text-xs-right my-4>
                                <h3>Gl no:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1 v-if="showglNo">
                                <v-text-field v-model="glNo" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs2 pa-1 v-if="showRefNo">
                                <v-select :items="itemGlNo" v-model="glNo" @change="getRefNoGlno"
                                    ref="focusGlNo"></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout justify-end>
                            <v-flex xs2>
                                <v-menu v-model="menuGlDate" :close-on-content-click="false" :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="date" label="Date:" prepend-icon="event"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="date" @input="menuGlDate = false"></v-date-picker>
                                </v-menu>
                                <!-- <v-text-field v-model="date" label="Date:" prepend-icon="event" ></v-text-field> -->
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex xs12 text-xs-right my-4>
                                <h3>Ref no:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1>
                                <v-text-field v-model="refNo" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <v-flex xs4 text-xs-right my-3>
                                <h3>Description:</h3>
                            </v-flex>
                            <v-flex xs4 pa-1 px-2>
                                <v-text-field v-model="desc" single-line solo ref="desc"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <hr>

                        <!-- Header account detail -->
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
                                <v-text-field v-model="item.accId" ref="focusAccId"
                                    @keypress.enter="searchAcc(item, i)"></v-text-field>
                            </v-flex>
                            <v-flex xs3>
                                <v-text-field v-model="item.accName" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                            <v-flex xs3 my-3 pa-2 ml-2>
                                <font size=3>
                                    <vue-numeric separator="," :precision="2" v-model="item.debit" class="numeric"
                                        @blur="changeDebit(item)"></vue-numeric>
                                </font>
                            </v-flex>
                            <v-flex xs3 my-3 pa-2>
                                <font size=3>
                                    <vue-numeric separator="," :precision="2" v-model="item.credit" class="numeric"
                                        @blur="changeCredit(item)"></vue-numeric>
                                </font>
                            </v-flex>
                            <v-flex xs2>
                                <v-text-field v-model="item.remark" ref="accRemark"></v-text-field>
                            </v-flex>
                            <v-flex xs2 text-xs-center my-2>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="primary" @click="addDetail(item)" v-on="on"><v-icon
                                                dark>add</v-icon></v-btn>
                                    </template>
                                    <span>Add new general ledger</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="error" @click="delDetail(item)" tabindex="-1"
                                            v-on="on"><v-icon dark>remove</v-icon></v-btn>
                                    </template>
                                    <span>Delete account number</span>
                                </v-tooltip>
                            </v-flex>
                        </v-layout>
                        <hr>

                        <!-- Show account info from the search in database -->
                        <v-dialog v-model="dialogAcc" max-width="600px">
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

                        <!-- Display sum debit and credit  -->
                        <v-layout>
                            <v-flex my-3 pl-3 pr-3 pa-1 text-xs-center></v-flex>
                            <v-flex xs2 pr-2></v-flex>
                            <v-flex xs3></v-flex>
                            <v-flex xs3 my-3 ml-3>
                                <font size=3>
                                    <vue-numeric separator="," :precision="2" :value="sumDebit" class="sumNumeric"
                                        disabled></vue-numeric>
                                </font>
                            </v-flex>
                            <v-flex xs3 my-3 ml-1>
                                <font size=3>
                                    <vue-numeric separator="," :precision="2" :value="sumCredit" class="sumNumeric"
                                        disabled></vue-numeric>
                                </font>
                            </v-flex>
                            <v-flex xs2></v-flex>
                            <v-flex xs2 text-xs-center></v-flex>
                        </v-layout>
                        <hr>
                        <br>
                        <!-- Button add gl and clear web page -->
                        <v-layout>
                            <v-flex text-xs-center>
                                <v-btn @click="saveGl()">
                                    <v-icon dark>save</v-icon>
                                    Save
                                </v-btn>
                                <v-btn @click="cancelGl()">
                                    <v-icon dark>clear</v-icon>
                                    Cancel
                                </v-btn>
                            </v-flex>
                        </v-layout>
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
        mainMenu,
        VueNumeric
    },
    data() {
        return {
            menuGlDate: false,
            showglNo: false,
            showRefNo: false,
            showBtnSave: false,
            showGlDetail: false,
            dialogAcc: false,
            searchGlNo: '',
            searchRefNo: '',
            itemGlNo: [],
            glNo: '',
            date: '',
            refNo: '',
            desc: '',

            detailAcc: [],
            detailAccDelete: [],
            detailAccMinus: [],

            chartAccount: [],
            headers: [
                { text: 'Account code', align: 'left', value: 'accId' },
                { text: 'Account name', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' }
            ],
            pagination: { 'sortBy': 'accId' },

            resultAcc: []
        }
    },
    methods: {
        uppercase() {
            this.searchGlNo = this.searchGlNo.toUpperCase()
            this.searchRefNo = this.searchRefNo.toUpperCase()
        },

        // Get gl from search in the database
        getGlNo() {
            db.collection("generalLedger").where("glNo", "==", this.searchGlNo).get()
                .then(query => {
                    this.detailAcc = []
                    this.detailAccMinus = []
                    let i = 0
                    query.forEach(doc => {
                        let accDoc = doc.data()
                        this.glNo = accDoc.glNo
                        this.date = accDoc.glDate
                        this.refNo = accDoc.refNo
                        this.desc = accDoc.desc
                        this.detailAcc.push({
                            docId: query.docs[i].id, accId: accDoc.accId, accName: accDoc.accName,
                            debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark
                        })
                        this.detailAccMinus.push({
                            accId: accDoc.accId, accName: accDoc.accName,
                            debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark
                        })
                        i++
                    })
                    this.detailAcc.sort((a, b) => a.accId.localeCompare(b.accId))
                    if (this.detailAcc.length > 0) {
                        this.showGlDetail = true
                        this.showRefNo = false
                        this.showglNo = true
                        this.searchGlNo = ''
                    }
                    else {
                        this.showGlDetail = false
                        alert("No data.")
                    }
                })
        },

        // Get gl from search in the database
        getRefNo() {
            db.collection("generalLedger").where("refNo", "==", this.searchRefNo).get()
                .then(query => {
                    this.itemGlNo = []
                    // this.detailAcc = []
                    // this.detailAccMinus = []
                    // let i = 0
                    query.forEach(doc => {
                        let accDoc = doc.data()
                        this.itemGlNo.push(accDoc.glNo)
                        // this.date = accDoc.glDate
                        // this.refNo = accDoc.refNo
                        // this.desc = accDoc.desc
                        // this.detailAcc.push({docId: query.docs[i].id, accId: accDoc.accId, accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark})
                        // this.detailAccMinus.push({accId: accDoc.accId, accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark})
                        // i++
                    })
                    this.itemGlNo.sort()
                    // this.detailAcc.sort((a, b) => a.accId.localeCompare(b.accId))
                    if (query.size > 0) {
                        this.cancelGl()
                        this.showGlDetail = true
                        this.showglNo = false
                        this.showRefNo = true
                        this.searchRefNo = ''
                        this.$nextTick(() => { this.$refs.focusGlNo.focus() })
                    }
                    else {
                        this.showGlDetail = false
                        alert("No data.")
                    }
                })
        },

        getRefNoGlno() {
            db.collection("generalLedger").where("glNo", "==", this.glNo).get()
                .then(query => {
                    this.detailAcc = []
                    this.detailAccMinus = []
                    let i = 0
                    query.forEach(doc => {
                        let accDoc = doc.data()
                        this.date = accDoc.glDate
                        this.refNo = accDoc.refNo
                        this.desc = accDoc.desc
                        this.detailAcc.push({ docId: query.docs[i].id, accId: accDoc.accId, accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark })
                        this.detailAccMinus.push({ accId: accDoc.accId, accName: accDoc.accName, debit: accDoc.debit, credit: accDoc.credit, remark: accDoc.remark })
                        i++
                    })
                    this.detailAcc.sort((a, b) => a.accId.localeCompare(b.accId))
                    if (this.detailAcc.length > 0) {
                        this.searchRefNo = ''
                    }
                    else {
                        this.showGlDetail = false
                        alert("No data.")
                    }
                })
        },

        // Show account info from the search in the database
        searchAcc(itemAcc, index) {
            let app = this
            if (itemAcc.accId == '') {
                alert("Please input Account code.")
                this.$refs.accId.focus()
            }
            else {
                db.collection("chartAccount").orderBy("accId").startAt(itemAcc.accId).endAt(itemAcc.accId + "\uf8ff").get()
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
                            app.detailAccCurPos = index
                        }
                    })
            }
        },

        // Select data from the search in database
        selectAcc(item) {
            this.detailAcc[this.detailAccCurPos].accId = item.accId
            this.detailAcc[this.detailAccCurPos].accName = item.accName
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
                // db.collection("chartAccount").where("id", "==", item.id).get()
                // .then(doc=>{
                //     console.log(doc.data())
                // })
                this.detailAcc.push({ debit: 0, credit: 0, docId: '', remark: '' })
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
                this.detailAccDelete.push(this.detailAcc.splice(this.detailAcc.findIndex(detail => detail == item), 1))
                // console.log(this.detailAccDelete)
            }
            else {
                this.detailAcc.splice(this.detailAcc.findIndex(detail => detail == item), 1)
                this.cancelGl()
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

        accBalancePlus() {
            this.resultAcc = []
            let app = this
            // let year = "2018"
            let year = new Date().toISOString().substr(0, 4)
            let month = new Date(this.date).toISOString().substr(5, 2) * 1
            let docAcc = db.collection("accBalance").doc(year)
            return db.runTransaction((transaction) => {
                return transaction.get(docAcc).then((Doc) => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }
                    else {
                        app.detailAcc.reduce((res, value) => {
                            if (!res[value.accId]) {
                                res[value.accId] = { accId: value.accId, debit: 0, credit: 0 }
                                app.resultAcc.push(res[value.accId])
                            }
                            res[value.accId].debit += value.debit
                            res[value.accId].credit += value.credit
                            return res
                        }, {})
                        app.resultAcc.forEach(rec => {
                            let docAccId = Doc.data()[rec.accId]
                            for (let i = month; i <= 12; i++) {
                                docAccId[(i < 10 ? '0' : '') + i] += rec.debit
                                docAccId[(i < 10 ? '0' : '') + i] -= rec.credit
                                transaction.update(docAcc, {
                                    [rec.accId]: docAccId
                                })
                            }
                            docAccId["debit"] += rec.debit
                            docAccId["credit"] += rec.credit
                            transaction.update(docAcc, {
                                [rec.accId]: docAccId
                            })
                        })
                    }
                })
            })
            // .then(()=>{
            //     console.log("Success.",app.glNo)
            //     app.cancelGl()
            // })
        },

        accBalanceMinus() {
            this.resultAcc = []
            let app = this
            let year = new Date().toISOString().substr(0, 4)
            let month = new Date(this.date).toISOString().substr(5, 2) * 1
            let docAcc = db.collection("accBalance").doc(year)
            return db.runTransaction((transaction) => {
                return transaction.get(docAcc).then((Doc) => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }
                    else {
                        app.detailAccMinus.reduce((res, value) => {
                            if (!res[value.accId]) {
                                res[value.accId] = { accId: value.accId, debit: 0, credit: 0 }
                                app.resultAcc.push(res[value.accId])
                            }
                            res[value.accId].debit += value.debit
                            res[value.accId].credit += value.credit
                            return res
                        }, {})
                        app.resultAcc.forEach(rec => {
                            let docAccId = Doc.data()[rec.accId]
                            for (let i = month; i <= 12; i++) {
                                docAccId[(i < 10 ? '0' : '') + i] -= rec.debit
                                docAccId[(i < 10 ? '0' : '') + i] += rec.credit
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
                .then(() => {
                    app.accBalancePlus()
                    // console.log("Success.",app.glNo)
                    // app.cancelGl()
                })
        },

        // Update gl in the database
        saveGl() {
            let haveError = false
            let msgError = ''
            let app = this
            if (this.sumDebit != this.sumCredit) {
                haveError = true
                msgError = "Please check again.\nDebit and credit must be equal."
            }
            if (this.detailAcc.length == 0) {
                haveError = true
                msgError += "Please add account number."
            }
            if (haveError) {
                alert(msgError)
            }
            else {
                // app.accBalanceMinus()
                let i = 0
                if (this.detailAccDelete.length > 0) {
                    this.detailAccDelete.forEach(rec => {
                        db.collection("generalLedger").doc(rec[0].docId).delete()
                    })
                }
                app.detailAcc.forEach(obj => {
                    if (obj.docId == '') {
                        db.collection("generalLedger").add({
                            glNo: app.glNo,
                            refNo: app.refNo,
                            glDate: app.date,
                            desc: app.desc,
                            accId: obj.accId,
                            accName: obj.accName,
                            debit: obj.debit,
                            credit: obj.credit,
                            remark: obj.remark,
                        })
                            .then(() => {
                                i++
                                callback()
                            })
                    }
                    else {
                        db.collection("generalLedger").doc(obj.docId).update({
                            glDate: app.date,
                            desc: app.desc,
                            accId: obj.accId,
                            accName: obj.accName,
                            debit: obj.debit,
                            credit: obj.credit,
                            remark: obj.remark,
                        })
                            .then(() => {
                                i++
                                callback()
                            })
                    }
                })
                let callback = function
                    callback() {
                    if (app.detailAcc.length === i) {
                        alert("Update success.")
                        app.cancelGl()
                    }
                }
            }
        },

        // Cancel gl
        cancelGl() {
            this.searchGlNo = ''
            this.searchRefNo = ''
            this.glNo = ''
            this.date = ''
            this.refNo = ''
            this.desc = ''
            this.detailAcc = []
            this.detailAccDelete = []
            this.detailAccMinus = []
            this.resultAcc = []
            this.showRefNo = false
            this.showglNo = false
            this.showGlDetail = false
            this.$nextTick(() => { this.$refs.focusSearchGlNo.focus() })
        },
    },
    computed: {

        sumDebit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.debit), 0)
        },
        sumCredit() {
            return this.detailAcc.reduce((sum, item) => sum + (item.credit), 0)
        }
    },
    mounted() {
        this.$nextTick(() => { this.$refs.focusSearchGlNo.focus() })
    }
}
</script>
<style scoped>
.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    /* padding: 0%; */
}

.sumNumeric {
    text-align: right;
    width: 100%;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    padding: 2%;

}
</style>