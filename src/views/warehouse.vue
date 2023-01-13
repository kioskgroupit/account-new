<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-card>
                <v-card-text>
                    <h1 class="pt-2 pb-1">Warehouse</h1>
                    <hr>

                    <!-- Search warehouse -->
                    <v-layout justify-center>
                        <v-flex xs2>
                            <v-text-field v-model="searchWhCode" label="Search warehouse code:" ref="searchWhCode"
                                @keypress.enter="getWhCode"></v-text-field>
                        </v-flex>
                        <v-flex xs1>
                            <v-btn fab small color="indigo lighten-1" dark @click="getWhCode">
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>

                    <!-- Add new warehouse -->
                    <template v-if="isAdmin">
                        <hr>
                        <v-layout>
                            <v-flex>
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab small color="primary" @click="showAddnewWarehouse" v-on="on"><v-icon
                                                dark>add</v-icon></v-btn>
                                    </template>
                                    <span>Add new customer</span>
                                </v-tooltip>
                                <v-dialog v-model="dialogNew" persistent max-width="600">
                                    <v-card>
                                        <v-card-text>
                                            <span class="headline"><v-icon>home_work</v-icon>Warehouse</span>
                                            <v-container grid-list-md>
                                                <v-layout>
                                                    <v-flex xs4>
                                                        <v-text-field v-model="whCode" label="Warehouse code:"
                                                            ref="whCode"></v-text-field>
                                                    </v-flex>
                                                    <v-flex>
                                                        <v-text-field v-model="whName" label="Warehouse name:"
                                                            ref="whName"></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="red darken-1" flat @click="cancelNewWarehouse">Cancel</v-btn>
                                            <v-btn color="blue darken-1" flat @click="addNewWarehouse">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-flex>
                        </v-layout>
                    </template>
                    <hr>

                    <!-- Detail customer -->
                    <v-data-table :headers="headers" :items="whDetail" class="elevation-1"
                        v-bind:pagination.sync="pagination">
                        <template v-slot:no-data>
                            <v-progress-linear v-slot:progress color="primary" indeterminate></v-progress-linear>
                        </template>
                        <template v-slot:items="props">
                            <td>{{ props.item.code }}</td>
                            <td>{{ props.item.name }}</td>
                            <td class="justify-center layout px-0" v-if="isAdmin == true">
                                <v-tooltip right>
                                    <template v-slot:activator="{ on }">
                                        <v-icon small class="mr-1" @click="editWarehouse(props.item)"
                                            v-on="on">edit</v-icon>
                                    </template>
                                    <span>Edit warehouse</span>
                                </v-tooltip>
                            </td>
                        </template>
                    </v-data-table>

                    <!--  -->
                    <v-dialog v-model="dialogEdit" persistent max-width="600">
                        <v-card>
                            <v-card-text>
                                <span class="headline"><v-icon>home_work</v-icon>Edit Warehouse</span>
                                <v-container grid-list-md>
                                    <v-layout>
                                        <v-flex xs4>
                                            <v-text-field v-model="code" label="Warehouse code:"
                                                readonly></v-text-field>
                                        </v-flex>
                                        <v-flex>
                                            <v-text-field v-model="name" label="Warehouse name:"
                                                ref="name"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" flat @click="cancelEdit">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click="saveEdit">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-text>
            </v-card>
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
            isAdmin: false,
            searchWhCode: '',
            dialogNew: false,

            whCode: '',
            whName: '',

            whDetail: [],
            headers: [
                { text: 'Warehouse code', value: 'code' },
                { text: 'Warehouse name', sortable: false },
                { text: '', sortable: false }
            ],
            pagination: { 'sortBy': 'code', 'descending': false },

            docId: '',
            code: '',
            name: '',
            dialogEdit: false,
        }
    },
    methods: {

        // Get info warehouse from the search by warehouse code
        getWhCode() {
            db.collection("warehouse").orderBy("code").startAt(this.searchWhCode).endAt(this.searchWhCode + "\uf8ff")
                .onSnapshot(query => {
                    this.whDetail = []
                    let i = 0
                    query.forEach(doc => {
                        this.whDetail.push({ ...doc.data(), id: query.docs[i].id })
                        i++
                    })
                    if (this.whDetail.length == 0) {
                        alert("This warehouse code does not exist in the system.\nPlease try again.")
                        this.$nextTick(() => this.$refs.searchWhCode.focus())
                    }
                    else {
                        this.searchWhCode = ''
                        this.$nextTick(() => this.$refs.searchWhCode.focus())
                    }
                })
        },

        // Show dialog new warehouse
        showAddnewWarehouse() {
            this.dialogNew = true
            this.$nextTick(() => this.$refs.whCode.focus())
        },

        // Add new warehouse
        addNewWarehouse() {
            if (this.whCode == '') {
                alert("Please enter warehouse code.")
                this.$nextTick(() => this.$refs.whCode.focus())
            }
            else if (this.whName == '') {
                alert("Please enter warehouse name.")
                this.$nextTick(() => this.$refs.whName.focus())
            }
            else {
                db.collection("warehouse").where("code", "==", this.whCode).get()
                    .then(query => {
                        let data = []
                        query.forEach(doc => {
                            data.push(doc.data())
                        })
                        if (data.length > 0) {
                            alert("This warehouse code is already in the system.\nPlease try again.")
                            this.$nextTick(() => this.$refs.whCode.focus())
                        }
                        else {
                            db.collection("warehouse").add({
                                code: this.whCode.toUpperCase(),
                                name: this.whName
                            })
                                .then(() => {
                                    alert("Success.")
                                    this.cancelNewWarehouse()
                                })
                        }
                    })
            }
        },

        // Cancel new warehouse
        cancelNewWarehouse() {
            this.dialogNew = false
            this.whCode = ''
            this.whName = ''
        },

        // Show items for editing
        editWarehouse(item) {
            this.docId = item.id
            this.code = item.code
            this.name = item.name
            this.dialogEdit = true
            this.$nextTick(() => this.$refs.name.focus())
        },

        // Edit warehouse
        saveEdit() {
            if (this.name == '') {
                alert("Please enter warehouse name.")
                this.$nextTick(() => this.$refs.name.focus())
            }
            else {
                db.collection("warehouse").doc(this.docId).update({
                    name: this.name
                })
                    .then(() => {
                        alert("Success.")
                        this.cancelEdit()
                    })
            }
        },

        // Cancel edit warehouse and close dialog edit
        cancelEdit() {
            this.dialogEdit = false
            this.docId = ''
            this.code = ''
            this.name = ''
            this.$nextTick(() => this.$refs.searchWhCode.focus())
        }
    },
    mounted() {
        if (sessionStorage.isAdmin == 'true') {
            this.isAdmin = true
        }
        else {
            this.isAdmin = false
        }
        this.$nextTick(() => this.$refs.searchWhCode.focus())
    }
}
</script>
