
<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1>Stock Status</h1>
                    <!-- <v-btn @click="test"></v-btn> -->
                    <hr>
                    <v-layout>
                        <v-flex xs1 mr-2>
                            <v-menu v-model="menuMonth" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="searchMonth" label="Select Month:" prepend-icon="event"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="searchMonth" @input="menuMonth = false" :max="nowDate"
                                    type="month" @change="changeMonth()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs2>
                            <v-autocomplete :items="itemsRefNo" v-model="refNo" label="Ref no filter:"
                                @change="refNoFilter"></v-autocomplete>
                        </v-flex>
                        <v-flex xs2>
                            <v-menu v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="startDate" label="Start date:" prepend-icon="event"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="startDate" @input="menuStartDate = false" :max="nowDate"
                                    type="date" @change="dateFilter()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs2 mr-2>
                            <v-menu v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40" lazy
                                transition="scale-transition" offset-y full-width min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="endDate" label="End date:" prepend-icon="event"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="endDate" @input="menuEndDate = false" :max="nowDate" type="date"
                                    @change="dateFilter()" :min="startDate"></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs2 mr-2>
                            <v-select :items="itemsWarehouse" v-model="warehouse" label="Warehouse filter:"
                                @change="warehouseFilter"></v-select>
                        </v-flex>
                        <v-flex xs2>
                            <v-select :items="itemsStaDn" v-model="staDn" label="Status delivery filter:"
                                @change="statusDnFilter"></v-select>
                        </v-flex>
                        <v-flex>
                            <v-btn flat @click="resetFilter"><v-icon>refresh</v-icon>reset</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                    <v-data-table :headers="headers" :items="detail" class="elevation-1"
                        :rows-per-page-items="rowsPerPageItems">
                        <template v-slot:no-data>
                            <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                        </template>
                        <template v-slot:items="props">
                            <td>{{ props.item.warehouse }}</td>
                            <td>{{ props.item.date }}</td>
                            <td>{{ props.item.refNo }}</td>
                            <td>{{ props.item.itemCode }}</td>
                            <td>{{ props.item.frame }}</td>
                            <td>{{ props.item.front }}</td>
                            <td>{{ props.item.qc }}</td>
                            <td class="text-xs-right">
                                {{ props.item.amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                            <td>{{ props.item.dnNo }}</td>
                            <td>{{ props.item.dnDate }}</td>
                            <td>{{ props.item.lastEdit }}</td>
                            <td class="text-xs-left">
                                <!-- <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon small class="mr-2" v-on="on">ballot</v-icon>
                                    </template>
                                    <span>View detail</span>
                                </v-tooltip> -->
                                <v-tooltip bottom v-if="props.item.dnNo == '' && props.item.dnDate == ''">
                                    <template v-slot:activator="{ on }">
                                        <v-icon small class="mr-2" v-on="on" @click="getQc(props.item)">edit</v-icon>
                                    </template>
                                    <span>Edit this stock</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>

                    <!-- Dialog edit -->
                    <v-dialog v-model="dialogEdit" max-width="800">
                        <v-card>
                            <v-card-title class="headline">
                                <v-flex>
                                    Edit quality control
                                </v-flex>
                                <v-flex text-xs-right>
                                    <v-icon @click="dialogEdit = false">clear</v-icon>
                                </v-flex>
                            </v-card-title>
                            <v-card-text>
                                <v-layout>
                                    <v-flex xs3 mr-2>
                                        <v-text-field v-model="qcDate" label="Date:" readonly
                                            ref="qcDate"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3 mr-2>
                                        <v-text-field v-model="qcRefNo" label="Ref no:" readonly
                                            ref="qcRefNo"></v-text-field>
                                    </v-flex>
                                    <v-flex>
                                        <v-select :items="itemsWarehouse" v-model="qcWarehouse"
                                            ref="qcWarehouse"></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs4 mr-2>
                                        <v-text-field v-model="qcItemCode" label="Item code:" @keypress.enter="getProd"
                                            @input="uppercase" ref="qcItemCode"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 mr-2>
                                        <v-select :items="itemFrame" v-model="qcFrame" ref="qcFrame"
                                            label="Frame color:"></v-select>
                                    </v-flex>
                                    <v-flex xs2 mr-2>
                                        <v-select :items="itemFront" v-model="qcFront" ref="qcFront"
                                            label="Front color:"></v-select>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field v-model="qcNo" ref="qcNo" label="Quality control:"
                                            readonly></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="red darken-1" flat @click="cancelEditQc">cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="saveEditQc">save</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                    <!-- Dialog products -->
                    <v-dialog v-model="dialogProd" max-width="700">
                        <v-card>
                            <v-card-text>
                                <h1>Products List</h1>
                                <v-divider></v-divider>
                                <v-data-table :headers="headerProd" :items="prodItem">
                                    <template v-slot:items="props">
                                        <tr @click="selectProd(props.item)">
                                            <td>{{ props.item.Code }}</td>
                                            <td>{{ props.item.NameMM }}</td>
                                        </tr>
                                    </template>
                                </v-data-table>
                                <v-divider></v-divider>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                </v-card-text>
            </v-card>

            <!-- Dialog progress -->
            <v-dialog v-model="showDialog" max-width="90" persistent>
                <div class="text-xs-center">
                    <v-card>
                        <v-card-text>
                            <v-progress-circular v-if="showProgress" :size="30" color="primary"
                                indeterminate></v-progress-circular>
                            <div v-if="showSuccess">
                                <v-icon color="green" :size="40">check_circle_outline</v-icon>
                                Success.
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-dialog>

        </v-container>
    </v-app>
</template>
<script>
import { db } from '@/firebase'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        mainMenu
    },
    data() {
        return {
            menuMonth: false,
            searchMonth: new Date().toISOString().substr(0, 7),
            nowDate: new Date().toISOString().slice(0, 10),
            itemsRefNo: [],
            refNo: '',
            itemsWarehouse: [],
            warehouse: '',
            menuStartDate: false,
            startDate: new Date().toISOString().substr(0, 10),
            menuEndDate: false,
            endDate: new Date().toISOString().substr(0, 10),
            itemsStaDn: ["Delivery", "Undelivered"],
            staDn: '',
            headers: [
                { text: 'Warehouse', align: 'left', value: 'warehouse' },
                { text: 'Date', align: 'left', value: 'date' },
                { text: 'Ref no', value: 'refNo' },
                { text: 'Item code', value: 'itemCode', align: 'left' },
                { text: 'Frame color', sortable: false, align: 'left' },
                { text: 'Front color', sortable: false, align: 'left' },
                { text: 'Quality control', value: 'qc', align: 'left' },
                { text: 'Amount', sortable: false, align: 'right' },
                { text: 'DN no', sortable: false, align: 'left' },
                { text: 'DN date', sortable: false, align: 'left' },
                { text: 'Last edited', sortable: false, align: 'left' },
                { text: '', sortable: false, align: 'left' },
            ],
            rowsPerPageItems: [50, 100, 200, 500],
            detail: [],
            cloneDetail: [],
            dialogEdit: false,
            docId: '',
            qcDate: '',
            // qcDate: new Date().toISOString().substr(0,10),
            qcRefNo: '',
            qcWarehouse: '',
            qcItemCode: '',
            itemFrame: [],
            qcFrame: '',
            itemFront: [],
            qcFront: '',
            qcNo: '',
            prodItem: [],
            dialogProd: false,
            headerProd: [
                { text: 'Product code', align: 'left', value: 'Code' },
                { text: 'Product name', align: 'left', sortable: false },
            ],
            showDialog: false,
            showProgress: false,
            showSuccess: false,
        }
    },
    methods: {
        test() {
            db.collection("generalLedger").add({
                glNo: '',
                glDate: '2019-03-31',
                refNo: '',
                desc: '',
                accId: '119013',
                accName: 'Advance Income Tax-Thandar Pale',
                debit: 276963.13,
                credit: 0,
                remark: '',
            })
                .then(() => {
                    console.log("Success.")
                })
        },
        // Uppercase
        uppercase() {
            this.qcItemCode = this.qcItemCode.toUpperCase()
        },
        // Get info stock
        getStock() {
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            db.collection("stock").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
                .onSnapshot(query => {
                    this.cloneDetail = []
                    this.detail = []
                    this.itemsRefNo = []
                    this.itemsWarehouse = []
                    this.itemsWarehouse.push("")
                    this.itemsRefNo.push("")
                    let i = 0
                    query.forEach(doc => {
                        let data = doc.data()
                        this.cloneDetail.push({
                            id: query.docs[i].id, date: data.date,
                            refNo: data.puNo, itemCode: data.itemCode, frame: data.frame, front: data.front,
                            qc: data.qc, amt: data.amt, dnNo: data.dnNo, dnDate: data.dnDate, warehouse: data.warehouse,
                            lastEdit: data.lastEdit
                        })
                        this.itemsRefNo.push(doc.data().dnNo)
                        this.itemsWarehouse.push(doc.data().warehouse)
                        i++
                    })
                    this.detail = this.cloneDetail
                })
        },
        // Search stock by select month
        changeMonth() {
            let nextMonth = new Date(this.searchMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            nextMonth = nextMonth.toISOString().substr(0, 7)
            db.collection("stock").where("date", ">", this.searchMonth).where("date", "<", nextMonth)
                .onSnapshot(query => {
                    this.cloneDetail = []
                    this.detail = []
                    this.itemsRefNo = []
                    this.itemsWarehouse = []
                    this.itemsWarehouse.push("")
                    this.itemsRefNo.push("")
                    let i = 0
                    query.forEach(doc => {
                        let data = doc.data()
                        this.cloneDetail.push({
                            id: query.docs[i].id, date: data.date,
                            refNo: data.puNo, itemCode: data.itemCode, frame: data.frame, front: data.front,
                            qc: data.qc, amt: data.amt, dnNo: data.dnNo, dnDate: data.dnDate, warehouse: data.warehouse,
                            lastEdit: data.lastEdit
                        })
                        this.itemsRefNo.push(doc.data().dnNo)
                        this.itemsWarehouse.push(doc.data().warehouse)
                        i++
                    })
                    this.detail = this.cloneDetail
                })
        },
        // Filter by ref no
        refNoFilter() {
            this.detail = this.cloneDetail.filter(rec => this.refNo == rec.dnNo.slice(0, this.refNo.length))
            this.startDate = new Date().toISOString().substr(0, 10)
            this.endDate = new Date().toISOString().substr(0, 10)
            this.warehouse = ''
        },
        // Filter by start date and end date
        dateFilter() {
            if (this.refNo == '') {
                this.detail = this.cloneDetail.filter(rec => rec.date >= this.startDate && rec.date <= this.endDate)
            }
            else {
                this.detail = this.cloneDetail.filter(rec => this.refNo == rec.dnNo && rec.date >= this.startDate && rec.date <= this.endDate)
            }
        },
        // Filter by warehouse
        warehouseFilter() {
            this.refNo = ''
            this.startDate = new Date().toISOString().substr(0, 10)
            this.endDate = new Date().toISOString().substr(0, 10)
            this.detail = this.cloneDetail.filter(rec => this.warehouse == rec.warehouse.slice(0, this.warehouse.length))
        },
        // Filter by status delivery
        statusDnFilter() {
            this.refNo = ''
            this.warehouse = ''
            if (this.staDn == 'Delivery') {
                this.detail = this.cloneDetail.filter(rec => rec.dnNo)
            }
            else {
                this.detail = this.cloneDetail.filter(rec => !rec.dnNo)
            }
        },
        // Reset filter to the default
        resetFilter() {
            this.refNo = ''
            this.startDate = new Date().toISOString().substr(0, 10)
            this.endDate = new Date().toISOString().substr(0, 10)
            this.warehouse = ''
            this.staDn = ''
            this.detail = this.cloneDetail
        },
        // Get qc for fix
        getQc(item) {
            if (this.itemsWarehouse.length == 0) {
                db.collection("warehouse").get()
                    .then(query => {
                        query.forEach(doc => {
                            this.itemsWarehouse.push(doc.data().code + " " + ":" + " " + doc.data().name)
                        })
                        this.itemsWarehouse.sort()
                    })
            }
            if (this.itemFrame.length == 0 || this.itemFront.length == 0) {
                db.collection("code").doc("color").get()
                    .then(doc => {
                        doc.data().frame.forEach(rec => {
                            this.itemFrame.push(rec)
                        })
                        doc.data().front.forEach(rec => {
                            this.itemFront.push(rec)
                        })
                    })
            }
            this.dialogEdit = true
            this.docId = item.id
            this.qcDate = item.date
            this.qcRefNo = item.refNo
            this.qcWarehouse = item.warehouse
            this.qcItemCode = item.itemCode
            this.qcFrame = item.frame
            this.qcFront = item.front
            this.qcNo = item.qc
        },
        // Get products
        getProd() {
            db.collection("code").doc("productcode").collection("proCode").orderBy("Code")
                .startAt(this.qcItemCode).endAt(this.qcItemCode + "\uf8ff").get()
                .then(query => {
                    this.prodItem = []
                    query.forEach(doc => {
                        this.prodItem.push(doc.data())
                    })
                    this.dialogProd = true
                })
        },
        selectProd(item) {
            this.qcItemCode = item.Code
            this.dialogProd = false
        },
        // Cancel edit qc
        cancelEditQc() {
            this.docId = ''
            this.qcDate = new Date().toISOString().substr(0, 10)
            this.qcRefNo = ''
            this.qcWarehouse = ''
            this.qcItemCode = ''
            this.qcFrame = ''
            this.qcFront = ''
            this.qcNo = ''
            this.dialogEdit = false
        },
        // Save edit qc
        saveEditQc() {
            if (!this.qcDate || !this.qcRefNo || !this.qcWarehouse || !this.qcItemCode || !this.qcFrame || !this.qcFront || !this.qcNo) {
                // alert("Please fill up this form.")
                if (!this.qcDate) {
                    this.$nextTick(() => this.$refs.qcDate.focus())
                }
                if (!this.qcRefNo) {
                    this.$nextTick(() => this.$refs.qcRefNo.focus())
                }
                if (!this.qcWarehouse) {
                    this.$nextTick(() => this.$refs.qcWarehouse.focus())
                }
                if (!this.qcItemCode) {
                    this.$nextTick(() => this.$refs.qcItemCode.focus())
                }
                if (!this.qcFrame) {
                    this.$nextTick(() => this.$refs.qcFrame.focus())
                }
                if (!this.qcFront) {
                    this.$nextTick(() => this.$refs.qcFront.focus())
                }
                if (!this.qcNo) {
                    this.$nextTick(() => this.$refs.qcNo.focus())
                }
            }
            else {
                this.showDialog = true
                this.showProgress = true
                db.collection("stock").doc(this.docId).update({
                    lastEdit: new Date().toISOString().substr(0, 10),
                    frame: this.qcFrame,
                    front: this.qcFront,
                    itemCode: this.qcItemCode,
                    warehouse: this.qcWarehouse
                })
                    .then(() => {
                        this.showDialog = true
                        this.showProgress = false
                        this.showSuccess = true
                        setTimeout(() => {
                            this.showDialog = false
                            this.showProgress = false
                            this.showSuccess = false
                            this.cancelEditQc()
                        }, 2000)
                    })
            }
        }
    },
    mounted() {
        this.getStock()
    }
}
</script>