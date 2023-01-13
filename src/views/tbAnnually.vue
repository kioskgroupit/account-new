<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Trial Balance (Annually)</h1>

                    <hr>

                    <!-- Select year -->
                    <v-layout>
                        <v-flex xs1>
                            <v-select :items="itemYear" v-model="year" label="Year:" @change="searchYear()"></v-select>
                        </v-flex>
                    </v-layout>
                    <hr>
                    <div>
                        <!-- Detail trial balance -->
                        <v-data-table :headers="headers" :items="detail" class="elevation-1"
                            :options="options" :items-per-page-options="rowsPerPageItems">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td>{{ props.item.accId }}</td>
                                <td>{{ props.item.accName }}</td>
                                <td class="text-xs-right">
                                    {{ props.item.debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item.credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{
                                    (props.item.debit -
    props.item.credit).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }}
                                </td>
                            </template>
                            <template v-slot:footer>
                                <td><strong>Total:</strong></td>
                                <td></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sumDebit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sumCredit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sumCf.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
import { collection, getDocs, where, getFirestore, query, orderBy, doc } from "firebase/firestore";
// import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        mainMenu
    },
    data() {
        return {
            lastYear: new Date().toISOString().substr(0, 4),
            itemYear: [],
            year: new Date().toISOString().substr(0, 4),

            rowsPerPageItems: [100, 200, 500],
            headers: [
                { text: 'Acc id', align: 'left', value: 'accId' },
                { text: 'Acc name', sortable: false, align: 'left' },
                { text: 'Debit', sortable: false, align: 'right' },
                { text: 'Credit', sortable: false, align: 'right' },
                { text: 'C/F', sortable: false, align: 'right' }
            ],
            // pagination: { 'sortBy': 'accNo', 'descending': false },
            options: { 'descending': false },
            detail: [],
        }
    },
    methods: {

        // Search trial balance detail from year in the database
        searchYear() {
            let curYear = this.year * 1 + 1
            db.collection("generalLedger").where("glDate", ">", this.year).where("glDate", "<", curYear.toString()).get()
                .then(query => {
                    this.detail = []
                    let arrGl = []
                    query.forEach(doc => {
                        arrGl.push(doc.data())
                    })
                    arrGl.sort((a, b) => a.accId.localeCompare(b.accId))
                    let arrId = null
                    let arrName = null
                    let count = 0
                    let debit = 0
                    let credit = 0
                    for (let i = 0; i < arrGl.length; i++) {
                        if (arrGl[i].accId != arrId) {
                            if (count > 0) {
                                this.detail.push({ accId: arrId, accName: arrName, debit: debit, credit: credit })
                            }
                            arrId = arrGl[i].accId
                            arrName = arrGl[i].accName
                            count = 1
                            debit = 0, credit = 0
                            debit += arrGl[i].debit
                            credit += arrGl[i].credit
                        }
                        else {
                            debit += arrGl[i].debit
                            credit += arrGl[i].credit
                            count++
                        }
                    }
                    if (count > 0) {
                        this.detail.push({ accId: arrId, accName: arrName, debit: debit, credit: credit })
                    }
                })
        },

        getGl() {
            let curYear = this.year * 1 + 1
            db.collection("generalLedger").where("glDate", ">", this.year).where("glDate", "<", curYear.toString()).get()
                .then(query => {
                    this.detail = []
                    let arrGl = []
                    query.forEach(doc => {
                        arrGl.push(doc.data())
                    })
                    arrGl.sort((a, b) => a.accId.localeCompare(b.accId))
                    let arrId = null
                    let arrName = null
                    let count = 0
                    let debit = 0
                    let credit = 0
                    for (let i = 0; i < arrGl.length; i++) {
                        if (arrGl[i].accId != arrId) {
                            if (count > 0) {
                                this.detail.push({ accId: arrId, accName: arrName, debit: debit, credit: credit })
                            }
                            arrId = arrGl[i].accId
                            arrName = arrGl[i].accName
                            count = 1
                            debit = 0, credit = 0
                            debit += arrGl[i].debit
                            credit += arrGl[i].credit
                        }
                        else {
                            debit += arrGl[i].debit
                            credit += arrGl[i].credit
                            count++
                        }
                    }
                    if (count > 0) {
                        this.detail.push({ accId: arrId, accName: arrName, debit: debit, credit: credit })
                    }
                })
        }
    },
    computed: {

        // Sum b/f from trial balance detail
        sumBf() {
            return this.detail.reduce((total, item) => total + (item.bf), 0)
        },

        // Sum debit from trial balance detail
        sumDebit() {
            return this.detail.reduce((total, item) => total + (item.debit), 0)
        },

        // Sum credit from trial balance detail
        sumCredit() {
            return this.detail.reduce((total, item) => total + (item.credit), 0)
        },

        // Sum c/f from trial balance detail
        sumCf() {
            return this.detail.reduce((total, item) => total + (item.debit - item.credit), 0)
            // return this.detail.reduce((total,item)=> total+(item.bf + item.debit - item.credit),0)
        },
    },
    async mounted() {
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "code"), where("runYear"));
            docRef.forEach(doc => {
                let data = doc.data().year
                docRef.forEach(rec => {
                    this.itemYear.push(rec)
                })
            })
        this.getGl()
    }
}
</script>
