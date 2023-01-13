<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Stock Balance</h1>
                    <hr>
                    <v-layout>
                        <v-flex xs2>
                            <v-select :items="itemsWarehouse" v-model="warehouse" label="Warehouse filter:"
                                @change="warehouseFilter"></v-select>
                        </v-flex>
                    </v-layout>
                    <v-data-table :headers="headers" :items="detail" class="elevation-1">
                        <template v-slot:no-data>
                            <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                        </template>
                        <template v-slot:items="props">
                            <td>{{ props.item.warehouse }}</td>
                            <td>{{ props.item.itemCode }}</td>
                            <td>{{ props.item.frame }}</td>
                            <td>{{ props.item.front }}</td>
                            <td class="text-xs-right">{{ props.item.qty }}</td>
                            <td class="text-xs-right">
                                {{ props.item.amt.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>
<script>
import { collection, getDocs, where, getFirestore, runTransaction, query, orderBy, doc, addDoc } from "firebase/firestore";
// import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        mainMenu
    },
    data() {
        return {
            detail: [],
            cloneDetail: [],
            headers: [
                { text: 'Warehouse', sortable: false, align: 'left' },
                { text: 'Item code', value: 'itemCode', align: 'left' },
                { text: 'Frame color', sortable: false, align: 'left' },
                { text: 'Front color', sortable: false, align: 'left' },
                { text: 'QTY', value: 'qty', align: 'right' },
                { text: 'Amount', sortable: false, align: 'right' },
            ],
            itemsWarehouse: [],
            warehouse: '',
        }
    },
    methods: {
        test() {
            // db.collection("stock").add({
            //     puNo: "PU190001",
            //     date: "2019-11-21",
            //     itemCode: "WD-05-2KPT/B",
            //     frame: "PP",
            //     front: "OR",
            //     qc: "W6SDJI5OLM",
            //     amt: 2000,
            //     dnNo: '',
            //     dnDate: '',
            //     warehouse: "00 : Head office"
            // })
            // .then(()=>{
            //     console.log("Success.")
            // })
        },
        // Get stock balance
        getStockBalance() {
            db.collection("stock").where("dnNo", "==", "").get()
                .then(query => {
                    this.detail = []
                    let data = []
                    this.itemsWarehouse = []
                    this.itemsWarehouse.push("")
                    query.forEach(doc => {
                        data.push(doc.data())
                        this.itemsWarehouse.push(doc.data().warehouse)
                    })
                    data.sort((a, b) => a.itemCode.localeCompare(b.itemCode))
                    let itemCode = null
                    let frame = null
                    let front = null
                    let qty = 0
                    let amt = 0
                    let warehouse = null
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].itemCode != itemCode || data[i].frame != frame || data[i].front != front || data[i].warehouse != warehouse) {
                            if (qty > 0) {
                                this.cloneDetail.push({ itemCode: itemCode, frame: frame, front: front, qty: qty, amt: amt, warehouse: warehouse })
                            }
                            amt = 0
                            itemCode = data[i].itemCode
                            frame = data[i].frame
                            front = data[i].front
                            qty = 1
                            amt += data[i].amt
                            warehouse = data[i].warehouse
                        }
                        else {
                            amt += data[i].amt
                            qty++
                        }
                    }
                    if (qty > 0) {
                        this.cloneDetail.push({ itemCode: itemCode, frame: frame, front: front, qty: qty, amt: amt, warehouse: warehouse })
                    }
                    this.detail = this.cloneDetail
                })
        },
        // Warehouse filter
        warehouseFilter() {
            this.detail = this.cloneDetail.filter(rec => this.warehouse == rec.warehouse.slice(0, this.warehouse.length))
        }
    },
    mounted() {
        this.getStockBalance()
    }
}
</script>