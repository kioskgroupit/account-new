<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">General Ledger</h1>

                    <hr>
                    <!-- Header Gl -->
                    <div>
                        <!-- Select glType -->
                        <v-layout>
                            <v-flex xs12></v-flex>
                            <v-flex xs12 d-flex justify-end pa-2 my-4>
                                <h3>Gl no:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1>
                                <v-text-field v-model="glNo" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <!-- Select gl date -->
                        <v-layout justify-end>
                            <v-flex xs2>
                                <v-menu v-model="menuGlDate" :close-on-content-click="false" :nudge-right="40" lazy
                                    transition="scale-transition" offset-y full-width min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="glDate" label="Date:" prepend-icon="mdi-calendar"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="glDate" @input="menuGlDate = false"></v-date-picker>
                                </v-menu>
                                <!-- <v-text-field v-model="glDate" label="Date:" prepend-icon="event"></v-text-field> -->
                            </v-flex>
                        </v-layout>

                        <!-- Select ref no -->
                        <v-layout justify-end>
                            <v-flex xs1>
                                <v-text-field v-model="rvNo" label="Ref no:" ref="fucusRvNo"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </div>
                    <hr>
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
                    <hr>
                    <div v-if="showAcc">

                        <!-- Button open account detail -->
                        <div>
                            <!-- <hr> -->
                            <div v-if="showOpenDetail">
                                <v-layout>
                                    <v-flex xs6 sm4 md3>
                                        <v-tooltip right>
                                            <template v-slot:activator="{ on }">
                                                <v-btn fab small color="primary" @click="openDetail()" v-on="on"><v-icon
                                                        dark>mdi-plus</v-icon></v-btn>
                                            </template>
                                            <span>Add general ledger</span>
                                        </v-tooltip>
                                    </v-flex>
                                </v-layout>
                                <hr>
                            </div>
                            <div v-if="showDetails">

                                <!-- Header account detail -->
                                <v-layout ma-2>
                                    <v-flex xs1 text-xs-center pr-2>
                                        <h4>No.</h4>
                                    </v-flex>
                                    <v-flex xs1>
                                        <h4>Acc code</h4>
                                    </v-flex>
                                    <v-flex xs2>
                                        <h4>Acc name</h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right pr-1>
                                        <h4>Debit</h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-right pr-1>
                                        <h4>Credit</h4>
                                    </v-flex>
                                    <v-flex xs3 text-xs-center>
                                        <h4>Remark</h4>
                                    </v-flex>
                                    <v-flex xs2></v-flex>
                                </v-layout>
                                <hr>

                                <!-- Account detail -->
                                <v-layout v-for="(item, i) in detailAcc" :key="i" collapse>
                                    <v-flex xs1 my-3 pa-2 padDing text-xs-center>
                                        <font size=4>{{ i+ 1}}</font>
                                    </v-flex>
                                    <v-flex xs1 padDing>
                                        <v-text-field v-model="item.accId" ref="accId"
                                            @keypress.enter="searchAcc(item, i)"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 padDing>
                                        <v-text-field v-model="item.accName" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3 my-3 pa-2 ml-2 padDing>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.debit"
                                                class="numeric" ref="accDebit" @blur="changeDebit(item)"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs3 my-3 pa-2 padDing>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.credit"
                                                class="numeric" @blur="changeCredit(item)"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs3 padDing>
                                        <v-text-field v-model="item.remark" ref="accRemark"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 text-xs-center my-2>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn fab small color="primary" @click="addDetail(item)"
                                                    v-on="on"><v-icon dark>add</v-icon></v-btn>
                                            </template>
                                            <span>Add new account number</span>
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
                                <hr>
                                <br>
                            </div>

                            <!-- Display sum debit and credit  -->
                            <br>
                            <v-layout>
                                <v-flex xs1></v-flex>
                                <v-flex xs2></v-flex>
                                <v-flex xs1></v-flex>
                                <v-flex xs3 pl-3>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" :value="sumDebit" class="sumNumeric"
                                            disabled></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs3 pl-3>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" :value="sumCredit" class="sumNumeric"
                                            disabled></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs3></v-flex>
                                <v-flex xs2></v-flex>
                            </v-layout>
                            <br>
                            <hr>
                            <br>

                            <!-- Button add gl and clear web page -->
                            <v-layout>
                                <v-flex text-xs-center>
                                    <v-btn class="mr-2" @click="addgl()">
                                        <v-icon dark>mdi-content-save</v-icon>
                                        Save
                                    </v-btn>
                                <v-btn class="ml-2" @click="cancelGl">
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
import { collection, getDocs, where, getFirestore, runTransaction, query, orderBy, doc, addDoc } from "firebase/firestore";
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        VueNumeric,
        mainMenu
    },
    data() {
        return {
            dialogAcc: false,
            showAcc: true,
            nowDate: new Date().toISOString().slice(0, 10),
            menuGlDate: false,

            glNo: '',
            glDate: new Date().toISOString().substr(0, 10),
            itemRefNo: [],
            idRefNo: '',
            rvNo: '',
            Amt: 0,
            disc: 0,

            statusType: '',
            net: 0,
            down: 0,

            desc: '',
            showOpenDetail: true,
            showDetails: false,
            detailAcc: [],
            detailAccCurPos: 0,
            chartAccount: [],
            headers: [
                { text: 'Account code', align: 'left', value: 'accId' },
                { text: 'Account name', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' }
            ],
            pagination: { 'sortBy': 'accId' },
            itemAcc: {
                accId: '',
                accName: ''
            },
        }
    },
    methods: {

        test() {
            let year = "2018"
            let app = this
            let month = new Date(this.glDate).toISOString().substr(5, 2) * 1
            let docAcc = db.collection("accBalance").doc(year)
            return db.runTransaction((transaction) => {
                return transaction.get(docAcc).then((Doc) => {
                    if (!Doc.exists) {
                        throw "Document does not exist!"
                    }
                    else {
                        let result = []
                        app.detailAcc.reduce((res, value) => {
                            if (!res[value.accId]) {
                                res[value.accId] = { accId: value.accId, debit: 0, credit: 0 }
                                result.push(res[value.accId])
                            }
                            res[value.accId].debit += value.debit
                            res[value.accId].credit += value.credit
                            return res
                        }, {})
                        result.forEach(rec => {
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
        },

        // change glNo
        onChangeGlNo() {
            let year = this.glDate.substr(0, 4)
            let subYear = this.glDate.substr(2, 2)
            this.itemRefNo = []
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().jv + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.glNo = "JV" + subYear + typeDoc
                    this.$nextTick(() => { this.$refs.fucusRvNo.focus() })
                })
        },

        // 
        searchRefNoJV() {

        },

        // Open detail in web page
        openDetail() {
            if (this.glNo == '') {
                alert("Please input Gl no.")
            }
            // else if(this.rvNo == ''){
            //     alert("Please select ref no.")
            //     this.$nextTick(()=>{this.$refs.focusRvNo.focus()})
            // }
            else if (this.desc == '') {
                alert("Please input Description.")
                this.$refs.desc.focus()
            }
            else {
                this.showDetails = true
                // this.detailAcc.push({id: '', name: '', debit: 0, credit: 0, remark: ''})
                this.detailAcc.push({ debit: 0, credit: 0, remark: '' })
                this.$nextTick(() => {
                    let i = this.detailAcc.length - 1
                    let input = this.$refs.accId[i]
                    input.focus()
                })
                if (this.detailAcc.length > 0) {
                    this.showOpenDetail = false
                }
            }

        },

        // Add detail in new line
        addDetail(item) {
            let i = this.detailAcc.length - 1
            if (item.accId == '') {
                alert("Please input acc code or delete line no." + (i + 1))
                this.$nextTick(() => {
                    let input = this.$refs.accId[i]
                    input.focus()
                })
            }
            else if (item.debit || item.credit > 0) {
                // db.collection("chartAccount").where("id", "==", item.id).get()
                // .then(doc=>{
                //     console.log(doc.data())
                // })
                this.detailAcc.push({ debit: 0, credit: 0, remark: '' })
                this.$nextTick(() => {
                    let i = this.detailAcc.length - 1
                    let input = this.$refs.accId[i]
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
            // this.$nextTick(()=>{ this.$refs.accDebit[this.detailAccCurPos].focus() })
            // this.$nextTick(() => {
            //         let index = this.detailAcc.length - 1
            //         // this.$refs.accDebit[index].focus()
            //         this.$refs.accRemark[index].focus()
            //     })
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

        // Add gl in database
        testAddGl() {
            let app = this
            let year = new Date().toISOString().substr(0, 4)
            let month = new Date(this.glDate).toISOString().substr(5, 2) * 1
            let i = this.detailAcc.length - 1
            if (this.detailAcc.length == 0) {
                alert("Please add acc detail.")
            }
            else if (this.detailAcc[i].accId == '') {
                alert("Please delete acc detail null no." + (i + 1))
                this.$nextTick(() => {
                    let input = this.$refs.accId[i]
                    input.focus()
                })
            }
            else if (this.detailAcc[i].debit || this.detailAcc[i].credit > 0) {
                if (this.sumDebit !== this.sumCredit) {
                    alert("Please check again.\nDebit and credit must be equal.")
                }
                else {
                    let DocRef = db.collection("counter").doc(year)
                    db.collection("generalLedger").where("glNo", "==", this.glNo).get()
                        .then(querySnapshot => {
                            app.checkGl = []
                            querySnapshot.forEach(doc => {
                                let curDoc = doc.data().glNo
                                app.checkGl.push(curDoc)
                            })
                            if (app.checkGl.length >= 1) {
                                alert("This order no is already in the system.\nPlease try again.")
                                app.onChangeGlNo()
                            }
                            else {
                                db.runTransaction((transaction) => {
                                    return transaction.get(DocRef).then((Doc) => {
                                        if (!Doc.exists) {
                                            throw "Document does not exist!"
                                        }

                                        let newGlNo = Doc.data().jv + 1
                                        transaction.update(DocRef, {
                                            ["jv"]: newGlNo
                                        })
                                    })
                                })
                                let docAcc = db.collection("accBalance").doc(year)
                                return db.runTransaction((transaction) => {
                                    return transaction.get(docAcc).then((Doc) => {
                                        if (!Doc.exists) {
                                            throw "Document does not exist!"
                                        }
                                        else {
                                            let result = []
                                            app.detailAcc.reduce((res, value) => {
                                                if (!res[value.accId]) {
                                                    res[value.accId] = { accId: value.accId, debit: 0, credit: 0 }
                                                    result.push(res[value.accId])
                                                }
                                                res[value.accId].debit += value.debit
                                                res[value.accId].credit += value.credit
                                                return res
                                            }, {})
                                            result.forEach(rec => {
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
                                    .then(() => {

                                        // add data in generalLedger
                                        let batch = db.batch()
                                        app.detailAcc.forEach(objAcc => {
                                            batch.set(db.collection("generalLedger").doc(), {
                                                glNo: app.glNo,
                                                glDate: app.glDate,
                                                refNo: app.rvNo,
                                                desc: app.desc,
                                                accId: objAcc.accId,
                                                accName: objAcc.accName,
                                                debit: objAcc.debit,
                                                credit: objAcc.credit,
                                                remark: objAcc.remark,
                                                // sumDebit: app.sumDebit,
                                                // sumCredit: app.sumCredit
                                            })
                                        })
                                        batch.commit().then(() => {
                                            alert("successfully.....")
                                            app.cancelGl()
                                        })
                                            .catch((error) => {
                                                console.log(error)
                                                alert("failed.....")
                                            })
                                    })
                                    .catch((error) => {
                                        console.log("Transaction failed: ", error)
                                    })
                            }
                        })
                }
            }
            else {
                alert("Please input debit or credit no." + (i + 1))
            }
        },

        // Add gl in database
        addGl() {
            let app = this
            let year = new Date().toISOString().substr(0, 4)
            let i = this.detailAcc.length - 1
            if (this.detailAcc.length == 0) {
                alert("Please add acc detail.")
            }
            else if (this.detailAcc[i].accId == '') {
                alert("Please delete acc detail null no." + (i + 1))
                this.$nextTick(() => {
                    let input = this.$refs.accId[i]
                    input.focus()
                })
            }
            else if (this.detailAcc[i].debit || this.detailAcc[i].credit > 0) {
                if (this.sumDebit !== this.sumCredit) {
                    alert("Please check again.\nDebit and credit must be equal.")
                }
                else {
                    let DocRef = db.collection("counter").doc(year)
                    db.collection("generalLedger").where("glNo", "==", this.glNo).get()
                        .then(querySnapshot => {
                            app.checkGl = []
                            querySnapshot.forEach(doc => {
                                let curDoc = doc.data().glNo
                                app.checkGl.push(curDoc)
                            })
                            if (app.checkGl.length >= 1) {
                                alert("This order no is already in the system.\nPlease try again.")
                                app.onChangeGlNo()
                            }
                            else {
                                db.runTransaction((transaction) => {
                                    return transaction.get(DocRef).then((Doc) => {
                                        if (!Doc.exists) {
                                            throw "Document does not exist!"
                                        }

                                        let newGlNo = Doc.data().jv + 1
                                        transaction.update(DocRef, {
                                            ["jv"]: newGlNo
                                        })
                                    })
                                })
                                    .then(() => {

                                        // add data in generalLedger
                                        let batch = db.batch()
                                        app.detailAcc.forEach(objAcc => {
                                            batch.set(db.collection("generalLedger").doc(), {
                                                glNo: app.glNo,
                                                glDate: app.glDate,
                                                refNo: app.rvNo,
                                                desc: app.desc,
                                                accId: objAcc.accId,
                                                accName: objAcc.accName,
                                                debit: objAcc.debit,
                                                credit: objAcc.credit,
                                                remark: objAcc.remark,
                                                // sumDebit: app.sumDebit,
                                                // sumCredit: app.sumCredit
                                            })
                                        })
                                        batch.commit().then(() => {
                                            alert("successfully.....")
                                            app.cancelGl()
                                        })
                                            .catch((error) => {
                                                console.log(error)
                                                alert("failed.....")
                                            })
                                    })
                                    .catch((error) => {
                                        console.log("Transaction failed: ", error)
                                    })
                            }
                        })
                }
            }
            else {
                alert("Please input debit or credit no." + (i + 1))
            }
        },

        // Cancel gl
        cancelGl() {
            this.onChangeGlNo()
            this.glDate = new Date().toISOString().substr(0, 10)
            this.rvNo = ''
            this.desc = ''
            this.detailAcc = []
            this.showDetails = false
            this.showOpenDetail = true
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
        this.onChangeGlNo()
    }
}
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid gray;
    padding: 1.2%;
}

.numericDebitAndCredit {
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

.padDing {
    padding: 0.5%;
}
</style>
