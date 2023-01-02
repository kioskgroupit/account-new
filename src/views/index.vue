<template>
    <v-app>
        <mainMenu></mainMenu>
        <v-container>
            <!-- <v-btn @click="test"></v-btn> -->
        </v-container>
    </v-app>
</template>
<script>
// import { db, fieldValue } from '@/firebase'
import mainMenu from '@/components/mainMenu.vue'
export default {
    components: {
        mainMenu
    },
    data() {
        return {

        }
    }
}
</script>
