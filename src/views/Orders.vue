<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container fluid>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Sales Order</h1>
                    <hr>
                    <div>
                        <v-layout>
                            <v-flex xs12></v-flex>
                            <v-flex xs12 d-flex justify-end pa-2 my-4><h3>Order no:</h3></v-flex>
                            <v-flex xs1 pa-1 pl-2 text-xs-right>
                                <v-select :items="itemOrderType" v-model="orderType" ref="orderType"
                                    @change="changeOrderNo()" item-text="name" item-value="id"></v-select>
                            </v-flex>
                            <v-flex xs2 pa-1>
                                <v-text-field v-model="orderNo" readonly tabindex="-1"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout>
                            <v-flex offset-xs11>
                                <v-menu v-model="menuorderDate" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-model="orderDate" label="Date:" prepend-icon="mdi-calendar"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="orderDate" @input="menuorderDate = false"></v-date-picker>
                                </v-menu>
                            </v-flex>
                        </v-layout>

                        <!-- customer info -->

                        <!-- Search customer info where customer name from database -->
                        <v-layout>
                            <v-flex xs2 text-xs-right my-4>
                                <h3>Search customer name:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1 px-2>
                                <v-text-field v-model="searchName" ref="searchName" @keypress.enter="searchCustName()"
                                    spellcheck="false"></v-text-field>
                            </v-flex>
                            <v-flex xs1 my-2>
                                <v-btn fab small color="indigo lighten-1" dark @click="searchCustName()">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>

                        <!-- Search customer info where customer code from database -->
                        <v-layout>
                            <v-flex xs2 text-xs-right my-4>
                                <h3>Search customer code:</h3>
                            </v-flex>
                            <v-flex xs2 pa-1 px-2>
                                <v-text-field v-model="searchCode" ref="focusSearchCode"
                                    @keypress.enter="searchCustCode()" spellcheck="false"></v-text-field>
                            </v-flex>
                            <v-flex xs1 my-2>
                                <v-btn fab small color="indigo lighten-1" dark @click="searchCustCode()">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>

                        <!-- Show customer info from the search in database -->
                        <v-dialog v-model="dialogCust" max-width="1280px">
                            <v-data-table :headers="headers" :items="customer" class="elevation-1">
                                        <template v-slot:item="props">
                                            <td class="text-center">{{props.item.code}}</td>
                                            <td class="text-center">{{props.item.name}}</td>
                                            <td class="text-center">{{props.item.address}}</td>
                                            <td class="text-center">{{props.item.contact}}</td>
                                            <td class="text-center">{{props.item.tel}}</td>
                                            <td class="text-center">
                                                <v-tooltip left>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon @click="searchItem(props.item)" color="primary" dark v-bind="attrs" v-on="on">
                                                            mdi-check-circle
                                                        </v-icon>
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
                                    <input type="text" class="inputCust" size="65" v-model="address" ref="focusAddress">
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-flex xs2 text-xs-right my-1>PO ref#:</v-flex>
                                <v-flex xs5>
                                    <input type="text" class="inputCust" size="30" v-model="poRef">
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

                        <!-- Add new product button -->
                        <div v-if="showOpenDetail">
                            <v-flex xs6 sm4 md3>
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="primary" @click="openDetail()" v-on="on"><v-icon dark>mdi-plus</v-icon></v-btn>
                                    </template>
                                    <span>Add products</span>
                                </v-tooltip>
                            </v-flex>
                        </div>

                        <!-- Add new product -->
                        <v-dialog v-model="dialogProd" persistent max-width="600px">
                            <v-card>
                                <v-card-text>
                                    <span class="headline">Add new product</span>
                                    <v-container grid-list-md>
                                        <v-layout>
                                            <v-flex xs4>
                                                <v-text-field label="Model:" v-model="prod.Code" ref="focusProdCode"
                                                    @keypress.enter="searchProdCode" @input="uppercase"></v-text-field>

                                                <!-- Show product info from the search in database -->
                                                <v-dialog v-model="showSearchProCode" max-width="1024px">
                                                    <v-card>
                                                        <v-card-title><span class="headline">List
                                                                product</span></v-card-title>
                                                        <v-card-text>
                                                            <v-data-table :headers="headerProCode" :items="listProduct"
                                                                class="elevation-1">
                                                                <template v-slot:items="props">
                                                                    <td>{{props.item.Code}}</td>
                                                                    <td>{{props.item.NameMM}}</td>
                                                                    <td class="text-xs-right">
                                                                        {{props.item.PriceMM.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                                                        ",")}}</td>
                                                                    <td class="justify-center layout px-0">
                                                                        <v-tooltip right>
                                                                            <v-menu offset-y>
                                                                                <template v-slot:activator="{ on, attrs }">
                                                                                    <v-icon v-bind="attrs" v-on="on">
                                                                                        mdi-check-circle
                                                                                    </v-icon>
                                                                                </template>
                                                                            </v-menu>
                                                                            <!-- <template v-slot:activator="{ on }">
                                                                                <v-icon class="mr-1"
                                                                                    @click="selectProCode(props.item)"
                                                                                    v-on="on">mdi-check-circle</v-icon>
                                                                            </template> -->
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
                                                <v-select label="Frame:" :items="itemFrame[0]" v-model="prod.frame"
                                                    ref="focusFrame"></v-select>
                                            </v-flex>
                                            <v-flex mt-2 xs2>
                                                <v-select label="Front:" :items="itemFront[0]" v-model="prod.front"
                                                    ref="focusFront"></v-select>
                                            </v-flex>
                                            <v-flex mt-2 xs2>
                                                <v-text-field label="Quantity:" v-model="prod.Num" reverse type="number"
                                                    :min="1" ref="focusNum"></v-text-field>
                                            </v-flex>
                                            <v-flex>
                                                <v-flex text-xs-right>
                                                    <font size=2>Price:</font>
                                                </v-flex>
                                                <v-flex>
                                                    <font size=3>
                                                        <vue-numeric separator="," :precision="2" v-model="prod.Price"
                                                            class="line"></vue-numeric>
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
                                        <v-layout v-if="showGPandDC=true">
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
                                                            :value="prod.amt=prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent/100)) 
                                                        - prod.shockprice - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent/100)) - prod.shockprice) * (prod.gp/100))
                                                        - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent/100)) - prod.shockprice
                                                        - ((prod.Num * prod.Price - ((prod.Num * prod.Price) * (prod.percent/100)) - prod.shockprice) * (prod.gp/100))) * (prod.dc/100))"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" @click="cancelAddProd">Cancel</v-btn>
                                        <v-btn color="blue darken-1" @click="addProd">Add</v-btn>
                                    </v-card-actions>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                        <hr>
                        <div v-if="showDetails">

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
                            <v-layout v-for="(item,i) in orderDetails" :key="i" collapse>
                                <v-flex my-3 pa-2 padDing class="txtCenter">
                                    <font size=3>{{i+1}}</font>
                                </v-flex>
                                <v-flex xs1 pl-3>
                                    <v-text-field v-model="item.Code" ref="focusCode" readonly tabindex="-1"
                                        @keypress.enter="addDetail"></v-text-field>
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
                                    <v-text-field v-model="item.num" reverse type="number" readonly
                                        tabindex="-1"></v-text-field>
                                </v-flex>
                                <v-flex xs2 my-3 pa-2 ml-1>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" v-model="item.PriceMM" disabled
                                            class="line"></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs2 my-3 pr-2 pa-2>
                                    <font size=3>
                                        <vue-numeric separator="," :precision="2" disabled v-model="item.amt"
                                            class="line"></vue-numeric>
                                    </font>
                                </v-flex>
                                <v-flex xs2 center my-2>
                                    <v-btn fab small color="primary" @click="addDetail"
                                        :disabled="i != orderDetails.length -1">
                                        <v-icon dark>add</v-icon>
                                    </v-btn>
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
                                            <v-flex xs8 pr-2>
                                                <v-textarea outline auto-grow rows="1" v-model="shipAdd"
                                                    label="Shipping Address:"></v-textarea>
                                            </v-flex>
                                            <v-flex xs4>
                                                <v-textarea outline auto-grow rows="1" v-model="district"
                                                    label="Districts:" ref="focusDistict"></v-textarea>
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

                                        <!-- Down payment -->
                                        <v-layout>
                                            <v-flex xs4>
                                                <v-select :items="itemDownPayment" v-model="statusDown"
                                                    label="Status down payment:" @change="changeStatus()"></v-select>
                                            </v-flex>
                                            <v-layout v-if="showDownPayment">
                                                <v-flex xs4 text-xs-right py-4>
                                                    <h3>Down payment:</h3>
                                                </v-flex>
                                                <v-flex xs4 pa-1 pt-4>
                                                    <font size=3><vue-numeric separator="," :precision="2"
                                                            v-model="downAmt" class="line" :max="sumNet"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                                <v-flex xs4 px-2>
                                                    <v-menu v-model="menuPayDateOrder" :close-on-content-click="false"
                                                        :nudge-right="40" lazy transition="scale-transition" offset-y
                                                        full-width min-width="290px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field v-model="payDateOrder" label="Date:"
                                                                prepend-icon="event" readonly v-on="on"
                                                                ref="payDateOrder"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="payDateOrder"
                                                            @input="menuPayDateOrder = false"></v-date-picker>
                                                    </v-menu>
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>
                                        <v-layout v-if="showDownPayment">
                                            <v-flex xs6>
                                                <v-select :items="itemPayMent" v-model="payMent" label="Payment:"
                                                    ref="payMent"></v-select>
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
                                            <font size=3><vue-numeric separator="," :precision="2" v-model="disc"
                                                    class="line"></vue-numeric></font>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs5 mr-1 class="sum">
                                            <font size=3>Net amount:</font>
                                        </v-flex>
                                        <v-flex xs4 pr-3 class="sum">
                                            <font size=3>
                                                <vue-numeric separator="," :precision="2" disabled :value="sumNet"
                                                    class="line"></vue-numeric>
                                            </font>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>

                            </v-layout>
                            <hr>
                        </div>
                        <br>

                        <!-- save, cancel and print button -->
                        <v-layout align-center column>
                            <v-flex>
                                <v-btn class="mr-2" @click="addOrder()">
                                    <v-icon dark>mdi-content-save</v-icon>
                                    Save
                                </v-btn>
                                <v-btn class="ml-2" @click="clearOrder()">
                                    <v-icon dark>mdi-close</v-icon>
                                    Cancel
                                </v-btn>
                                <v-btn v-if="showPrint" @click="printOrder">
                                    <v-icon>print</v-icon>
                                    Print
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

import { collection, getDocs, where, getFirestore, query, orderBy, doc } from "firebase/firestore";
import VueNumeric from 'vue-numeric'
import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        VueNumeric,
        mainMenu
    },
    data() {
        return {
            showGPandDC: false,
            showPrint: false,
            subTime: new Date().toTimeString().substr(0, 8),
            dialogCust: false,
            menuorderDate: false,
            menushipDate: false,
            modal: false,
            nowDate: new Date().toISOString().slice(0, 10),
            year: 0,

            orderType: '',
            orderNo: '',
            newOrderNo: '',
            orderDate: new Date().toISOString().substr(0, 10),

            searchName: '',
            searchCode: '',
            detail: [],
            customer: [],
            code: '',
            name: '',
            address: '',
            poRef: '',
            contact: '',
            tel: '',
            type: '',

            showOpenDetail: true,
            showDetails: false,
            orderDetails: [],
            listProduct: [],
            prod: {
                Code: '',
                Name: '',
                frame: '',
                front: '',
                Num: 1,
                Price: 0,
                percent: 0,
                shockprice: 0,
                gp: 0,
                dc: 0,
                amt: 0
            },
            showSearchProCode: false,
            headerProCode: [
                { text: 'Product code', value: 'Code' },
                { text: 'Product name', sortable: false, },
                { text: 'Price', align: 'right', sortable: false, },
                { text: '', align: 'right', sortable: false, },
            ],
            itemDisc: ['Percent(%)', 'Shock Price(MMK)'],
            showPercent: false,
            showShockprice: false,

            shipAdd: '',
            district: '',
            shipDate: new Date().toISOString().substr(0, 10),
            payMent: '',
            remark: '',
            statusDown: '',

            showDownPayment: false,

            percentDiscount: 0,
            disc: 0,

            downAmt: 0,
            menuPayDateOrder: false,
            payDateOrder: new Date().toISOString().substr(0, 10),


            headers: [
                { text: 'Customer code', sortable: false, align: 'center', value: 'code'},
                { text: 'Customer name', sortable: false, align: 'center', value: 'name' },
                { text: 'Address', sortable: false, align: 'center', value: 'address' },
                { text: 'Contact name', sortable: false, align: 'center', value: 'contact' },
                { text: 'Telephone number', sortable: false, align: 'center', value: 'tel'},
                { text: '', sortable: false, align: 'center'},
            ],

            itemPayMent: [],
            itemFrame: [],
            itemFront: [],

            itemDownPayment: ['Down payment', 'No down payment'],
            itemOrderType: [
                { id: 'soF', name: 'F' },
                { id: 'soM', name: 'M' },
                { id: 'soW', name: 'W' },
                { id: 'soD', name: 'D' },
            ],
            order: [],
            dialogProd: false,
            lastPayMent: '',
            lastDown: 0,
            lastDate: '',
        }
    },
    methods: {

        // Show input GP and DC in new product page
        showCustType() {
            if (this.type == 'D') {
                this.showGPandDC = true
                // this.showGPandDC = false
            }
            else {
                this.showGPandDC = true
            }
        },

        // Search customer info in the database
        async searchCustName() {
            if (this.searchName == "") {
                alert("Please input customer name.")
                this.$refs.searchName.focus()
            }
            else {
                let app = this
                // let searchN = this.searchName + '\uf8ff'
                const db = getFirestore()
                // const docRef = await getDocs(collection(db, "customer"));
                const docRef = await getDocs(collection(db, "customer"));
                docRef.forEach(() => {
                    app.customer = []
                    docRef.forEach(function (doc) {
                        let curDoc = doc.data()
                        app.customer.push(curDoc)
                        // console.log(app.customer[0].name)
                    })
                    if (app.customer.length == 0) {
                        alert("This customer name is not in the system.")
                        this.searchName = ''
                        this.dialogCust = false
                        this.searchName = ''
                        this.code = ''
                        this.name = ''
                        this.address = ''
                        this.poRef = ''
                        this.contact = ''
                        this.tel = ''
                        this.$refs.searchName.focus()
                    }
                    else {
                        this.searchName = ''
                        this.dialogCust = true
                        this.code = ''
                        this.name = ''
                        this.address = ''
                        this.poRef = ''
                        this.contact = ''
                        this.tel = ''
                    }
                })
                // .catch(function (error) {
                //         console.log("Error getting documents: ", error)
                //     })
            }
        },

        // Search customer info in the database
        async searchCustCode() {
            if (this.searchCode == "") {
                alert("Please input customer code.")
                this.$refs.searchCode.focus()
            }
            else {
                let app = this
                const db = getFirestore()
                const docRef = await getDocs(collection(db, "customer"), where("code"),(this.searchCode.toUpperCase()),(this.searchCode.toUpperCase() + "\uf8ff"));
                docRef.forEach(() => {
                        app.customer = []
                        docRef.forEach(function (doc) {
                            let curDoc = doc.data()
                            app.customer.push(curDoc)

                        })
                        if (app.customer.length == 0) {
                            alert("This customer name is not in the system.")
                            this.searchCode = ''
                            this.dialogCust = false
                            this.searchCode = ''
                            this.code = ''
                            this.name = ''
                            this.address = ''
                            this.poRef = ''
                            this.contact = ''
                            this.tel = ''
                            this.$refs.focusSearchCode.focus()
                        }
                        else {
                            this.searchCode = ''
                            this.dialogCust = true
                            this.code = ''
                            this.name = ''
                            this.address = ''
                            this.poRef = ''
                            this.contact = ''
                            this.tel = ''
                        }
                    })
                    // .catch(function (error) {
                    //     console.log("Error getting documents: ", error)
                    // })
            }
        },

        // Show customer info from the search in the database
        searchItem(item) {
            this.code = item.code
            this.name = item.name
            this.address = item.address
            this.shipAdd = item.address
            this.district = item.district
            this.contact = item.contact
            this.tel = item.tel
            this.prod.gp = item.gp
            this.prod.dc = item.dc
            this.type = item.code.substr(0, 1)
            this.dialogCust = false
            this.searchName = ''
            this.$nextTick(() => { this.$refs.focusAddress.focus() })
        },

        // Add products to the new line
        openDetail() {
            if (this.orderType == '') {
                alert("Please input Order no.")
            }
            else if (this.code == '') {
                alert("Please input Customer code.")
                this.$nextTick(() => { this.$refs.custCode.focus() })
            }
            else if (this.name == '') {
                alert("Please input Customer name.")
            }
            else if (this.contact == '') {
                alert("Please input Contact name.")
            }
            else {
                this.addDetail()
                // this.showCustType()
                // this.dialogProd = true
                // // this.prod.Num = 1
                // this.$nextTick(()=>{this.$refs.focusProdCode.focus()})
            }
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
            this.prod.gp = 0
            this.prod.dc = 0
            this.prod.amt = 0
            this.prod.disc = []
            this.showShockprice = false
            this.showPercent = false
            this.dialogProd = false
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
                    { Code: this.prod.Code, NameMM: this.prod.Name, frame: this.prod.frame, front: this.prod.front, num: this.prod.Num, numSend: 0, PriceMM: this.prod.amt / this.prod.Num, amt: this.prod.amt }
                )
                this.cancelAddProd()
                this.showOpenDetail = false
                this.$nextTick(() => {
                    let i = this.orderDetails.length - 1
                    let input = this.$refs.focusCode[i]
                    input.focus()
                })
            }
        },

        // Add detail in new line
        async addDetail() {
            this.showCustType()
            this.dialogProd = true
            // this.prod.Num =  1,
            this.prod.Price = 0
            this.prod.percent = 0
            this.prod.shockprice = 0
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "customer"), where("code", "==", this.code));
                docRef.forEach(() => {
                    docRef.forEach(doc => {
                        this.prod.gp = doc.data().gp
                        this.prod.dc = doc.data().dc
                    })
                })
            this.$nextTick(() => { this.$refs.focusProdCode.focus() })
        },

        // Show product info from the search in the database
        async searchProdCode() {
            let app = this
            this.listProduct = []
            if (this.prod.Code == '') {
                alert("Please input product code.")
                this.$refs.focusProdCode.focus()
            }
            else {
                const db = getFirestore()
                const docRef = collection(db, "code")
                const q = await doc(docRef, "productcode", where("Code", "==", "this.prod.Code"));
                const querySnapshot = await getDocs(q)
                 querySnapshot.forEach((doc) => {
                    app.listProduct.push(doc.data())
                    console.log(app.listProduct)
                        if (app.listProduct.length == 0) {
                            app.showSearchProCode = false
                            alert("This product code is not in the system......")
                            app.item = []
                        }
                        else {
                            app.showSearchProCode = true
                        }
                    })
            }
        },

        // Show product from search
        selectProCode(item) {
            this.prod.Code = item.Code
            this.prod.Name = item.NameMM
            this.prod.Price = item.PriceMM
            this.showSearchProCode = false
            this.$refs.focusFrame.focus()
        },

        // Delete the selected product
        delDetail(item) {
            if (this.orderDetails.length > 1) {
                this.orderDetails.splice(this.orderDetails.findIndex(detail => detail == item), 1)
            }
            else {
                this.orderDetails.splice(this.orderDetails.findIndex(detail => detail == item), 1)
                this.showDetails = false
                this.showOpenDetail = true
                this.showSearchProCode = false
            }
        },

        // Add order info
        async addOrder() {
            let haveError = false
            let errMsg = ''
            let i = this.orderDetails.length - 1

            // Change the string to numbers
            this.orderDetails.forEach(item => {
                item.num = item.num * 1
            })

            // Add Order and detail to database
            if (this.orderType == '') {
                haveError = true
                // alert("Please input Order no.")
                errMsg = "Please input Order no."
            }
            if (this.code == '') {
                haveError = true
                // alert("Please input Customer code.")
                errMsg = errMsg + "\nPlease input Customer code."
                // this.$nextTick(()=>{this.$refs.custCode.focus()})
            }
            if (this.name == '') {
                haveError = true
                // alert("Please input Customer name.")
                errMsg = errMsg + "\nPlease input Customer name."
            }
            if (this.contact == '') {
                haveError = true
                // alert("Please input Contact name.")
                errMsg = errMsg + "\nPlease input Contact name."
            }
            if (this.orderDetails.length > 0) {
                if (this.orderDetails[i].Code == '') {
                    haveError = true
                    // alert("Please input product code or delete line no." + (i+1))
                    errMsg += "\nPlease input product code or delete line no." + (i + 1)
                    // this.$nextTick(()=>{
                    //     let input = this.$refs.focusCode[i]
                    //     input.focus()
                    // })
                }
            }

            if (this.district == '' || this.district == null) {
                haveError = true
                // alert("Please input district.")
                errMsg += "Please input district."
                // this.$nextTick(()=>{this.$refs.focusDistict.focus()})
            }
            if (this.statusDown == '') {
                haveError = true
                // alert("Please select status down payment.")
                errMsg += "Please select status down payment."
            }
            if (this.statusDown == 'Down payment') {
                if (this.payMent == '') {
                    haveError = true
                    // alert("Please select payment.")
                    errMsg += "Please select payment."
                }
                else if (this.downAmt == 0) {
                    haveError = true
                    // alert("Please input down payment.")
                    errMsg += "Please input down payment."
                }
            }
            if (haveError) {
                alert(errMsg)
            }
            else {
                let app = this
                let year = new Date().toISOString().substr(0, 4)
                const db = getFirestore()
                let DocRef = db.collection("counter")(year)
                const docRef = await getDocs(collection(db, "order"), where("orderNo", "==", this.orderType.substr(2) + this.orderNo));
                docRef.forEach(() => {
                        app.checkOrder = []
                        docRef.forEach(doc => {
                            let curDoc = doc.data().orederNo
                            app.checkOrder.push(curDoc)
                        })
                        if (app.checkOrder.length >= 1) {
                            alert("This order no is already in the system.\nPlease try again.")
                            app.changeOrderNo()
                        }
                        else {
                            db.runTransaction((transaction) => {
                                return transaction.get(DocRef).then((Doc) => {
                                    if (!Doc.exists) {
                                        throw "Document does not exist!"
                                    }
                                    else {
                                        let newOrderNo = Doc.data()[app.orderType] + 1
                                        transaction.update(DocRef, {
                                            [app.orderType]: newOrderNo
                                        })
                                    }
                                })
                            })
                                .then(() => {
                                    let countPayment = []

                                    // add data to order and cashbook
                                    const db = getFirestore()
                                    let batch = db.batch()
                                    if (app.statusDown == 'Down payment') {
                                        countPayment.push({ payMent: app.payMent, down: app.downAmt, date: app.payDateOrder })
                                        batch.set(collection(db, 'cashReceiBook').doc(), {
                                            date: app.payDateOrder + " " + app.subTime,
                                            type: 'SO-',
                                            refNo: app.orderType.substr(2) + app.orderNo,
                                            custCode: app.code,
                                            desc: 'Down payment',
                                            Amt: app.downAmt + app.disc,
                                            disc: app.disc,
                                            payMent: app.payMent,
                                            rvNo: '',
                                        })
                                        batch.set(collection(db, 'order').doc(), {
                                            orderNo: app.orderType.substr(2) + app.orderNo,
                                            orderDate: app.orderDate + " " + app.subTime,
                                            code: app.code,
                                            name: app.name,
                                            address: app.address,
                                            poRef: app.poRef,
                                            contact: app.contact,
                                            tel: app.tel,
                                            detail: app.orderDetails,
                                            disc: app.disc,
                                            net: app.sumNet,
                                            shipAdd: app.shipAdd,
                                            district: app.district,
                                            shipDate: app.shipDate,
                                            remark: app.remark,
                                            downBalance: app.downAmt,
                                            countPayment: countPayment,
                                            balance: app.balance,
                                            status: 'Open',
                                            printed: 0
                                        })
                                    }
                                    else {
                                        batch.set(collection(db, 'order').doc(), {
                                            orderNo: app.orderType.substr(2) + app.orderNo,
                                            orderDate: app.orderDate + " " + app.subTime,
                                            code: app.code,
                                            name: app.name,
                                            address: app.address,
                                            poRef: app.poRef,
                                            contact: app.contact,
                                            tel: app.tel,
                                            detail: app.orderDetails,
                                            disc: app.disc,
                                            net: app.sumNet,
                                            shipAdd: app.shipAdd,
                                            district: app.district,
                                            shipDate: app.shipDate,
                                            remark: app.remark,
                                            downBalance: app.downAmt,
                                            countPayment: countPayment,
                                            balance: app.balance,
                                            status: 'Open',
                                            printed: 0
                                        })
                                    }

                                    batch.commit().then(() => {
                                        alert("Order successfully.....")
                                        app.showPrint = true
                                        // app.clearOrder()
                                    })
                                        // .catch((error) => {
                                        //     console.log(error)
                                        //     alert("Order failed.....")
                                        // })
                                })
                                // .catch((error) => {
                                //     console.log("Transaction failed: ", error)
                                // })
                        }
                    })
            }
        },

        async test() {
            let app = this
            const db = getFirestore()
            const docRef = await getDocs (collection(db, "order"), where("orderNo", "==", "F190035"));
                // db.collection("order").where("orderNo", "==", this.orderType.substr(2)+this.orderNo).get()
                 docRef.forEach(() => {
                    app.checkOrder = []
                    docRef.forEach(doc => {
                        let curDoc = doc.data().orederNo
                        app.checkOrder.push(curDoc)
                    })
                    if (app.checkOrder.length >= 1) {
                        alert("This order no is already in the system.\nPlease try again.")
                        app.changeOrderNo()
                    }
                    else {
                        alert("Success.")
                    }
                })
        },

        // Change orderNo value when select the ordertype 
        async changeOrderNo() {
            // let app = this
            let year = new Date().toISOString().substr(0, 4)
            let subYear = new Date().toISOString().substr(2, 2)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "counter"), year);
                docRef.forEach((doc) => {
                    let typeDoc = doc.data()[this.orderType] + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.orderNo = subYear + typeDoc
                    this.$refs.searchName.focus()
                })
        },

        // Claer web page
        clearOrder() {
            this.orderNo = ''
            this.orderType = []
            this.orderDate = new Date().toISOString().substr(0, 10)
            this.code = ''
            this.name = ''
            this.address = ''
            this.poRef = ''
            this.contact = ''
            this.tel = ''
            this.orderDetails = []
            this.shipAdd = ''
            this.district = ''
            this.shipDate = new Date().toISOString().substr(0, 10)
            this.payMent = []
            this.remark = ''
            this.statusDown = []
            this.payDateOrder = new Date().toISOString().substr(0, 10)
            this.percentDiscount = ''
            this.showDetails = false
            this.showOpenDetail = true
            this.showPrint = false
            this.$refs.searchName.focus()
        },

        // Change down status when select
        changeStatus() {
            // let app = this
            if (this.statusDown == 'Down payment') {
                this.showDownPayment = true
                this.downAmt = 0
                this.payMent = ''
            }
            else {
                this.showDownPayment = false
                this.downAmt = 0
                this.payMent = ''
            }
        },

        // Uppercase
        uppercase() {
            this.prod.Code = this.prod.Code.toUpperCase()
        },

        // Print order
        printOrder() {
            if (this.orderType.substr(2) + this.orderNo == '') {
                alert("Please add new order.")
            }
            else {
                let routeData = this.$router.resolve({ name: 'orderReport', query: { orderNo: this.orderType.substr(2) + this.orderNo } })
                window.open(routeData.href, '_blank')
            }
        },
    },
    computed: {

        // Calculate total
        sumTotal() {
            return this.orderDetails.reduce((total, item) => total + (item.amt), 0)
        },

        // Calculate sumNet
        sumNet() {
            return this.sumTotal - this.disc
        },

        // Calculate balance
        balance() {
            return this.sumNet - this.downAmt
        },
    },
   async mounted() {
        this.$refs.searchName.focus()
        let app = this
        const db = getFirestore()
        const docRef = await getDocs(collection(db, "chartAccount"), where("cash", "==", "Y"));
            docRef.forEach(doc => {
                app.itemPayMent = []
                    let readDoc = doc.data().accName
                    app.itemPayMent.push(readDoc)
                // payment.forEach(doc => {
                //     let readDoc = doc.data().accName
                //     app.itemPayMent.push(readDoc)
                // })
            })
       getDocs(collection(db, "code"),("color"));
       docRef.forEach((color) => {
        //    app.itemFrame.push(color.data().frame.sort())
        //    app.itemFront.push(color.data().front.sort())
                app.itemFrame.push(color.data().frame)
                app.itemFront.push(color.data().front)
            })
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

.padDing {
    padding: 0.5%;
}

.thAmount {
    width: 130px;
}

.thAmount2 {
    width: 200px;
}

.tdAmount {
    text-align: right;
    width: 100%;
}

.tdPrice {
    text-align: right;
    width: 100%;
}

.total {
    text-decoration: underline;
}

.sum {
    text-align: right;
    width: 100%;
}

.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.txtCenter {
    text-align: center;
}

.txtPercent {
    text-align: center;
    color: red;
    width: 20%;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

.mycurrency {
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    background-color: red;
}

.compact-form {
    transform: scale(0.8);
    transform-origin: left;
}

.inputCust {
    height: 30px;
    padding: 13px 10px;
    display: inline-block;
    border-bottom: 1px solid black;
}

.collapse:nth-child(even) {
    background-color: #dddddd;
}
</style>