<!-- <template>
    <div class="about">
        <h1>This is an orderPayment page</h1>
    </div>
</template> -->

<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <v-btn @click="addData()">Click</v-btn>
        </v-container>
    </v-app>
</template>
<script>
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
// import { getFirestore, collection, getDocs } from 'firebase/firestore'
// import { db, fieldValue } from '@/firebase'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        mainMenu
    },
    data() {
        return {

        }
    },
    mounted() {
        // this.$refs.searchName.focus()
        // let app = this
        // const db = getFirestore()
        // const querySnapshot = await getDocs(collection(db, "users"));
        // querySnapshot.forEach((doc) => {
        //     console.log(`${doc.id} => ${doc.data()}`);
        // });
        // const querySnapshot = await getDocs(collection(db, "order"));
        // querySnapshot.forEach((doc) => {
        //     console.log('${doc.id} => ${doc.data()}');
        // });
        // collection(db, "chartAccount").where("cash", "==", "Y").get()
        //     .then(payment => {
        //         app.itemPayMent = []
        //         payment.forEach(doc => {
        //             let readDoc = doc.data().accName
        //             app.itemPayMent.push(readDoc)
        //         })
        //     })
        // collection(db, "code").doc("color").get()
        //     .then(color => {
        //         app.itemFrame.push(color.data().frame.sort())
        //         app.itemFront.push(color.data().front.sort())
        //     })
    },
    methods: {
        //Adding Data
        // addData() {
        //         const db = getFirestore()           
        //         addDoc(collection(db, "users"), {
        //             first: "Alan",
        //             middle: "Mathison",
        //             last: "Turing",
        //             born: 1912
        //         });
        // }
       //Read Data
    //     async addData() {
    //         const db = getFirestore()
    //         const docRef = await getDocs(collection(db, "users"));
    //         docRef.forEach((doc) => {
    //             console.log(doc.data().first+doc.data().middle+doc.data().last);
    //             console.log(doc.data().born);
    //         });
    //    }
        async addData() {
            // let app = this
            let year = new Date().toISOString().substr(0, 4)
            let subYear = new Date().toISOString().substr(2, 2)
            const db = getFirestore()
            // const q = query(collection(db, "cities"), where("capital", "==", true));
            const docRef = await getDocs(collection(db, "counter"),("2023", "==", year));
            docRef.forEach((doc) => {
                    let typeDoc = doc.data()[this.orderType] + 1
                    if (typeDoc <= 9999) {
                        typeDoc = ("000" + typeDoc).slice(-4)
                    }
                    this.orderNo = subYear + typeDoc
                    // this.$refs.searchName.focus()
                    console.log(this.orderNo)
                });
        }
    }
}
</script>