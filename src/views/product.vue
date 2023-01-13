<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
               <h1 class="pt-2 pb-1">Product</h1>
    
                    <hr>

                    <!-- Search detail product from product code or product name -->
                    <v-layout justify-center>
                        <v-flex xs2 text-xs-center my-4>
                            <h3>Search product code:</h3>
                        </v-flex>
                        <v-flex xs2 pa-1>
                            <v-text-field v-model="searchCode" ref="focusSearchCode"
                                @keyup="searchProCode()"></v-text-field>
                        </v-flex>
                        <v-flex xs2 text-xs-center my-4>
                            <h3>Search product name:</h3>
                        </v-flex>
                        <v-flex xs5 pa-1>
                            <v-text-field v-model="searchName" ref="focusSearchName"
                                @keyup="searchCustName()"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <hr>

                    <!-- Add new customer -->
                    <v-layout>
                        <v-flex xs1 my-2 v-if="isAdmin">
                            <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                    <v-btn fab small color="primary" @click="openNewProd" v-on="on"><v-icon
                                            dark>add</v-icon></v-btn>
                                </template>
                                <span>Add new product</span>
                            </v-tooltip>
                            <v-dialog v-model="showAddProd" persistent max-width="800px">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline"><v-icon>assignment</v-icon>Product</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs4>
                                                    <v-text-field v-model="Code" label="Product code:" ref="focusCode"
                                                        prepend-icon="dehaze"></v-text-field>
                                                </v-flex>
                                                <v-flex xs8>
                                                    <v-text-field v-model="NameMM" label="Product name:"
                                                        ref="focusNameMM" prepend-icon="edit"></v-text-field>
                                                </v-flex>
                                                <v-flex v-if="showBtnAddSubCode">
                                                    <v-btn fab small color="primary" @click="addSubCode"><v-icon
                                                            dark>add</v-icon></v-btn>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="newSubCode">
                                                <v-divider></v-divider>
                                                <v-layout v-for="(item, i) in detail" :key="i">
                                                    <v-flex ml-5>
                                                        <v-layout>
                                                            <v-flex xs1>
                                                                <v-text-field :value="i + 1"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs5>
                                                                <v-autocomplete label="Sub product code:"
                                                                    :items="itemCode" v-model="item.subCode"
                                                                    ref="subCode"></v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs3>
                                                                <v-btn fab small color="primary"
                                                                    @click="addSubCode"><v-icon
                                                                        dark>add</v-icon></v-btn>
                                                                <v-btn fab small color="error"
                                                                    @click="delAddSubCode(item)" tabindex="-1">
                                                                    <v-icon dark>remove</v-icon>
                                                                </v-btn>
                                                            </v-flex>
                                                        </v-layout>
                                                    </v-flex>
                                                </v-layout>
                                                <v-divider></v-divider>
                                                <br>
                                            </template>
                                            <v-layout>
                                                <v-flex xs8 text-xs-right>
                                                    <v-icon>local_atm</v-icon>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <font size=3>
                                                        <vue-numeric separator="," :precision="2" v-model="PriceMM"
                                                            class="numeric" label="Price:" prepend-icon="local_atm"
                                                            ref="focusPriceMM"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" flat @click="cancelAdd()">Cancel</v-btn>
                                        <v-btn color="blue darken-1" flat @click="addProd()">Save</v-btn>
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

                    <!-- Show product detail -->
                    <v-data-table :headers="headProd" :items="detailProd" class="elevation-1"
                        v-bind:pagination.sync="pagination">
                        <template v-slot:items="props">
                            <td>{{ props.item.Code }}</td>
                            <td>{{ props.item.NameMM }}</td>
                            <td class="text-xs-right">
                                {{ props.item.PriceMM.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                            <td class="justify-center layout px-0" v-if="isAdmin == true">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-icon small class="mr-1" @click="editProd(props.item)" v-on="on">edit</v-icon>
                                    </template>
                                    <span>Edit product</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>

                    <!-- Edit product -->
                    <v-layout>
                        <v-flex xs1 my-2>
                            <v-dialog v-model="showEditProd" persistent max-width="800px">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline"><v-icon>assignment</v-icon>Edit Product</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout>
                                                <v-flex xs4>
                                                    <v-text-field v-model="Code" label="Product code:" ref="focusCode"
                                                        prepend-icon="dehaze" readonly></v-text-field>
                                                </v-flex>
                                                <v-flex xs8>
                                                    <v-text-field v-model="NameMM" label="Product name:"
                                                        ref="focusNameMM" prepend-icon="edit" readonly></v-text-field>
                                                </v-flex>
                                                <v-flex v-if="showBtnEditSubCode">
                                                    <v-btn fab small color="primary" @click="editSubCode"><v-icon
                                                            dark>add</v-icon></v-btn>
                                                </v-flex>
                                            </v-layout>
                                            <template v-if="showEditSubCode">
                                                <v-divider></v-divider>
                                                <v-layout v-for="(item, i) in editDetail" :key="i">
                                                    <v-flex ml-5>
                                                        <v-layout>
                                                            <v-flex xs1>
                                                                <v-text-field :value="i + 1"></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs5>
                                                                <v-autocomplete label="Sub product code:"
                                                                    :items="itemCode" v-model="item.subCode"
                                                                    ref="edSubCode"></v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs3>
                                                                <v-btn fab small color="primary"
                                                                    @click="editSubCode"><v-icon
                                                                        dark>add</v-icon></v-btn>
                                                                <v-btn fab small color="error"
                                                                    @click="delEditSubCode(item)" tabindex="-1">
                                                                    <v-icon dark>remove</v-icon>
                                                                </v-btn>
                                                            </v-flex>
                                                        </v-layout>
                                                    </v-flex>
                                                </v-layout>
                                                <v-divider></v-divider>
                                                <br>
                                            </template>
                                            <v-layout>
                                                <v-flex xs8 text-xs-right>
                                                    <v-icon>local_atm</v-icon>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <font size=3>
                                                        <vue-numeric separator="," :precision="2" v-model="PriceMM"
                                                            class="numeric" label="Price:" prepend-icon="local_atm"
                                                            ref="focusPriceMM"></vue-numeric>
                                                    </font>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="red darken-1" flat @click="cancelEdit()">Cancel</v-btn>
                                        <v-btn color="blue darken-1" flat @click="updateProd()">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>
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
            isAdmin: false,
            searchCode: '',
            searchName: '',

            itemCode: [],
            Code: '',
            NameMM: '',
            PriceMM: 0,
            detailProd: [],
            detail: [],
            editDetail: [],
            newSubCode: false,
            showBtnAddSubCode: true,
            showEditSubCode: false,
            showBtnEditSubCode: true,

            headProd: [
                { text: 'Product code', value: 'Code' },
                { text: 'Product name', sortable: false, },
                { text: 'Price', sortable: false, align: 'right' },
                // { text: '', sortable: false, align: 'right'},
            ],
            pagination: { 'sortBy': 'Code', 'descending': false },
            showAddProd: false,
            showEditProd: false,
            prodCode: [],
            cloneProd: [],
        }
    },
    methods: {

        // Search product from product code in database
        searchProCode() {
            this.searchName = ''
            return this.detailProd = this.cloneProd.filter(rec => this.searchCode.toUpperCase() == rec.Code.slice(0, this.searchCode.length))
        },

        // Search prodcut from product name in database
        searchCustName() {
            this.searchCode = ''
            return this.detailProd = this.cloneProd.filter(rec => this.searchName == rec.NameMM.slice(0, this.searchName.length))
        },

        // Get product
        getProd() {
            db.collection("code").doc("productcode").collection("proCode").get()
                .then(query => {
                    this.detailProd = []
                    this.cloneProd = []
                    let result = []
                    this.itemCode = []
                    let i = 0
                    query.forEach(doc => {
                        result.push({
                            id: query.docs[i].id, Code: doc.data().Code, NameMM: doc.data().NameMM,
                            subProd: doc.data().subProd, PriceMM: doc.data().PriceMM
                        })
                        // result.push(doc.data())
                        i++
                    })
                    sessionStorage.prod = JSON.stringify(result)
                    this.detailProd = JSON.parse(sessionStorage.prod)
                    this.cloneProd = this.detailProd
                    this.cloneProd.forEach(rec => {
                        this.itemCode.push(rec.Code)
                    })
                    this.itemCode.sort()
                })
        },

        // Open dialog new products
        openNewProd() {
            this.showAddProd = true
            this.$nextTick(() => { this.$refs.focusCode.focus() })
        },

        // Add sub product
        addSubCode() {
            this.showBtnAddSubCode = false
            this.newSubCode = true
            this.detail.push({ subCode: '' })
            let i = this.detail.length - 1
            this.$nextTick(() => { this.$refs.subCode[i].focus() })
        },

        // delete sub product
        delAddSubCode(item) {
            if (this.detail.length > 1) {
                this.detail.splice(this.detail.findIndex(detail => detail == item), 1)
            }
            else {
                this.detail.splice(this.detail.findIndex(detail => detail == item), 1)
                this.showBtnAddSubCode = true
                this.newSubCode = false
            }
        },

        // Edit sub product
        editSubCode() {
            this.showBtnEditSubCode = false
            this.showEditSubCode = true
            this.editDetail.push({ subCode: '' })
            let i = this.editDetail.length - 1
            this.$nextTick(() => { this.$refs.edSubCode[i].focus() })
        },

        // delete sub product
        delEditSubCode(item) {
            if (this.editDetail.length > 1) {
                this.editDetail.splice(this.editDetail.findIndex(editDetail => editDetail == item), 1)
            }
            else {
                this.editDetail.splice(this.editDetail.findIndex(editDetail => editDetail == item), 1)
                this.showBtnEditSubCode = true
                this.showEditSubCode = false
            }
        },

        // Add new product
        addProd() {
            this.Code = this.Code.toUpperCase()
            let app = this
            db.collection("code").doc("productcode").collection("proCode").where("Code", "==", this.Code).get()
                .then(querySnapshot => {
                    app.prod = []
                    querySnapshot.forEach(doc => {
                        app.prod.push(doc.data())
                    })
                    if (app.prod.length > 0) {
                        alert("This product code " + app.Code.toUpperCase() + " is available in the system.")
                        app.$nextTick(() => { app.$refs.focusCode.focus() })
                    }
                    else {
                        if (app.Code == '') {
                            alert("Please input product code.")
                            app.$nextTick(() => { app.$refs.focusCode.focus() })
                        }
                        else if (app.NameMM == '') {
                            alert("Please input product name.")
                            app.$nextTick(() => { app.$refs.focusNameMM.focus() })
                        }
                        else {
                            db.collection("code").doc("productcode").collection("proCode").add({
                                Code: app.Code,
                                NameMM: app.NameMM,
                                subProd: app.detail,
                                PriceMM: app.PriceMM
                            })
                                .then(() => {
                                    db.collection("code").doc("productcode").collection("proCode").where("Code", "==", app.Code).get()
                                        .then(query => {
                                            let arr = []
                                            arr = JSON.parse(sessionStorage.prod)
                                            let i = 0
                                            query.forEach(doc => {
                                                arr.push({
                                                    id: query.docs[i].id, Code: doc.data().Code, NameMM: doc.data().NameMM,
                                                    subProd: doc.data().subProd, PriceMM: doc.data().PriceMM
                                                })
                                                i++
                                            })
                                            sessionStorage.prod = JSON.stringify(arr)
                                            app.detailProd = JSON.parse(sessionStorage.prod)
                                            app.cloneProd = app.detailProd
                                            app.cloneProd.forEach(rec => {
                                                app.itemCode.push(rec.Code)
                                            })
                                            app.itemCode.sort()
                                            alert("Add new product successfully.")
                                            app.cancelAdd()
                                        })
                                })
                        }
                    }
                })
        },

        // Close new product page
        cancelAdd() {
            this.Code = ''
            this.NameMM = ''
            this.PriceMM = 0
            this.detail = []
            this.showAddProd = false
            this.showBtnAddSubCode = true
            this.newSubCode = false
        },

        searchA() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "A" && rec.Code < "B")
        },
        searchB() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "B" && rec.Code < "C")
        },
        searchC() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "C" && rec.Code < "D")
        },
        searchD() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "D" && rec.Code < "E")
        },
        searchE() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "E" && rec.Code < "F")
        },
        searchF() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "F" && rec.Code < "G")
        },
        searchG() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "G" && rec.Code < "H")
        },
        searchH() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "H" && rec.Code < "I")
        },
        searchI() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "I" && rec.Code < "J")
        },
        searchJ() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "J" && rec.Code < "K")
        },
        searchK() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "K" && rec.Code < "L")
        },
        searchL() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "L" && rec.Code < "M")
        },
        searchM() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "M" && rec.Code < "N")
        },
        searchN() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "N" && rec.Code < "O")
        },
        searchO() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "O" && rec.Code < "P")
        },
        searchP() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "P" && rec.Code < "Q")
        },
        searchQ() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "Q" && rec.Code < "R")
        },
        searchR() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "R" && rec.Code < "S")
        },
        searchS() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "S" && rec.Code < "T")
        },
        searchT() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "T" && rec.Code < "U")
        },
        searchU() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "U" && rec.Code < "V")
        },
        searchV() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "V" && rec.Code < "W")
        },
        searchW() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "W" && rec.Code < "X")
        },
        searchX() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "X" && rec.Code < "Y")
        },
        searchY() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code > "Y" && rec.Code < "Z")
        },
        searchZ() {
            this.detailProd = this.cloneProd.filter(rec => rec.Code >= "Z")
        },

        // Show product info the select in edit product page
        editProd(item) {
            this.showEditProd = true
            this.idProd = item.id
            this.Code = item.Code
            this.NameMM = item.NameMM
            if (item.subProd) {
                if (item.subProd.length > 0) {
                    this.showBtnEditSubCode = false
                    this.showEditSubCode = true
                    item.subProd.forEach(rec => {
                        this.editDetail.push({ subCode: rec.subCode })
                    })
                }
            }
            this.PriceMM = item.PriceMM
        },

        // Close edit product page
        cancelEdit() {
            this.Code = ''
            this.NameMM = ''
            this.editDetail = []
            this.PriceMM = 0
            this.showBtnEditSubCode = true
            this.showEditSubCode = false
            this.showEditProd = false
            this.$nextTick(() => { this.$refs.focusSearchCode.focus() })
        },

        // Update product in database
        updateProd() {
            let app = this
            db.collection("code").doc("productcode").collection("proCode").doc(app.idProd).update({
                subProd: app.editDetail,
                PriceMM: app.PriceMM
            })
                .then(() => {
                    db.collection("code").doc("productcode").collection("proCode").where("Code", "==", app.Code).get()
                        .then(query => {
                            let arr = []
                            arr = JSON.parse(sessionStorage.prod)
                            let i = 0
                            query.forEach(doc => {
                                arr.push({
                                    id: query.docs[i].id, Code: doc.data().Code, NameMM: doc.data().NameMM,
                                    subProd: doc.data().subProd, PriceMM: doc.data().PriceMM
                                })
                                i++
                            })
                            arr.sort((a, b) => a.Code.localeCompare(b.Code))
                            let newArr = []
                            let id = null
                            let Code = null
                            let NameMM = null
                            let subProd = []
                            let PriceMM = 0
                            let count = 0
                            for (let i = 0; i < arr.length; i++) {
                                if (arr[i].id != id) {
                                    if (count > 0) {
                                        newArr.push({ id: id, Code: Code, NameMM: NameMM, subProd: subProd, PriceMM: PriceMM })
                                    }
                                    id = arr[i].id
                                    Code = arr[i].Code
                                    NameMM = arr[i].NameMM
                                    subProd = arr[i].subProd
                                    PriceMM = arr[i].PriceMM
                                    count = 1
                                }
                                else {
                                    subProd = arr[i].subProd
                                    PriceMM = arr[i].PriceMM
                                    count++
                                }
                            }
                            if (count > 0) {
                                newArr.push({ id: id, Code: Code, NameMM: NameMM, subProd: subProd, PriceMM: PriceMM })
                            }
                            sessionStorage.prod = JSON.stringify(newArr)
                            app.detailProd = JSON.parse(sessionStorage.prod)
                            app.cloneProd = app.detailProd
                            this.searchCode = ''
                            this.searchName = ''
                            alert("Update product successfully.")
                            app.cancelEdit()
                        })
                })
        },

        getTest() {
            db.collection("code").doc("productcode").collection("proCode").where("Code", "==", "ST-3060C(S)").get()
                .then(query => {
                    let arr = []
                    arr = JSON.parse(sessionStorage.prod)
                    let i = 0
                    query.forEach(doc => {
                        arr.push({
                            id: query.docs[i].id, Code: doc.data().Code, NameMM: doc.data().NameMM,
                            subProd: doc.data().subProd, PriceMM: doc.data().PriceMM
                        })
                        i++
                    })
                    arr.sort((a, b) => a.Code.localeCompare(b.Code))
                    let newArr = []
                    let id = null
                    let Code = null
                    let NameMM = null
                    let subProd = []
                    let PriceMM = 0
                    let count = 0
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].id != id) {
                            if (count > 0) {
                                newArr.push({ id: id, Code: Code, NameMM: NameMM, subProd: subProd, PriceMM: PriceMM })
                            }
                            id = arr[i].id
                            Code = arr[i].Code
                            NameMM = arr[i].NameMM
                            subProd = arr[i].subProd
                            PriceMM = arr[i].PriceMM
                            count = 1
                        }
                        else {
                            count++
                        }
                    }
                    if (count > 0) {
                        newArr.push({ id: id, Code: Code, NameMM: NameMM, subProd: subProd, PriceMM: PriceMM })
                    }
                    sessionStorage.test = JSON.stringify(newArr)
                    // this.detailProd = JSON.parse(sessionStorage.test)
                    // this.cloneProd = this.detailProd
                    // this.cloneProd.forEach(rec=>{
                    //     this.itemCode.push(rec.Code)
                    // })
                    // this.itemCode.sort()
                })
        }
    },
    mounted() {
        if (!sessionStorage.prod) {
            this.getProd()
        }
        else {
            this.detailProd = JSON.parse(sessionStorage.prod)
            this.cloneProd = this.detailProd
            this.cloneProd.forEach(rec => {
                this.itemCode.push(rec.Code)
            })
            this.itemCode.sort()
        }

        if (sessionStorage.isAdmin == 'true') {
            this.isAdmin = true
        }
        else {
            this.isAdmin = false
        }
        this.$nextTick(() => { this.$refs.focusSearchCode.focus() })
    }
}
</script>
<style scoped>
.compact {
    transform: scale(0.78);
    transform-origin: left;
}

.numeric {
    text-align: right;
    width: 100%;
    border-bottom: 1px solid black;
    padding: 0.6%;
}
</style>
