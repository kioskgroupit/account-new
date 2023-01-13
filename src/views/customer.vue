<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Customer</h1>  
                    <hr>

                    <!-- Search detail customer from customer code or customer name -->
                    <v-layout justify-center>
                        <v-flex xs2 text-xs-center my-4>
                            <h3>Search customer code:</h3>
                        </v-flex>
                        <v-flex xs2 pa-1 px-2>
                            <v-text-field v-model="searchCode" ref="searchCode"
                                @keypress.enter="searchCustCode()"></v-text-field>
                        </v-flex>
                        <v-flex xs1 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="searchCustCode()">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs2 text-xs-center my-4>
                            <h3>Search customer name:</h3>
                        </v-flex>
                        <v-flex pa-1 px-2>
                            <v-text-field v-model="searchName" ref="searchName"
                                @keypress.enter="searchCustName()"></v-text-field>
                        </v-flex>
                        <v-flex xs1 my-2>
                            <v-btn fab small color="indigo lighten-1" dark @click="searchCustName()">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <hr>

                    <!-- Add new customer -->
                    <v-layout>
                        <v-flex xs1 my-2 v-if="isAdmin">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn fab small color="primary" @click="dialogNew = true" v-on="on"><v-icon
                                            dark>add</v-icon></v-btn>
                                </template>
                                <span>Add new customer</span>
                            </v-tooltip>
                            <v-dialog v-model="dialogNew" persistent max-width="600px">
                                <v-card>
                                    <v-card-text>
                                        <span class="headline"><v-icon>person_add</v-icon>Customer</span>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs2>
                                                    <v-select :items="itemCustType" v-model="custType" ref="orderType"
                                                        @change="changeCustCode" item-text="name" item-value="id"
                                                        prepend-icon="assignment_ind"></v-select>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-text-field v-model="custCode" label="Customer code:"
                                                        ref="focusCustCode"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex xs8>
                                                    <v-text-field v-model="custName" label="Customer name:"
                                                        ref="custName" prepend-icon="edit"></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field v-model="custDistrict" label="District:"
                                                        ref="focusCustDistrict"
                                                        prepend-icon="my_location"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-textarea v-model="custAddress" label="Address:" height="50"
                                                        ref="custAddress" prepend-icon="place"></v-textarea>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-text-field v-model="custConName" label="Contact name:"
                                                        ref="custConName" prepend-icon="contacts"></v-text-field>
                                                </v-flex>
                                                <v-flex>
                                                    <v-text-field v-model="custTel" label="Tel:" ref="custTel"
                                                        prepend-icon="call"></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout>
                                                <v-flex>
                                                    <v-layout>
                                                        <v-flex xs12 text-xs-right>
                                                            <font size=2>Credit limit(MMK):</font>
                                                        </v-flex>
                                                    </v-layout>
                                                    <v-flex>
                                                        <font size=3><vue-numeric separator="," :precision="2"
                                                                v-model="creditLimit" class="line"></vue-numeric></font>
                                                    </v-flex>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-flex pb-0>
                                                        <v-select :items="itemCreditTerm" v-model="creditTerm"
                                                            ref="focusTerm" label="Credit term(Days):"
                                                            prepend-icon="calendar_today"></v-select>
                                                    </v-flex>
                                                </v-flex>
                                            </v-layout>
                                            <div v-if="showPro1">
                                                <v-layout>
                                                    <v-flex>
                                                        <v-text-field type="number" v-model="gp"
                                                            prepend-icon="radio_button_unchecked" label="GP(%):"
                                                            reverse></v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field type="number" v-model="dc"
                                                            prepend-icon="radio_button_unchecked" label="DC(%):"
                                                            reverse></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </div>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" flat @click="clearNewCust()">Cancel</v-btn>
                                        <v-btn color="blue darken-1" flat @click="addCustomer()">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>
                    <hr>
                    <br>

                    <!-- Menu search A-Z -->
                    <v-layout>
                        <v-flex text-xs-center @click="searchA()" style="cursor: pointer" red>
                            <font size=3 color=white>A</font>
                            <!-- <font size=4>|</font> -->
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchB()" style="cursor: pointer" pink>
                            <font size=3 color=white>B</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchC()" style="cursor: pointer" purple>
                            <font size=3 color=white>C</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchD()" style="cursor: pointer" indigo>
                            <font size=3 color=white>D</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchE()" style="cursor: pointer" blue>
                            <font size=3 color=white>E</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchF()" style="cursor: pointer" light-blue>
                            <font size=3 color=white>F</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchG()" style="cursor: pointer" cyan>
                            <font size=3 color=white>G</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchH()" style="cursor: pointer" teal>
                            <font size=3 color=white>H</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchI()" style="cursor: pointer" green>
                            <font size=3 color=white>I</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchJ()" style="cursor: pointer" light-green>
                            <font size=3 color=white>J</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchK()" style="cursor: pointer" lime>
                            <font size=3 color=white>K</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchL()" style="cursor: pointer" yellow>
                            <font size=3 color=white>L</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchM()" style="cursor: pointer" amber>
                            <font size=3 color=white>M</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchN()" style="cursor: pointer" orange>
                            <font size=3 color=white>N</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchO()" style="cursor: pointer" deep-orange>
                            <font size=3 color=white>O</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchP()" style="cursor: pointer" brown>
                            <font size=3 color=white>P</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchQ()" style="cursor: pointer" blue-grey>
                            <font size=3 color=white>Q</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchR()" style="cursor: pointer" grey>
                            <font size=3 color=white>R</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchS()" style="cursor: pointer" deep-orange accent-4>
                            <font size=3 color=white>S</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchT()" style="cursor: pointer" orange accent-4>
                            <font size=3 color=white>T</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchU()" style="cursor: pointer" amber accent-4>
                            <font size=3 color=white>U</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchV()" style="cursor: pointer" yellow accent-4>
                            <font size=3 color=white>V</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchW()" style="cursor: pointer" lime accent-4>
                            <font size=3 color=white>W</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchX()" style="cursor: pointer" light-green accent-4>
                            <font size=3 color=white>X</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchY()" style="cursor: pointer" green accent-4>
                            <font size=3 color=white>Y</font>
                        </v-flex>
                        <v-flex text-xs-center>
                            <font size=4>|</font>
                        </v-flex>
                        <v-flex text-xs-center @click="searchZ()" style="cursor: pointer" teal accent-4>
                            <font size=3 color=white>Z</font>
                        </v-flex>
                    </v-layout>
                    <hr>

                    <!-- Detail customer -->
                    <v-data-table :headers="headers" :items="detail" class="elevation-1"
                        v-bind:pagination.sync="pagination">
                        <template v-slot:items="props">
                            <td class="text-xs-center">{{ props.item.code }}</td>
                            <td>{{ props.item.name }}</td>
                            <td>{{ props.item.address }}</td>
                            <td>{{ props.item.contact }}</td>
                            <td class="text-xs-left">{{ props.item.tel }}</td>
                            <td class="text-xs-left">{{ props.item.status }}</td>
                            <td class="justify-center layout px-0">
                                <!-- <td class="justify-center layout px-0" v-if="isAdmin==true"> -->
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-icon small class="mr-1" @click="editCust(props.item)" v-on="on">edit</v-icon>
                                    </template>
                                    <span>Edit customer</span>
                                </v-tooltip>
                                <!-- <v-icon small @click="deleteItem(props.item)">delete</v-icon> -->
                            </td>
                        </template>
                    </v-data-table>

                    <!-- Edit detail customer -->
                    <v-dialog v-model="dialogEdit" persistent max-width="600px">
                        <v-card>
                            <v-card-text>
                                <span class="headline"><v-icon>person</v-icon>Edit Customer</span>
                                <v-container grid-list-md>
                                    <v-layout>
                                        <v-flex xs3>
                                            <v-text-field v-model="code" label="Customer code:" readonly></v-text-field>
                                        </v-flex>
                                        <v-flex xs9>
                                            <v-text-field v-model="name" label="Customer name:"></v-text-field>
                                        </v-flex>
                                        <v-flex>
                                            <v-text-field v-model="district" label="District:"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs12>
                                            <v-textarea v-model="address" label="Address:"></v-textarea>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex xs6>
                                            <v-text-field v-model="contact" label="Contact name:"></v-text-field>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-text-field v-model="tel" label="Telephone number:"></v-text-field>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-select :items="itemStatus" v-model="status" label="Status:"></v-select>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout>
                                        <v-flex>
                                            <v-layout>
                                                <v-flex xs12 text-xs-right>
                                                    <font size=2>Credit limit(MMK):</font>
                                                </v-flex>
                                            </v-layout>
                                            <v-flex>
                                                <font size=3><vue-numeric separator="," :precision="2"
                                                        v-model="creditLimit" class="line"></vue-numeric></font>
                                            </v-flex>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-flex pb-0>
                                                <v-select :items="itemCreditTerm" v-model="creditTerm" ref="focusTerm"
                                                    label="Credit term(Days):" prepend-icon="calendar_today"></v-select>
                                            </v-flex>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout v-if="showGpAndDcPro1">
                                        <v-flex xs6>
                                            <v-text-field v-model="gp" label="GP(%):" reverse></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field v-model="dc" label="DC(%):" reverse></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" flat @click="cancelEdit()">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="saveEdit()">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
        mainMenu,
        VueNumeric
    },
    data() {
        return {
            isAdmin: false,
            dialogNew: false,
            itemCustType: [
                { id: 'd', name: 'D' },
                { id: 'f', name: 'F' },
                { id: 'm', name: 'M' },
                { id: 'w', name: 'W' },
            ],
            custType: '',
            showPro1: false,
            dialogEdit: false,

            searchCode: '',
            searchName: '',
            custCode: '',
            custName: '',
            custDistrict: '',
            custAddress: '',
            custConName: '',
            custTel: '',
            creditLimit: 0,
            creditTerm: 0,

            detail: [],
            headers: [
                { text: 'Customer code', align: 'center', value: 'code' },
                { text: 'Customer name', sortable: false },
                { text: 'Address', sortable: false },
                { text: 'Contact name', sortable: false },
                { text: 'Telephone number', sortable: false },
                { text: 'Status', sortable: false },
            ],
            pagination: { 'sortBy': 'code', 'descending': false },
            code: '',
            name: '',
            district: '',
            address: '',
            contact: '',
            tel: '',
            status: '',
            itemCreditTerm: [0, 30, 60, 90],
            gp: 0,
            dc: 0,
            itemStatus: ['Active', 'Inactive'],

            showGpAndDcPro1: false,
            codeDoc: []
        }
    },
    methods: {

        // Change custCode value when select the custtype 
        changeCustCode() {
            // let app = this
            // let year = new Date().toISOString().substr(0,4)
            // let subYear = year.substr(2,2)
            // db.collection("counter").doc("customer")
            // .onSnapshot((doc)=> {
            //     let typeDoc = doc.data()[this.custType]+1
            //     if (typeDoc<=999999){ 
            //         typeDoc = ("00000"+typeDoc).slice(-6)
            //     }
            //     if(this.custType.toUpperCase() == 'S'){
            //         this.showPro1 = false
            //     }
            //     else{
            //         this.showPro1 = true
            //     }
            //     this.custCode = this.custType.toUpperCase() + subYear + typeDoc
            //     this.$nextTick(()=>{this.$refs.custName.focus()})
            // })
            if (this.custType.toUpperCase() == 'D') {
                this.showPro1 = false
            }
            else {
                this.showPro1 = true
            }
            this.custCode = this.custType.toUpperCase() + "-"
            this.$nextTick(() => { this.$refs.focusCustCode.focus() })
        },

        // Add new customer in database
        addCustomer() {
            if (this.custCode == "") {
                alert("Please input customer code")
                this.$refs.focusCustCode.focus()
            }
            else if (this.custCode.length < 3) {
                alert("Please input customer code")
                this.$refs.focusCustCode.focus()
            }
            else if (this.custName == "") {
                alert("Please input customer name")
                this.$refs.custName.focus()
            }
            // else if(this.custAddress == ""){
            //     alert("Please input address")
            //     this.$refs.custAddress.focus()
            // }
            // else if(this.custConName == ""){
            //     alert("Please input contact name")
            //     this.$refs.custConName.focus()
            // }
            // else if(this.custTel == ""){
            //     alert("Please input telephone number")
            //     this.$refs.custTel.focus()
            // }
            else {
                db.collection("customer").where("code", "==", this.custCode.toUpperCase()).get()
                    .then(snap => {
                        this.codeDoc = []
                        snap.forEach(doc => {
                            this.codeDoc.push(doc.data().code)
                        })
                        if (this.codeDoc.length !== 0) {
                            alert("This customer code is already in the system.\nPlease enter a new customer code.")
                            this.$nextTick(() => { this.$refs.focusCustCode.focus() })
                        }
                        else {
                            db.collection('customer').add({
                                code: this.custCode.toUpperCase(),
                                name: this.custName.toLowerCase(),
                                district: this.custDistrict,
                                address: this.custAddress,
                                contact: this.custConName,
                                tel: this.custTel,
                                creditLimit: this.creditLimit,
                                creditTerm: this.creditTerm,
                                gp: this.gp * 1,
                                dc: this.dc * 1,
                                status: 'Active'
                            })
                                .then(() => {
                                    alert("Add new customer successfully.")
                                    this.custType = []
                                    this.custCode = ''
                                    this.custName = ''
                                    this.custDistrict = ''
                                    this.custAddress = ''
                                    this.custConName = ''
                                    this.custTel = ''
                                    this.creditLimit = 0
                                    this.creditTerm = 0
                                    this.gp = 0
                                    this.dc = 0
                                    this.showPro1 = false
                                })
                        }
                    })
            }
        },

        // Clear web page
        clearNewCust() {
            this.custType = []
            this.custCode = ''
            this.custName = ''
            this.custDistrict = ''
            this.custAddress = ''
            this.custConName = ''
            this.custTel = ''
            this.creditLimit = 0
            this.creditTerm = 0
            this.gp = 0
            this.dc = 0
            this.showPro1 = false
            this.dialogNew = false
        },

        // Search customer from code in database
        searchCustCode() {
            if (this.searchCode == "") {
                alert("Please input customer code.....")
                this.$refs.searchCode.focus()
            }
            else {
                let app = this
                db.collection("customer").where("code", ">=", this.searchCode.toUpperCase()).where("code", "<=", this.searchCode.toUpperCase() + "z").get()
                    .then(querySnapshot => {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                        if (app.detail.length == 0) {
                            alert("This customer code is not in the system......")
                            this.searchCode = ""
                            this.$refs.searchCode.focus()
                        }
                        else {
                            this.searchCode = ""
                            this.$refs.searchCode.focus()
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error)
                    })
            }
        },

        // Search customer from name in database
        searchCustName() {
            if (this.searchName == "") {
                alert("Please input customer name.....")
                this.$refs.searchName.focus()
            }
            else {
                let app = this
                // db.collection("customer").where("name", ">=", this.searchName.toUpperCase()).where("name", "<=", this.searchName.toLowerCase()+'z').get()
                db.collection("customer").orderBy("name").startAt(this.searchName).endAt(this.searchName + "\uf8ff").get()
                    .then(querySnapshot => {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            // console.log(curDoc)
                            app.detail.push(curDoc)
                        })
                        if (app.detail.length == 0) {
                            alert("This customer name is not in the system......")
                            this.searchName = ""
                            this.$refs.searchName.focus()
                        }
                        else {
                            this.searchName = ""
                            this.$refs.searchName.focus()
                        }
                    })
                    .catch(function (error) {
                        console.log("Error getting documents: ", error)
                    })
            }
        },

        searchA() {
            let app = this
            db.collection("customer").where("name", ">=", "a".toLowerCase()).where("name", "<", "b".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchB() {
            let app = this
            db.collection("customer").where("name", ">=", "b".toLowerCase()).where("name", "<", "c".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchC() {
            let app = this
            db.collection("customer").where("name", ">=", "c".toLowerCase()).where("name", "<", "d".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchD() {
            let app = this
            db.collection("customer").where("name", ">=", "d".toLowerCase()).where("name", "<", "e".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchE() {
            let app = this
            db.collection("customer").where("name", ">=", "e".toLowerCase()).where("name", "<", "f".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchF() {
            let app = this
            db.collection("customer").where("name", ">=", "f".toLowerCase()).where("name", "<", "g".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchG() {
            let app = this
            db.collection("customer").where("name", ">=", "g".toLowerCase()).where("name", "<", "h".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchH() {
            let app = this
            db.collection("customer").where("name", ">=", "h".toLowerCase()).where("name", "<", "i".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchI() {
            let app = this
            db.collection("customer").where("name", ">=", "i".toLowerCase()).where("name", "<", "j".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchJ() {
            let app = this
            db.collection("customer").where("name", ">=", "j".toLowerCase()).where("name", "<", "k".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchK() {
            let app = this
            db.collection("customer").where("name", ">=", "k".toLowerCase()).where("name", "<", "l".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchL() {
            let app = this
            db.collection("customer").where("name", ">=", "l".toLowerCase()).where("name", "<", "m".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchM() {
            let app = this
            db.collection("customer").where("name", ">=", "m".toLowerCase()).where("name", "<", "n".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchN() {
            let app = this
            db.collection("customer").where("name", ">=", "n".toLowerCase()).where("name", "<", "o".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchO() {
            let app = this
            db.collection("customer").where("name", ">=", "o".toLowerCase()).where("name", "<", "p".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchP() {
            let app = this
            db.collection("customer").where("name", ">=", "p".toLowerCase()).where("name", "<", "q".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchQ() {
            let app = this
            db.collection("customer").where("name", ">=", "q".toLowerCase()).where("name", "<", "r".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchR() {
            let app = this
            db.collection("customer").where("name", ">=", "r".toLowerCase()).where("name", "<", "s".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchS() {
            let app = this
            db.collection("customer").where("name", ">=", "s".toLowerCase()).where("name", "<", "t".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchT() {
            let app = this
            db.collection("customer").where("name", ">=", "t".toLowerCase()).where("name", "<", "u".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchU() {
            let app = this
            db.collection("customer").where("name", ">=", "u".toLowerCase()).where("name", "<", "v".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchV() {
            let app = this
            db.collection("customer").where("name", ">=", "v".toLowerCase()).where("name", "<", "w".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchW() {
            let app = this
            db.collection("customer").where("name", ">=", "w".toLowerCase()).where("name", "<", "x".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchX() {
            let app = this
            db.collection("customer").where("name", ">=", "x".toLowerCase()).where("name", "<", "y".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchY() {
            let app = this
            db.collection("customer").where("name", ">=", "y".toLowerCase()).where("name", "<", "z".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },
        searchZ() {
            let app = this
            db.collection("customer").where("name", ">=", "z".toLowerCase()).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        alert("There are no this characters in system.....")
                    }
                    else {
                        app.detail = []
                        querySnapshot.forEach(function (doc) {
                            let curDoc = doc.data()
                            // let docId = querySnapshot.docs[0].id
                            app.detail.push(curDoc)
                            // console.log(app.detail)
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },

        // Button edit customer
        editCust(item) {
            this.dialogEdit = true
            this.code = item.code
            this.name = item.name
            this.district = item.district
            this.address = item.address
            this.contact = item.contact
            this.tel = item.tel
            this.status = item.status
            this.creditLimit = item.creditLimit
            this.creditTerm = item.creditTerm
            this.gp = item.gp
            this.dc = item.dc
            if (this.code.substr(0, 1) == 'S') {
                this.showGpAndDcPro1 = false
            }
            else {
                this.showGpAndDcPro1 = true
            }
            db.collection("customer").where("code", "==", this.code).get()
                .then(querySnapshot => {
                    this.idProd = querySnapshot.docs[0].id
                    // console.log(this.idProd)
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error)
                })
        },

        // Edit customer in database
        saveEdit() {
            db.collection('customer').doc(this.idProd).update({
                code: this.code,
                name: this.name,
                address: this.address,
                district: this.district,
                contact: this.contact,
                tel: this.tel,
                status: this.status,
                gp: this.gp,
                dc: this.dc
            })
                .then(() => {
                    alert("Update successful.....")
                    this.dialogEdit = false
                    this.$refs.searchCode.focus()
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Update failed.....");
                });
        },

        // Clear new customer page and close
        cancelEdit() {
            this.code = ""
            this.name = ""
            this.district = ""
            this.address = ""
            this.contact = ""
            this.tel = ""
            this.creditLimit = 0
            this.creditTerm = 0
            this.gp = ""
            this.dc = ""
            this.dialogEdit = false
            this.$nextTick(() => { this.$refs.searchCode.focus() })
        }
    },
    mounted() {
        // this.isAdmin = this.$store.state.isAdmin
        if (sessionStorage.isAdmin == 'true') {
            this.isAdmin = true
        } else {
            this.isAdmin = false
        }
        this.$refs.searchCode.focus()
    }
}
</script>

<style scoped>
.line {
    border-bottom: 1px solid gray;
    text-align: right;
    width: 100%;
    /* padding: 1.8%; */
}

.compact {
    transform: scale(0.78);
    /* transform: scale(1); */
    transform-origin: left;
}
</style>
