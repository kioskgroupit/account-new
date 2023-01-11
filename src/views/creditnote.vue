<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1>Credit Note</h1>
                    <!-- <v-btn @click="test"></v-btn> -->
                    <hr>
                    <template>

                        <!-- Search invoice no -->
                        <v-layout justify-center>
                            <v-flex xs2 text-xs-right my-4>
                                <h3>Invoice no:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1 px-2>
                                <v-text-field v-model="searchInvNo" @keypress.enter="searchInvoice"
                                    ref="searchInvNo"></v-text-field>
                            </v-flex>
                            <v-flex xs2 my-2>
                                <v-btn @click="searchInvoice">
                                    <v-icon>search</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <hr>
                        <template>
                            <!-- Credit no -->
                            <v-layout>
                                <v-flex xs12 text-xs-right my-4>
                                    <h3>Credit no:</h3>
                                </v-flex>
                                <!-- <v-flex xs1 pa-1 pl-2 text-xs-right>
                                    <v-select :items="itemCdType" v-model="cdNo" @change="changeCdNo" 
                                    item-text="name" item-value="id"></v-select>
                                </v-flex> -->
                                <v-flex xs2 pa-1>
                                    <v-text-field v-model="cdNo" readonly></v-text-field>
                                </v-flex>
                            </v-layout>

                            <!-- Date selector -->
                            <v-layout>
                                <v-flex offset-xs10>
                                    <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40" lazy
                                        transition="scale-transition" offset-y full-width min-width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="cdDate" label="Date:" prepend-icon="event" readonly
                                                v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="cdDate" @input="menuDate = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>

                            <!-- Search customer info where customer name from database -->
                            <v-layout>
                                <v-flex xs2 text-xs-right my-4>
                                    <h3>Search customer name:</h3>
                                </v-flex>
                                <v-flex xs2 pa-1 px-2>
                                    <v-text-field v-model="searchName" ref="searchName"
                                        @keypress.enter="searchCustName()"></v-text-field>
                                </v-flex>
                                <v-flex xs1 my-2>
                                    <v-btn fab small color="indigo lighten-1" dark @click="searchCustName()">
                                        <v-icon>search</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>

                            <!-- Search customer info where customer code from database -->
                            <v-layout>
                                <v-flex xs2 text-xs-right my-4>
                                    <h3>Search customer code:</h3>
                                </v-flex>
                                <v-flex xs2 pa-1 px-2>
                                    <v-text-field v-model="searchCode" ref="searchCode" @keypress.enter="searchCustCode"
                                        @input="inputUpper"></v-text-field>
                                </v-flex>
                                <v-flex xs1 my-2>
                                    <v-btn fab small color="indigo lighten-1" dark @click="searchCustCode(code)">
                                        <v-icon>search</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>

                            <!-- Show customer info from the search in database -->
                            <v-dialog v-model="dialogCust" max-width="1280px">
                                <v-data-table :headers="headerCust" :items="customer" class="elevation-1">
                                    <template v-slot:items="props">
                                        <td class="text-xs-center">{{ props.item.code }}</td>
                                        <td>{{ props.item.name }}</td>
                                        <td>{{ props.item.address }}</td>
                                        <td>{{ props.item.contact }}</td>
                                        <td class="text-xs-left">{{ props.item.tel }}</td>
                                        <td hidden class="text-xs-left">{{ props.item.gp }}</td>
                                        <td hidden class="text-xs-left">{{ props.item.dc }}</td>
                                        <td class="justify-center layout px-0">
                                            <v-tooltip left>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon class="mr-1" @click="searchItem(props.item)"
                                                        v-on="on">check_circle_outline</v-icon>
                                                </template>
                                                <span>Choose this customer</span>
                                            </v-tooltip>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-dialog>

                            <!-- Customer info from the search in database -->
                            <div>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>Customer code:</v-flex>
                                    <v-flex xs6>
                                        <input type="text" class="inputCust" size="20" v-model="code" ref="custCode"
                                            disabled>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>Customer name:</v-flex>
                                    <v-flex xs6>
                                        <input type="text" class="inputCust" size="35" v-model="name">
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>Address:</v-flex>
                                    <v-flex xs8>
                                        <input type="text" class="inputCust" size="65" v-model="address" ref="address">
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>PO ref#:</v-flex>
                                    <v-flex xs5>
                                        <input type="text" class="inputCust" size="30" v-model="poRef" ref="poRef">
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>Contact name:</v-flex>
                                    <v-flex xs5>
                                        <input type="text" class="inputCust" size="25" v-model="contact">
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs2 text-xs-right my-1>Tel:</v-flex>
                                    <v-flex xs5>
                                        <input type="text" class="inputCust" autocomplete="off" v-model="tel">
                                    </v-flex>
                                </v-layout>
                            </div>
                            <br>
                            <hr>

                            <!-- Add new product button -->
                            <template v-if="showBtnNewProd">
                                <v-flex xs6 sm4 md3>
                                    <v-tooltip right>
                                        <template v-slot:activator="{ on }">
                                            <v-btn fab small color="primary" @click="openNewProd" v-on="on"><v-icon
                                                    dark>add</v-icon></v-btn>
                                        </template>
                                        <span>Add products</span>
                                    </v-tooltip>
                                </v-flex>
                            </template>

                            <!-- Add new product -->
                            <v-dialog v-model="dialogNewProd" persistent max-width="600px">
                                <v-card>
                                    <v-card-text>
                                        <span class="headline">Add new product</span>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs4>
                                                    <v-text-field label="Model:" v-model="prod.Code" ref="pCode"
                                                        @keypress.enter="searchProdCode"
                                                        @input="inputUpper"></v-text-field>

                                                    <!-- Show product info from the search in database -->
                                                    <v-dialog v-model="showProd" max-width="1024px">
                                                        <v-card>
                                                            <v-card-title><span class="headline">List
                                                                    product</span></v-card-title>
                                                            <v-card-text>
                                                                <v-data-table :headers="headerProCode"
                                                                    :items="listProduct" class="elevation-1">
                                                                    <template v-slot:items="props">
                                                                        <td>{{ props.item.Code }}</td>
                                                                        <td>{{ props.item.NameMM }}</td>
                                                                        <td class="text-xs-right">
                                                                            {{
                                                                                props.item.PriceMM.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                                                                    ",")
                                                                            }}</td>
                                                                        <td class="justify-center layout px-0">
                                                                            <v-tooltip right>
                                                                                <template v-slot:activator="{ on }">
                                                                                    <v-icon class="mr-1"
                                                                                        @click="selectProCode(props.item)"
                                                                                        v-on="on">check_circle_outline</v-icon>
                                                                                </template>
                                                                                <span>Choose this product</span>
                                                                            </v-tooltip>
                                                                        </td>
                                                                    </template>
                                                                </v-data-table>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-dialog>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field label="Description" v-model="prod.Name"
                                                        readonly></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex mt-2 xs2>
                                                    <v-select label="Frame:" :items="itemFrame" v-model="prod.frame"
                                                        ref="focusFrame"></v-select>
                                                </v-flex>
                                                <v-flex mt-2 xs2>
                                                    <v-select label="Front:" :items="itemFront" v-model="prod.front"
                                                        ref="focusFront"></v-select>
                                                </v-flex>
                                                <v-flex mt-2 xs2>
                                                    <v-text-field label="Quantity:" v-model="prod.Num" reverse
                                                        type="number" :min="1" ref="focusNum"></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-flex text-xs-right>
                                                        <font size=2>Price:</font>
                                                    </v-flex>
                                                    <v-flex>
                                                        <font size=3>
                                                            <vue-numeric separator="," :precision="2"
                                                                v-model="prod.Price" class="line"></vue-numeric>
                                                        </font>
                                                    </v-flex>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs5>
                                                    <v-select label="Discount:" :items="itemDisc" v-model="prod.disc"
                                                        @change="showDisc"></v-select>
                                                </v-flex>
                                                <v-flex xs7 mt-4>
                                                    <font size=3>
                                                        <vue-numeric v-if="showPercent" v-model="prod.percent" :min="0"
                                                            :max="100" class="line" ref="focusPercent"></vue-numeric>
                                                    </font>
                                                    <font size=3>
                                                        <vue-numeric separator="," :precision="2" :max="prod.Price"
                                                            v-if="showShockprice" v-model="prod.shockprice" class="line"
                                                            ref="focusShockprice"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout v-if="showGPandDC = true">
                                                <v-flex>
                                                    <v-flex text-xs-right>
                                                        <font size=2>GP(%):</font>
                                                    </v-flex>
                                                    <v-flex>
                                                        <font size=3>
                                                            <vue-numeric :min="0" :max="100" v-model="prod.gp"
                                                                class="line"></vue-numeric>
                                                        </font>
                                                    </v-flex>
                                                </v-flex>
                                                <v-flex>
                                                    <v-flex text-xs-right>
                                                        <font size=2>DC(%):</font>
                                                    </v-flex>
                                                    <v-flex>
                                                        <font size=3>
                                                            <vue-numeric :min="0" :max="100" v-model="prod.dc"
                                                                class="line"></vue-numeric>
                                                        </font>
                                                    </v-flex>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-flex text-xs-right>
                                                        <font size=2>Amount:</font>
                                                    </v-flex>
                                                    <v-flex>
                                                        <font size=3>
                                                            <vue-numeric class="line" separator="," :precision="2"
                                                                :value="prod.amt = prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent / 100))
                                                            - prod.shockprice - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent / 100)) - prod.shockprice) * (prod.gp / 100))
                                                            - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent / 100)) - prod.shockprice
                                                                - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent / 100)) - prod.shockprice) * (prod.gp / 100))) * (prod.dc / 100))"></vue-numeric>
                                                        </font>
                                                    </v-flex>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="red darken-1" @click="cancelAddProd">Cancel</v-btn>
                                            <v-btn flat color="blue darken-1" @click="addProd">Add</v-btn>
                                        </v-card-actions>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>

                            <template v-if="showDetails">

                                <!-- Header order detail -->
                                <v-layout pt-2 pb-2 indigo lighten-4>
                                    <v-flex pl-1 center>
                                        <h4>No</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Model</h4>
                                    </v-flex>
                                    <v-flex xs3 center pl-3>
                                        <h4>Description</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Frame</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Front</h4>
                                    </v-flex>
                                    <v-flex xs1 center pl-3>
                                        <h4>Quantity</h4>
                                    </v-flex>
                                    <v-flex xs2 right pr-2>
                                        <h4>Price</h4>
                                    </v-flex>
                                    <v-flex xs2 right pr-2>
                                        <h4>Amount</h4>
                                    </v-flex>
                                    <v-flex xs2 center></v-flex>
                                </v-layout>
                                <hr>

                                <!-- Order Detail -->
                                <v-layout v-for="(item, i) in orderDetails" :key="i" collapse>
                                    <v-flex my-3 pa-2 padDing class="txtCenter">
                                        <font size=3>{{ i+ 1}}</font>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.Code" ref="focusCode" readonly tabindex="-1"
                                            @keypress.enter="openNewProd"></v-text-field>
                                    </v-flex>
                                    <v-flex xs3 pl-3>
                                        <v-text-field v-model="item.NameMM" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.frame" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.front" readonly tabindex="-1"></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 pl-3>
                                        <v-text-field v-model="item.num" reverse type="number" :max="item.maxNum"
                                            min="0" @change="checkNum(item)"></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 my-3 pa-2 ml-1>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" v-model="item.PriceMM" disabled
                                                class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 my-3 pr-2 pa-2>
                                        <font size=3>
                                            <vue-numeric separator="," :precision="2" disabled
                                                :value="item.num * item.PriceMM" class="line"></vue-numeric>
                                        </font>
                                    </v-flex>
                                    <v-flex xs2 center my-2>
                                        <v-btn fab small color="primary" @click="openNewProd"
                                            :disabled="i != orderDetails.length - 1" v-if="!checkInv">
                                            <v-icon dark>add</v-icon>
                                        </v-btn>
                                        <v-tooltip bottom v-if="status == 'Open'">
                                            <template v-slot:activator="{ on }">
                                                <v-icon class="mr-4" color="red" v-on="on"
                                                    @click="returnProd(item)">rv_hookup</v-icon>
                                            </template>
                                            <span>Return products</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="status == 'Closed'">
                                            <template v-slot:activator="{ on }">
                                                <v-icon class="mr-4" color="green" v-on="on"
                                                    @click="returnProd(item)">rv_hookup</v-icon>
                                            </template>
                                            <span>Return products</span>
                                        </v-tooltip>
                                        <v-btn fab small color="error" @click="delDetail(item)" tabindex="-1">
                                            <v-icon dark>remove</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                                <hr>
                                <br>

                                <!-- Shipping info and summary info -->
                                <v-layout>

                                    <!-- Shipping info -->
                                    <v-flex xs5>
                                        <v-flex>
                                            <v-layout>
                                                <v-flex xs12 pr-2>
                                                    <v-textarea outline auto-grow rows="1" v-model="shipAdd"
                                                        label="Shipping Address:"></v-textarea>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs5>
                                                    <v-menu v-model="menushipDate" :close-on-content-click="false"
                                                        :nudge-right="40" lazy transition="scale-transition" offset-y
                                                        full-width min-width="290px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-model="shipDate" label="Shipping Date:"
                                                                prepend-icon="event" readonly v-on="on"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="shipDate"
                                                            @input="menushipDate = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-textarea outline auto-grow rows="1" v-model="remark"
                                                        label="Remarks:"></v-textarea>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-flex>

                                    <!-- Summary info -->
                                    <v-flex>
                                        <v-layout>
                                            <v-flex xs5 mr-1 class="sum">
                                                <font size=3>Total:</font>
                                            </v-flex>
                                            <v-flex xs4 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled :value="sumTotal"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs5 mr-1 class="sum">
                                                <font size=3>Discount:</font>
                                            </v-flex>
                                            <v-flex xs4 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" v-model="disc"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs5 mr-1 class="sum">
                                                <font size=3>Net amount:</font>
                                            </v-flex>
                                            <v-flex xs4 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" disabled :value="net"
                                                        class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs5 mr-1 class="sum">
                                                <font size=3>Down amount:</font>
                                            </v-flex>
                                            <v-flex xs4 pr-3 class="sum">
                                                <font size=3>
                                                    <vue-numeric separator="," :precision="2" v-model="downAmt"
                                                        :max="down" class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                        <v-layout>
                                            <v-flex xs5 mr-1 class="sum">
                                                <font size=3>Balance amount to be paid:</font>
                                            </v-flex>
                                            <v-flex xs4 pr-3 class="sum">
                                                <font size=3 color=red>
                                                    <vue-numeric separator="," :precision="2" disabled
                                                        :value="balanceAmt" class="line"></vue-numeric>
                                                </font>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>

                                </v-layout>

                                <hr>
                                <br>

                                <!-- Save and cancel button -->
                                <v-layout align-center column>
                                    <v-flex>
                                        <v-btn @click="saveCreditNote">
                                            <v-icon dark>save</v-icon>
                                            Save
                                        </v-btn>
                                        <v-btn @click="clearPage">
                                            <v-icon dark>clear</v-icon>
                                            Cancel
                                        </v-btn>
                                    </v-flex>
                                </v-layout>

                            </template>
                        </template>
                    </template>
                </v-card-text>
            </v-card>

            <template>
                <v-dialog v-model="showLoading" persistent width="unset">
                    <div class="text-center">
                        <v-card>
                            <v-card-text>
                                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                            </v-card-text>
                        </v-card>
                    </div>
                </v-dialog>
            </template>
        </v-container>
    </v-app>
</template>
<script>
import { db } from '@/firebase'
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'
// import { setTimeout } from 'timers';
export default {
    components: {
        mainMenu,
        VueNumeric
    },
    data() {
        return {
            subTime: new Date().toTimeString().substr(0, 8),
            invNo: '',
            orderNo: '',
            showLoading: false,
            detail: [],
            dialogStock: false,
            itemPayMent: [],
            menuPayDateOrder: false,
            payDateOrder: new Date().toISOString().substr(0, 10),
            itemDownPayment: ['Down payment', 'No down payment'],
            disc: 0,
            down: 0,
            downAmt: 0,
            remark: '',
            menushipDate: false,
            shipDate: new Date().toISOString().substr(0, 10),
            shipAdd: '',
            showDetails: false,
            orderDetails: [],
            showPercent: false,
            showShockprice: false,
            showGPandDC: false,
            itemDisc: ['Percent(%)', 'Shock Price(MMK)'],
            itemFrame: [],
            itemFront: [],
            headerProCode: [
                { text: 'Product code', value: 'Code' },
                { text: 'Product name', sortable: false, },
                { text: 'Price', align: 'right', sortable: false, },
                { text: '', align: 'right', sortable: false, },
            ],
            listProduct: [],
            showProd: false,
            prod: {
                Code: '',
                Name: '',
                frame: '',
                front: '',
                Num: 1,
                Price: 0,
                disc: 0,
                percent: 0,
                shockprice: 0,
            },
            dialogNewProd: false,
            showBtnNewProd: false,
            headerCust: [
                { text: 'Customer code', align: 'center', value: 'code' },
                { text: 'Customer name', sortable: false, align: 'center' },
                { text: 'Address', sortable: false, align: 'center' },
                { text: 'Contact name', sortable: false, align: 'center' },
                { text: 'Telephone number', sortable: false, align: 'center' },
                { text: '', sortable: false, align: 'center' },
            ],
            dialogCust: false,
            customer: [],
            searchName: '',
            searchCode: '',
            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',
            status: '',
            menuDate: false,
            cdDate: new Date().toISOString().substr(0, 10),
            cdNo: '',
            searchInvNo: '',
            checkInv: ''
        }
    },
    methods: {

        test() {
            db.collection("stock").add({
                puNo: "PU200001",
                date: "2020-02-20",
                lastEdit: '',
                itemCode: "SOD-3K",
                frame: "DG",
                front: "GR",
                qc: "D5C3D5E6D2",
                amt: 500,
                warehouse: "00 : Head office",
                invNo: 'V190307',
                dnNo: 'DN200001',
                dnDate: '2020-02-26'
            })
                .then(() => {
                    console.log("Success.")
                })
        },
        returnProd(item) {
            let routeData = this.$router.resolve({
                name: 'returnproduct', query:
                {
                    invNo: item.invNo
                }
            })
            window.location.assign(routeData.href)
        },
        getStock(item) {
            let app = this
            let duplicate = []
            this.detail.forEach(rec => {
                if (rec.qc == item.qc) {
                    duplicate.push(item.qc)
                }
            })
            if (duplicate.length > 1) {
                alert("Duplicate values, please change to new qc.")
                item.qc = ""
            }
            else {
                db.collection("stock").where("qc", "==", item.qc).get()
                    .then(query => {
                        if (!query.docs[0]) {
                            alert("Data not found.")
                            item.qc = ""
                        }
                        else {
                            query.forEach(doc => {
                                if (app.searchInvNo != doc.data().invNo) {
                                    alert("This QC does not match the number on this invoice.")
                                }
                                else {
                                    app.detail.forEach(rec => {
                                        rec.id = ''
                                        if (rec.qc == item.qc) {
                                            rec.id = query.docs[0].id
                                        }
                                    })
                                    alert("This QC match the number on this invoice " + app.searchInvNo)
                                }
                            })

                        }
                    })
            }
        },

        // Open return stock
        saveCreditNote() {
            let app = this
            app.detail = []
            let count = 0
            let arrCode = []
            app.orderDetails.every(rec => {
                if (rec.num == 0) {
                    alert("Quantity cannot be 0")
                    count++
                    return false
                }
                else {
                    if (rec.num > 1) {
                        for (let i = 0; i < rec.num; i++) {
                            arrCode.push(rec)
                        }
                    }
                    else {
                        arrCode.push(rec)
                    }
                    return true
                }
            })
            if (count == 0) {
                app.showLoading = true
                let year = new Date().toISOString().substr(0, 4)

                // Old invoice
                if (app.checkInv) {
                    db.collection("invoice").where("cnNo", "==", app.cdNo).get()
                        .then(queryInvoice => {
                            if (queryInvoice.docs[0]) {
                                app.showLoading = false
                                alert("Repeated credit note number\nPlease try again.")
                            }
                            else {
                                db.collection("counter").doc(year).get()
                                    .then(queryCount => {
                                        let count = queryCount.data().cn + 1
                                        db.collection("counter").doc(year).update({
                                            cn: count
                                        })
                                            .then(() => {
                                                db.collection("counter").doc(year).get()
                                                    .then(docIN => {
                                                        let countIN = docIN.data().in + 1
                                                        if (countIN <= 9999) {
                                                            countIN = ("000" + countIN).slice(-4)
                                                        }
                                                        let subYear = app.cdDate.substr(2, 2)
                                                        let inNo = subYear + countIN
                                                        db.collection("counter").doc(year).update({
                                                            in: countIN
                                                        })
                                                            .then(() => {
                                                                let batch = db.batch()
                                                                batch.set(db.collection("invoice").doc(), {
                                                                    orderNo: app.orderNo,
                                                                    invNo: app.cdNo,
                                                                    invDate: app.cdDate + " " + app.subTime,
                                                                    code: app.code,
                                                                    name: app.name,
                                                                    address: app.address,
                                                                    poRef: app.poRef,
                                                                    contact: app.contact,
                                                                    tel: app.tel,
                                                                    desc: 'Credit note',
                                                                    detail: app.orderDetails,
                                                                    disc: app.disc,
                                                                    net: app.net,
                                                                    down: app.downAmt,
                                                                    balance: (app.net - app.downAmt) * 1,
                                                                    shipAdd: app.shipAdd,
                                                                    shipDate: app.shipDate,
                                                                    remark: app.remark,
                                                                    countPayment: [],
                                                                    status: 'Open',
                                                                    payMentStatus: 'Not paid yet',
                                                                    printed: 0,
                                                                    statusType: '',
                                                                })
                                                                batch.set(db.collection("generalLedger").doc(), {
                                                                    custCode: app.code,
                                                                    glNo: inNo,
                                                                    glDate: app.cdDate,
                                                                    refNo: app.cdNo,
                                                                    desc: 'Credit note',
                                                                    accId: '410101',
                                                                    accName: 'Returned and Discount',
                                                                    debit: app.balanceAmt,
                                                                    credit: 0,
                                                                    remark: '',
                                                                })
                                                                batch.set(db.collection("generalLedger").doc(), {
                                                                    custCode: app.code,
                                                                    glNo: inNo,
                                                                    glDate: app.cdDate,
                                                                    refNo: app.cdNo,
                                                                    desc: 'Credit note',
                                                                    accId: '112001',
                                                                    accName: 'Accounts Receivable',
                                                                    debit: 0,
                                                                    credit: app.balanceAmt,
                                                                    remark: '',
                                                                })
                                                                batch.commit().then(() => {
                                                                    setTimeout(() => {
                                                                        app.clearPage()
                                                                        app.showLoading = false
                                                                    }, 1000)
                                                                })
                                                                    .catch(err => {
                                                                        app.showLoading = false
                                                                        alert(err + "\nUnable to save data.")
                                                                    })
                                                            })
                                                    })
                                            })
                                    })
                            }
                        })
                }

                // New invoice
                else {
                    db.collection("invoice").where("cnNo", "==", app.cdNo).get()
                        .then(queryInvoice => {
                            if (queryInvoice.docs[0]) {
                                app.showLoading = false
                                alert("Repeated credit note number\nPlease try again.")
                            }
                            else {
                                db.collection("counter").doc(year).get()
                                    .then(queryCount => {
                                        let count = queryCount.data().cn + 1
                                        db.collection("counter").doc(year).update({
                                            cn: count
                                        })
                                            .then(() => {
                                                let batch = db.batch()
                                                batch.set(db.collection("invoice").doc(), {
                                                    orderNo: app.orderNo,
                                                    invNo: app.cdNo,
                                                    invDate: app.cdDate + " " + app.subTime,
                                                    code: app.code,
                                                    name: app.name,
                                                    address: app.address,
                                                    poRef: app.poRef,
                                                    contact: app.contact,
                                                    tel: app.tel,
                                                    desc: 'Credit note',
                                                    detail: app.orderDetails,
                                                    disc: app.disc,
                                                    net: app.net,
                                                    down: app.downAmt,
                                                    balance: 0,
                                                    shipAdd: app.shipAdd,
                                                    shipDate: app.shipDate,
                                                    remark: app.remark,
                                                    countPayment: [],
                                                    status: 'Open',
                                                    payMentStatus: '',
                                                    printed: 0,
                                                    statusType: '',
                                                })
                                                batch.set(db.collection("generalLedger").doc(), {
                                                    custCode: app.code,
                                                    glNo: '',
                                                    glDate: app.cdDate,
                                                    refNo: app.cdNo,
                                                    desc: 'Credit note',
                                                    accId: '410101',
                                                    accName: 'Returned and Discount',
                                                    debit: app.balanceAmt,
                                                    credit: 0,
                                                    remark: '',
                                                })
                                                batch.set(db.collection("generalLedger").doc(), {
                                                    custCode: app.code,
                                                    glNo: '',
                                                    glDate: app.cdDate,
                                                    refNo: app.cdNo,
                                                    desc: 'Credit note',
                                                    accId: '112001',
                                                    accName: 'Accounts Receivable',
                                                    debit: 0,
                                                    credit: app.balanceAmt,
                                                    remark: '',
                                                })
                                                batch.commit().then(() => {
                                                    setTimeout(() => {
                                                        app.clearPage()
                                                        app.showLoading = false
                                                    }, 1000)
                                                })
                                                    .catch(err => {
                                                        app.showLoading = false
                                                        alert(err + "\nUnable to save data.")
                                                    })
                                            })
                                    })
                            }
                        })
                }
            }
        },

        // Delete the selected product
        delDetail(item) {
            if (this.orderDetails.length > 1) {
                this.orderDetails.splice(this.orderDetails.findIndex(detail => detail == item), 1)
            }
            else {
                this.orderDetails.splice(this.orderDetails.findIndex(detail => detail == item), 1)
                this.showDetails = false
                this.showBtnNewProd = true
                // this.showSearchProCode = false
            }
        },

        // Show product from search
        selectProCode(item) {
            this.prod.Code = item.Code
            this.prod.Name = item.NameMM
            this.prod.Price = item.PriceMM
            this.showProd = false
            this.$refs.focusFrame.focus()
        },

        // Show product info from the search in the database
        searchProdCode() {
            let app = this
            this.listProduct = []
            if (!this.prod.Code) {
                alert("Please input product code.")
                this.$refs.pCode.focus()
            }
            else {
                db.collection("code").doc("productcode").collection("proCode").orderBy("Code")
                    .startAt(this.prod.Code).endAt(this.prod.Code + "\uf8ff").get()
                    .then(query => {
                        query.forEach(doc => {
                            app.listProduct.push(doc.data())
                        })
                        if (app.listProduct.length == 0) {
                            alert("This account code is not in the system.")
                        }
                        else {
                            app.showProd = true
                            // app.orderDetailCurPos = index
                        }
                    })
            }
        },

        // Add product in new line
        addProd() {
            if (!this.prod.Code || !this.prod.Name || !this.prod.frame || !this.prod.front || !this.prod.Price) {
                if (!this.prod.Code) {
                    alert("Please input product code.")
                    this.$refs.focusProdCode.focus()
                }
                else if (!this.prod.Name) {
                    alert("Please input product name.")
                }
                else if (!this.prod.frame) {
                    alert("Please select frame color.")
                    this.$refs.focusFrame.focus()
                }
                else if (!this.prod.front) {
                    alert("Please select front color.")
                    this.$refs.focusFront.focus()
                }
                else if (!this.prod.Price) {
                    alert("Please enter price.")
                }
            }
            else {
                this.showDetails = true
                this.orderDetails.push(
                    {
                        Code: this.prod.Code, NameMM: this.prod.Name,
                        frame: this.prod.frame, front: this.prod.front,
                        num: this.prod.Num, numSend: 0,
                        PriceMM: this.prod.amt / this.prod.Num, amt: this.prod.amt
                    }
                )
                this.cancelAddProd()
                this.showBtnNewProd = false
                this.$nextTick(() => {
                    let i = this.orderDetails.length - 1
                    let input = this.$refs.focusCode[i]
                    input.focus()
                })
            }
        },

        // Clear add new product page and close
        cancelAddProd() {
            this.prod.Code = ''
            this.prod.Name = ''
            this.prod.frame = ''
            this.prod.front = ''
            this.prod.Num = 1
            this.prod.Price = 0
            this.prod.percent = 0
            this.prod.shockprice = 0
            this.prod.amt = 0
            this.prod.disc = []
            this.showShockprice = false
            this.showPercent = false
            this.dialogNewProd = false
        },

        // Show discount is percent or shock price
        showDisc() {
            if (this.prod.disc == 'Percent(%)') {
                this.showPercent = true
                this.showShockprice = false
                this.prod.shockprice = 0
                // this.$nextTick(()=>{this.$refs.focusPercent.focus()})
            }
            else {
                this.showShockprice = true
                this.showPercent = false
                this.prod.percent = 0
                // this.$nextTick(()=>{this.$refs.focusShockprice.focus()})
            }
        },

        // Add products to the new line
        openNewProd() {
            this.dialogNewProd = true
            setTimeout(() => {
                this.$nextTick(() => this.$refs.pCode.focus())
            }, 1)
        },

        // Select customer
        searchItem(item) {
            this.code = item.code
            this.name = item.name
            this.address = item.address
            this.contact = item.contact
            this.tel = item.tel
            this.prod.gp = item.gp
            this.prod.dc = item.dc
            this.shipAdd = item.address
            this.dialogCust = false
            this.searchName = ''
            this.searchCode = ''
            this.$nextTick(() => this.$refs.address.focus())
            this.showBtnNewProd = true
        },

        // Search customer info in the database by code
        searchCustCode() {
            this.searchInvNo = ''
            if (this.searchCode == "") {
                alert("Please input customer name.")
                this.$refs.searchCode.focus()
                this.showBtnNewProd = false
            }
            else {
                let app = this
                db.collection("customer").orderBy("code").startAt(this.searchCode).endAt(this.searchCode + "\uf8ff").get()
                    .then(querySnapshot => {
                        app.customer = []
                        querySnapshot.forEach(doc => {
                            app.customer.push(doc.data())
                        })
                        if (app.customer.length == 0) {
                            alert("This customer name is not in the system.")
                            app.$nextTick(() => app.$refs.searchCode.focus())
                            app.showBtnNewProd = false
                        }
                        else {
                            app.dialogCust = true
                        }
                    })
                    .catch(error => {
                        console.log("Error getting documents: ", error)
                    })
            }
        },

        // Search customer info in the database by name
        searchCustName() {
            this.searchInvNo = ''
            if (this.searchName == "") {
                alert("Please input customer name.")
                this.$refs.searchName.focus()
                this.showBtnNewProd = false
            }
            else {
                let app = this
                db.collection("customer").orderBy("name").startAt(this.searchName).endAt(this.searchName + "\uf8ff").get()
                    .then(querySnapshot => {
                        app.customer = []
                        querySnapshot.forEach(doc => {
                            app.customer.push(doc.data())
                        })
                        if (app.customer.length == 0) {
                            alert("This customer name is not in the system.")
                            app.$nextTick(() => app.$refs.searchName.focus())
                            app.showBtnNewProd = false
                        }
                        else {
                            app.dialogCust = true
                        }
                    })
                    .catch(error => {
                        console.log("Error getting documents: ", error)
                    })
            }
        },

        // Credit no auto
        getCreditNo() {
            let year = this.cdDate.substr(0, 4)
            let subYear = this.cdDate.substr(2, 2)
            db.collection("counter").doc(year).get()
                .then(doc => {
                    let typeDoc = doc.data().cn + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.cdNo = "CN" + subYear + typeDoc
                })
        },

        clearPage() {
            this.showBtnNewProd = false
            this.showDetails = false
            this.orderNo = ''
            this.code = ''
            this.name = ''
            this.address = ''
            this.poRef = ''
            this.contact = ''
            this.tel = ''
            this.orderDetails = []
            this.checkInv = '',
                this.shipAdd = ''
            this.shipDate = new Date().toISOString().substr(0, 10)
            this.remark = ''
            this.searchInvNo = ''
            this.cdDate = new Date().toISOString().substr(0, 10)
            this.getCreditNo()
            this.$nextTick(() => this.$refs.searchInvNo.focus())
        },

        clearInfo() {
            this.showBtnNewProd = false
            this.showDetails = false
            this.searchName = ''
            this.searchCode = ''
            this.code = ''
            this.name = ''
            this.address = ''
            this.poRef = ''
            this.contact = ''
            this.tel = ''
            this.orderDetails = []
            this.checkInv = '',
                this.shipAdd = ''
            this.shipDate = new Date().toISOString().substr(0, 10)
            this.remark = ''
        },

        // Search invoice
        searchInvoice() {
            this.clearInfo()
            if (!this.searchInvNo) {
                alert("Please input invoice no.")
            }
            else {
                db.collection("invoice").where("invNo", "==", this.searchInvNo).get()
                    // db.collection("invoice").where("invNo", "==", this.searchInvNo).where("status", "==", "Closed").get()
                    .then(query => {
                        if (!query.docs[0]) {
                            alert("Data not found.")
                        }
                        else {
                            query.forEach(doc => {
                                let data = doc.data()
                                if (doc.data().status == 'Cancelled') {
                                    alert("Data not found.")
                                }
                                else {
                                    this.invNo = data.invNo
                                    this.orderNo = data.orderNo
                                    this.code = data.code
                                    this.name = data.name
                                    this.address = data.address
                                    this.poRef = data.poRef
                                    this.contact = data.contact
                                    this.tel = data.tel
                                    this.status = data.status
                                    this.orderDetails = data.detail
                                    this.disc = data.disc
                                    this.down = data.down
                                    this.checkInv = data.invNo
                                    this.shipAdd = data.shipAdd
                                    this.shipDate = data.shipDate
                                    this.remark = data.remark
                                    this.orderDetails.forEach(rec => {
                                        rec.maxNum = rec.num
                                    })
                                    this.showDetails = true
                                }
                            })

                        }
                    })
            }
        },

        // Check num
        checkNum(item) {
            if (item.num > item.maxNum) {
                item.num = item.maxNum
            }
            if (item.num < 0) {
                item.num = 0
            }
        },

        // Input to Upper case
        inputUpper() {
            if (this.searchCode) {
                this.searchCode = this.searchCode.toUpperCase()
            }
            if (this.prod.Code) {
                this.prod.Code = this.prod.Code.toUpperCase()
            }
        },

        upperQC(item) {
            item.qc = item.qc.toUpperCase()
        },
    },
    computed: {
        // Calculate total
        sumTotal() {
            return this.orderDetails.reduce((total, item) => total + (item.num * item.PriceMM), 0)
        },

        net() {
            return this.sumTotal - this.disc
        },

        // Calculate down balance
        downBalance() {
            return this.down - this.downAmt
        },

        balanceAmt() {
            return this.net - this.downAmt
        },
    },
    mounted() {
        this.getCreditNo()
        let app = this
        db.collection("chartAccount").where("cash", "==", "Y").get()
            .then(payment => {
                app.itemPayMent = []
                payment.forEach(doc => {
                    let readDoc = doc.data().accName
                    app.itemPayMent.push(readDoc)
                })
            })
        db.collection("code").doc("color").get()
            .then(color => {
                this.itemFrame = (color.data().frame.sort())
                this.itemFront = (color.data().front.sort())
            })
        this.$nextTick(() => this.$refs.searchInvNo.focus())
    }
}
</script>
<style scoped>
.center {
    text-align: center;
}

.right {
    text-align: right;
}

.inputCust {
    height: 30px;
    padding: 13px 10px;
    display: inline-block;
    border-bottom: 1px solid black;
}

.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
}

.sum {
    text-align: right;
    width: 100%;
}
</style>
