<template>
    <v-app>
        <!-- <mainMenu></mainMenu> -->
        <v-container fluid>
            <v-layout class="justify-center">
                <v-btn @click="test()">Click</v-btn>
                <!-- <v-btn @click="changeOrderNo()">Click</v-btn> -->
            </v-layout>
        </v-container>
    </v-app>
</template>

<script>
import { collection, getDocs, where, getFirestore, query, onSnapshot } from "firebase/firestore";
// import VueNumeric from 'vue-numeric'
// import mainMenu from '@/components/mainMenu.vue'

export default {
    components: {
        // mainMenu
    },
    // data() {
    //     return {

    //     }
    // },
    methods: {
        async test() {
            let app = this
            const db = getFirestore()
            const q = query(collection(db, "order"), where("orderNo", "==", "F230005"));
            // const q = query(collection(db, "order"), where("orderNo", "==", this.orderType.substr(2) + this.orderNo));
            onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
                    app.checkOrder = []
                snapshot.forEach((doc) => {
                    let curDoc = doc.data().orederNo
                    console.log(doc.data())
                    console.log(curDoc)
                    app.checkOrder.push(curDoc)

                })
                if (app.checkOrder.length >= 1) {
                    alert("This order no is already in the system.\nPlease try again.")

                }
                else {
                    alert("Success.")
                }
            });
        },
        //Next test
        async changeOrderNo() {
            // let app = this
             let year = new Date().toISOString().substr(0, 4)
            let subYear = new Date().toISOString().substr(2, 2)
            // let year = new Date().toISOString().substring(0, 4)
            // let subYear = new Date().toISOString().substring(2, 2)
            const db = getFirestore()
            const docRef = await getDocs(collection(db, "counter"), year);
            docRef.forEach((doc) => {
                let typeDoc = doc.data()[this.orderType] + 1
                if (typeDoc <= 9999) {
                    typeDoc = ("000" + typeDoc).slice(-4)
                }
                this.orderNo = subYear + typeDoc
                console.log(this.orderNo)
                
            })
        },
    }
}
</script>