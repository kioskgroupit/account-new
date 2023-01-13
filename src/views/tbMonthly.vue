<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Trial Balance (Monthly)</h1>
        
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
                            :items-per-page-options="rowsPerPageItems">
                            <template v-slot:no-data>
                                <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                            </template>
                            <template v-slot:items="props">
                                <td>{{ props.item.accId }}</td>
                                <td>{{ props.item.accName }}</td>
                                <!-- <td class="text-xs-right">{{props.item.bf.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</td> -->
                                <td class="text-xs-right">
                                    {{ props.item['01'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['02'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['03'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['04'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['05'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['06'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['07'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['08'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['09'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['10'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['11'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{ props.item['12'].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
                                </td>
                                <td class="text-xs-right">
                                    {{
                                    (
    props.item['01'] + props.item['02'] + props.item['03'] + props.item['04']
    + props.item['05'] + props.item['06'] + props.item['07'] + props.item['08']
    + props.item['09'] + props.item['10'] + props.item['11'] + props.item['12']
)
    .toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }}
                                </td>
                            </template>
                            <template v-slot:footer>
                                <td></td>
                                <td><strong>Total:</strong></td>
                                <!-- <td class="text-xs-right"><strong>{{sumBf.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}</strong></td> -->
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum01.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum02.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum03.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum04.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum05.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum06.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum07.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum08.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum09.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum10.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum11.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                            ",")
                                    }}</strong></td>
                                <td class="text-xs-right">
                                    <strong>{{
                                        sum12.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
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
import { collection, getDocs, where, getFirestore, query, orderBy, addDoc } from "firebase/firestore";
// import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        mainMenu
    },
    data() {
        return {
            month: new Date().toISOString().substr(5, 2) * 1,
            lastYear: new Date().toISOString().substr(0, 4),
            menuMonth: false,
            itemYear: [],
            year: new Date().toISOString().substr(0, 4),

            rowsPerPageItems: [100, 200, 500],
            headers: [
                { text: 'Acc id', align: 'left', value: 'accId' },
                { text: 'Acc name', sortable: false, align: 'left' },
                // { text: 'B/F', sortable: false, align: 'right' },
                { text: 'Jan', sortable: false, align: 'right' },
                { text: 'Fab', sortable: false, align: 'right' },
                { text: 'Mar', sortable: false, align: 'right' },
                { text: 'Apr', sortable: false, align: 'right' },
                { text: 'May', sortable: false, align: 'right' },
                { text: 'Jun', sortable: false, align: 'right' },
                { text: 'Jul', sortable: false, align: 'right' },
                { text: 'Aug', sortable: false, align: 'right' },
                { text: 'Sep', sortable: false, align: 'right' },
                { text: 'Oct', sortable: false, align: 'right' },
                { text: 'Nov', sortable: false, align: 'right' },
                { text: 'Dec', sortable: false, align: 'right' },
                { text: 'C/F', sortable: false, align: 'right' },
            ],
            detail: [],
        }
    },
    methods: {
        test() {
            const db = getFirestore()
            addDoc(collection(db, "generalLedger"),{
                // accId: "110001",
                // accName: "Cash on hand",
                // credit: 0,
                // debit: 120000,
                // desc: "",
                // glDate: "2019-06-30",
                // glNo: "",
                // refNo: "",
                // remark: "",

                accId: "110002",
                accName: "Cash for deposit",
                credit: 0,
                debit: 574550,
                desc: "",
                glDate: "2019-06-30",
                glNo: "",
                refNo: "",
                remark: "",
            })
                .then(() => {
                    console.log("Success.")
                })
        },

        // Search trial balance detail from year in the database
        async searchYear() {
            let curYear = this.year * 1 + 1
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "generalLedger"), where("glDate", ">", this.year), where("glDate", "<", curYear.toString()));
                docRef.forEach(() => {
                    let arrAcc = []
                    this.detail = []
                    docRef.forEach(doc => {
                        arrAcc.push(doc.data())
                    })
                    // console.log(arr)
                    let newArr = []
                    let d01, d02, d03, d04, d05, d06, d07, d08, d09, d10, d11, d12 = 0
                    let c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12 = 0

                    arrAcc.forEach(rec => {
                        d01 = 0, d02 = 0, d03 = 0, d04 = 0, d05 = 0, d06 = 0, d07 = 0, d08 = 0, d09 = 0, d10 = 0, d11 = 0, d12 = 0
                        c01 = 0, c02 = 0, c03 = 0, c04 = 0, c05 = 0, c06 = 0, c07 = 0, c08 = 0, c09 = 0, c10 = 0, c11 = 0, c12 = 0

                        if (rec.glDate.substr(0, 7) == this.year + "-" + "01") {
                            if (rec.debit > 0) {
                                d01 = 0
                                d01 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c01 = 0
                                c01 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "02") {
                            if (rec.debit > 0) {
                                d02 = 0
                                d02 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c02 = 0
                                c02 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "03") {
                            if (rec.debit > 0) {
                                d03 = 0
                                d03 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c03 = 0
                                c03 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "04") {
                            if (rec.debit > 0) {
                                d04 = 0
                                d04 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c04 = 0
                                c04 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "05") {
                            if (rec.debit > 0) {
                                d05 = 0
                                d05 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c05 = 0
                                c05 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "06") {
                            if (rec.debit > 0) {
                                d06 = 0
                                d06 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c06 = 0
                                c06 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "07") {
                            if (rec.debit > 0) {
                                d07 = 0
                                d07 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c07 = 0
                                c07 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "08") {
                            if (rec.debit > 0) {
                                d08 = 0
                                d08 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c08 = 0
                                c08 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "09") {
                            if (rec.debit > 0) {
                                d09 = 0
                                d09 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c09 = 0
                                c09 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "10") {
                            if (rec.debit > 0) {
                                d10 = 0
                                d10 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c10 = 0
                                c10 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "11") {
                            if (rec.debit > 0) {
                                d11 = 0
                                d11 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c11 = 0
                                c11 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "12") {
                            if (rec.debit > 0) {
                                d12 = 0
                                d12 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c12 = 0
                                c12 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                    })

                    newArr.sort((a, b) => a.accId.localeCompare(b.accId))
                    let arrId = null
                    let arrName = null
                    let count = 0
                    let sum = []
                    let sum01, sum02, sum03, sum04, sum05, sum06, sum07, sum08, sum09, sum10, sum11, sum12 = 0

                    for (let i = 0; i < newArr.length; i++) {
                        if (newArr[i].accId != arrId) {
                            if (count > 0) {
                                this.detail.push({
                                    accId: arrId, accName: arrName, "01": sum["01"], "02": sum["02"]
                                    , "03": sum["03"], "04": sum["04"], "05": sum["05"], "06": sum["06"]
                                    , "07": sum["07"], "08": sum["08"], "09": sum["09"], "10": sum["10"]
                                    , "11": sum["11"], "12": sum["12"]
                                })
                            }
                            sum = []
                            sum01 = 0, sum02 = 0, sum03 = 0, sum04 = 0, sum05 = 0, sum06 = 0, sum07 = 0, sum08 = 0, sum09 = 0, sum10 = 0, sum11 = 0, sum12 = 0
                            sum = {
                                "01": sum01 += newArr[i]["01"], "02": sum02 += newArr[i]["02"], "03": sum03 += newArr[i]["03"],
                                "04": sum04 += newArr[i]["04"], "05": sum05 += newArr[i]["05"], "06": sum06 += newArr[i]["06"],
                                "07": sum07 += newArr[i]["07"], "08": sum08 += newArr[i]["08"], "09": sum09 += newArr[i]["09"],
                                "10": sum10 += newArr[i]["10"], "11": sum11 += newArr[i]["11"], "12": sum12 += newArr[i]["12"],
                            }
                            arrId = newArr[i].accId
                            arrName = newArr[i].accName
                            count = 1
                        }
                        else {
                            sum = {
                                "01": sum01 += newArr[i]["01"], "02": sum02 += newArr[i]["02"], "03": sum03 += newArr[i]["03"],
                                "04": sum04 += newArr[i]["04"], "05": sum05 += newArr[i]["05"], "06": sum06 += newArr[i]["06"],
                                "07": sum07 += newArr[i]["07"], "08": sum08 += newArr[i]["08"], "09": sum09 += newArr[i]["09"],
                                "10": sum10 += newArr[i]["10"], "11": sum11 += newArr[i]["11"], "12": sum12 += newArr[i]["12"],
                            }
                            count++
                        }
                    }
                    if (count > 0) {
                        this.detail.push({
                            accId: arrId, accName: arrName, "01": sum["01"], "02": sum["02"]
                            , "03": sum["03"], "04": sum["04"], "05": sum["05"], "06": sum["06"], "07": sum["07"]
                            , "08": sum["08"], "09": sum["09"], "10": sum["10"], "11": sum["11"], "12": sum["12"]
                        })
                    }
                    // console.log(this.detail)
                })
            // this.detail = []
            // let app = this
            // db.collection("accBalance").doc(this.year).get()
            // .then(doc=>{
            //     let data = doc.data()
            //     let key = Object.keys(data)
            //     // console.log(key)
            //     key.forEach(accId=>{
            //         app.detail.push({...data[accId],accNo:accId})
            //     })
            //     app.detail.forEach(rec=>{
            //         if(app.month < 2){
            //             rec["2"] = 0
            //         }
            //         if(app.month < 3){
            //             rec["3"] = 0
            //         }
            //         if(app.month < 4){
            //             rec["4"] = 0
            //         }
            //         if(app.month < 5){
            //             rec["5"] = 0
            //         }
            //         if(app.month < 6){
            //             rec["6"] = 0
            //         }
            //         if(app.month < 7){
            //             rec["7"] = 0
            //         }
            //         if(app.month < 8){
            //             rec["8"] = 0
            //         }
            //         if(app.month < 9){
            //             rec["9"] = 0
            //         }
            //         if(app.month < 10){
            //             rec["10"] = 0
            //         }
            //         if(app.month < 11){
            //             rec["11"] = 0
            //         }
            //         if(app.month < 12){
            //             rec["12"] = 0
            //         }
            //     })
            // })
        },

        // 
        async getGl() {
            let curYear = this.year * 1 + 1
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "generalLedger"), where("glDate", ">", this.year), where("glDate", "<", curYear.toString()));
                docRef.forEach(() => {
                    let arrAcc = []
                    this.detail = []
                    docRef.forEach(doc => {
                        arrAcc.push(doc.data())
                    })
                    // console.log(arr)
                    let newArr = []
                    let d01, d02, d03, d04, d05, d06, d07, d08, d09, d10, d11, d12 = 0
                    let c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12 = 0

                    arrAcc.forEach(rec => {
                        d01 = 0, d02 = 0, d03 = 0, d04 = 0, d05 = 0, d06 = 0, d07 = 0, d08 = 0, d09 = 0, d10 = 0, d11 = 0, d12 = 0
                        c01 = 0, c02 = 0, c03 = 0, c04 = 0, c05 = 0, c06 = 0, c07 = 0, c08 = 0, c09 = 0, c10 = 0, c11 = 0, c12 = 0

                        if (rec.glDate.substr(0, 7) == this.year + "-" + "01") {
                            if (rec.debit > 0) {
                                d01 = 0
                                d01 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c01 = 0
                                c01 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "02") {
                            if (rec.debit > 0) {
                                d02 = 0
                                d02 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c02 = 0
                                c02 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "03") {
                            if (rec.debit > 0) {
                                d03 = 0
                                d03 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c03 = 0
                                c03 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "04") {
                            if (rec.debit > 0) {
                                d04 = 0
                                d04 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c04 = 0
                                c04 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "05") {
                            if (rec.debit > 0) {
                                d05 = 0
                                d05 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c05 = 0
                                c05 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "06") {
                            if (rec.debit > 0) {
                                d06 = 0
                                d06 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c06 = 0
                                c06 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "07") {
                            if (rec.debit > 0) {
                                d07 = 0
                                d07 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c07 = 0
                                c07 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "08") {
                            if (rec.debit > 0) {
                                d08 = 0
                                d08 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c08 = 0
                                c08 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "09") {
                            if (rec.debit > 0) {
                                d09 = 0
                                d09 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c09 = 0
                                c09 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "10") {
                            if (rec.debit > 0) {
                                d10 = 0
                                d10 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c10 = 0
                                c10 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "11") {
                            if (rec.debit > 0) {
                                d11 = 0
                                d11 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c11 = 0
                                c11 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                        if (rec.glDate.substr(0, 7) == this.year + "-" + "12") {
                            if (rec.debit > 0) {
                                d12 = 0
                                d12 += rec.debit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": d01, "02": d02, "03": d03, "04": d04, "05": d05
                                    , "06": d06, "07": d07, "08": d08, "09": d09, "10": d10, "11": d11, "12": d12
                                })
                            }
                            if (rec.credit > 0) {
                                c12 = 0
                                c12 -= rec.credit
                                newArr.push({
                                    accId: rec.accId, accName: rec.accName, "01": c01, "02": c02, "03": c03, "04": c04, "05": c05
                                    , "06": c06, "07": c07, "08": c08, "09": c09, "10": c10, "11": c11, "12": c12
                                })
                            }
                        }
                    })

                    newArr.sort((a, b) => a.accId.localeCompare(b.accId))
                    let arrId = null
                    let arrName = null
                    let count = 0
                    let sum = []
                    let sum01, sum02, sum03, sum04, sum05, sum06, sum07, sum08, sum09, sum10, sum11, sum12 = 0

                    for (let i = 0; i < newArr.length; i++) {
                        if (newArr[i].accId != arrId) {
                            if (count > 0) {
                                this.detail.push({
                                    accId: arrId, accName: arrName, "01": sum["01"], "02": sum["02"]
                                    , "03": sum["03"], "04": sum["04"], "05": sum["05"], "06": sum["06"]
                                    , "07": sum["07"], "08": sum["08"], "09": sum["09"], "10": sum["10"]
                                    , "11": sum["11"], "12": sum["12"]
                                })
                            }
                            sum = []
                            sum01 = 0, sum02 = 0, sum03 = 0, sum04 = 0, sum05 = 0, sum06 = 0, sum07 = 0, sum08 = 0, sum09 = 0, sum10 = 0, sum11 = 0, sum12 = 0
                            sum = {
                                "01": sum01 += newArr[i]["01"], "02": sum02 += newArr[i]["02"], "03": sum03 += newArr[i]["03"],
                                "04": sum04 += newArr[i]["04"], "05": sum05 += newArr[i]["05"], "06": sum06 += newArr[i]["06"],
                                "07": sum07 += newArr[i]["07"], "08": sum08 += newArr[i]["08"], "09": sum09 += newArr[i]["09"],
                                "10": sum10 += newArr[i]["10"], "11": sum11 += newArr[i]["11"], "12": sum12 += newArr[i]["12"],
                            }
                            arrId = newArr[i].accId
                            arrName = newArr[i].accName
                            count = 1
                        }
                        else {
                            sum = {
                                "01": sum01 += newArr[i]["01"], "02": sum02 += newArr[i]["02"], "03": sum03 += newArr[i]["03"],
                                "04": sum04 += newArr[i]["04"], "05": sum05 += newArr[i]["05"], "06": sum06 += newArr[i]["06"],
                                "07": sum07 += newArr[i]["07"], "08": sum08 += newArr[i]["08"], "09": sum09 += newArr[i]["09"],
                                "10": sum10 += newArr[i]["10"], "11": sum11 += newArr[i]["11"], "12": sum12 += newArr[i]["12"],
                            }
                            count++
                        }
                    }
                    if (count > 0) {
                        this.detail.push({
                            accId: arrId, accName: arrName, "01": sum["01"], "02": sum["02"]
                            , "03": sum["03"], "04": sum["04"], "05": sum["05"], "06": sum["06"], "07": sum["07"]
                            , "08": sum["08"], "09": sum["09"], "10": sum["10"], "11": sum["11"], "12": sum["12"]
                        })
                    }
                    // console.log(this.detail)
                })
        }
    },
    computed: {

        // Sum b/f from trial balance detail
        // sumBf(){
        //     return this.detail.reduce((total,item)=> total+(item.bf),0)
        // },

        // Sum jan from trial balance detail
        sum01() {
            return this.detail.reduce((total, item) => total + (item['01']), 0)
        },

        // Sum feb from trial balance detail
        sum02() {
            return this.detail.reduce((total, item) => total + (item['02']), 0)
        },

        // Sum mar from trial balance detail
        sum03() {
            return this.detail.reduce((total, item) => total + (item['03']), 0)
        },

        // Sum apr from trial balance detail
        sum04() {
            return this.detail.reduce((total, item) => total + (item['04']), 0)
        },

        // Sum may from trial balance detail
        sum05() {
            return this.detail.reduce((total, item) => total + (item['05']), 0)
        },

        // Sum jun from trial balance detail
        sum06() {
            return this.detail.reduce((total, item) => total + (item['06']), 0)
        },

        // Sum jul from trial balance detail
        sum07() {
            return this.detail.reduce((total, item) => total + (item['07']), 0)
        },

        // Sum gug from trial balance detail
        sum08() {
            return this.detail.reduce((total, item) => total + (item['08']), 0)
        },

        // Sum sep from trial balance detail
        sum09() {
            return this.detail.reduce((total, item) => total + (item['09']), 0)
        },

        // Sum oct from trial balance detail
        sum10() {
            return this.detail.reduce((total, item) => total + (item['10']), 0)
        },

        // Sum nov from trial balance detail
        sum11() {
            return this.detail.reduce((total, item) => total + (item['11']), 0)
        },

        // Sum dec from trial balance detail
        sum12() {
            return this.detail.reduce((total, item) => total + (item['12']), 0)
        },

        // Sum c/f from trial balance detail
        sumCf() {
            return this.detail.reduce((total, item) => total +
                (
                    item['01'] +
                    item['02'] +
                    item['03'] +
                    item['04'] +
                    item['05'] +
                    item['06'] +
                    item['07'] +
                    item['08'] +
                    item['09'] +
                    item['10'] +
                    item['11'] +
                    item['12']
                ), 0)
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
<style scoped>
.txtCenter {
    text-align: center;
}

.padDing {
    padding: 0.1%;
}

.line {
    /* border-bottom: 1px solid black; */
    text-align: right;
    width: 100%;
}
</style>
