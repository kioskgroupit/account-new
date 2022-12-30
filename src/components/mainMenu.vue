<template>
    <div>
        <v-toolbar class="indigo">
                <v-app-bar-nav-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up" color="white">
                </v-app-bar-nav-icon>
            <v-toolbar-title>
                <!-- <router-link to="/" tag="span" style="cursor: pointer"> -->
                <v-icon dark>mdi-bank</v-icon>
                <!-- <img src="@/assets/kiosk_logo.png"> -->
                <font color="white">Account <font size="2">V.1.3.8</font>
                </font>
                <!-- {{$store.state.isAdmin}}{{$store.state.user}} -->
                <!-- {{user}} -->
                <!-- </router-link> -->
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only hidden-sm-only">
                <v-menu open-on-hover offset-y bottom v-for="item in menuItem" :key="item.title">
                    <template v-slot:activator="{ on }">
                        <v-btn flat v-on="on" class="indigo white--text">
                            <v-icon>{{ item.icon }}</v-icon>
                            {{ item.title }}
                        </v-btn>
                    </template>
                    <v-list>
                        <!-- <v-list-tile v-for="subItem in item.items" :key="subItem.title" router :to="subItem.link" @click="logout">
              <v-list-tile-title>{{subItem.title}}</v-list-tile-title>
            </v-list-tile> -->
                        <template v-for="subItem in item.items">
                            <v-list-tile v-if="subItem.title == 'Logout'" :to="subItem.link" :key="subItem.title"
                                @click="logout">
                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile v-else :to="subItem.link" :key="subItem.title">
                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                            </v-list-tile>
                        </template>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>

        <v-navigation-drawer temporary v-model="sideNav" absolute>
            <v-list>
                <v-list-group v-for="item in navItem" :key="item.title" v-model="item.active"
                    :prepend-icon="item.action" no-action>
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile v-for="subItem in item.items" :key="subItem.title" :to="subItem.link">
                        <v-list-tile-content>
                            <v-list-tile-title v-if="subItem.title == 'Logout'" @click="logout">{{ subItem.title }}</v-list-tile-title>
                            <v-list-tile-title v-else>{{ subItem.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { auth } from '@/firebase'
export default {
    data() {
        return {
            sideNav: false,
            isAdmin: false,
            menuItem: [],
            navItem: [],
        }
    },
    methods: {
        menuRole() {
            this.menuItem = []
            this.navItem = []
            if (this.isAdmin == true) {
                this.menuItem = [
                    {
                        title: 'order', icon: 'mdi-clipboard-text',
                        items: [
                            { title: 'New Order', link: '/orders' },
                            { title: 'Order Payment', link: '/orderpayment' },
                            { title: 'Order Status', link: '/orderStatus' },
                            { title: 'Order Summary By Code', link: '/ordersum' },
                        ]
                    },
                    {
                        title: 'Invoice', icon: 'mdi-send',
                        items: [
                            { title: 'New Invoice', link: '/invoice' },
                            { title: 'Credit Note', link: '/creditnote' },
                            { title: 'Invoice Payment', link: '/invoicepayment' },
                            { title: 'Invoice Pay All', link: '/invpayall' },
                            { title: 'Invoice Status', link: '/invStatus' },
                        ]
                    },
                    {
                        title: 'Stock', icon: 'mdi-storefront',
                        items: [
                            { title: 'Purchase', link: '/purchase' },
                            { title: 'Return Products', link: '/returnproductcustom' },
                            { title: 'Stock status', link: '/stock' },
                            { title: 'Stock balance', link: '/stockbalance' },
                        ]
                    },
                    {
                        title: 'Cash Book', icon: 'mdi-receipt',
                        items: [
                            { title: 'Cash Received Book', 'link': '/cashrecei' },
                            { title: 'Cash Payment Book', 'link': '/cashpay' }
                        ]
                    },
                    {
                        title: 'Report', icon: 'mdi-ballot',
                        items: [
                            { title: 'Customer Group Report', 'link': '/customergroupreport' },
                            { title: 'Customer List Report', 'link': '/customerlistreport' },
                            { title: 'Product Sales Report', 'link': '/productreport' }
                        ]
                    },
                    {
                        title: 'General ledger', icon: 'mdi-wallet',
                        items: [
                            { title: 'New General ledger', link: '/gl' },
                            { title: 'Report General ledger', link: '/reportGl' },
                            // {title: 'Status General ledger', link: '/glstatus'},
                            { title: 'Edit General ledger', link: '/gledit' },
                            { title: 'A/R Balance', link: '/arbalance' },
                            { title: 'D/R Balance', link: '/drbalance' },
                            { title: 'Trial Balance(Monthly)', link: '/tbMonthly' },
                            { title: 'Trial Balance(Annually)', link: '/tbAnnually' }
                        ]
                    },
                    {
                        title: 'Code', icon: 'mdi-reorder-horizontal',
                        items: [
                            { title: 'Customer', link: '/customer' },
                            { title: 'Product', link: '/product' },
                            { title: 'Chart Of Account', link: '/chartofaccount' },
                            { title: 'Price List', link: '/pricelist' },
                            { title: 'Warehouse', link: '/warehouse' },
                            { title: 'User', link: '/users' },
                        ]
                    },
                    {
                        title: this.user, icon: 'mdi-account-circle',
                        items: [
                            // {title: 'Upload', link: '/uploadData'},
                            { title: 'Logout' },
                        ]
                    },
                ],
                    this.navItem = [
                        {
                            title: 'order', icon: 'mdi-clipboard-text',
                            items: [
                                { title: 'New Order', link: '/orders' },
                                { title: 'Order Payment', link: '/orderpayment' },
                                { title: 'Order Status', link: '/orderStatus' },
                                { title: 'Order Summary By Code', link: '/ordersum' },
                            ]
                        },
                        {
                            title: 'Invoice', icon: 'mdi-send',
                            items: [
                                { title: 'New Invoice', link: '/invoice' },
                                { title: 'Credit Note', link: '/creditnote' },
                                { title: 'Invoice Payment', link: '/invoicepayment' },
                                { title: 'Invoice Pay All', link: '/invpayall' },
                                { title: 'Invoice Status', link: '/invStatus' },
                            ]
                        },
                        {
                            title: 'Stock', icon: 'mdi-storefront',
                            items: [
                                { title: 'Purchase', link: '/purchase' },
                                { title: 'Stock status', link: '/stock' },
                                // {title: 'Stock O/R', link: '/stockOR'},
                                { title: 'Stock balance', link: '/stockbalance' },
                            ]
                        },
                        {
                            title: 'Cash Book', icon: 'mdi-receipt-text',
                            items: [
                                { title: 'Cash Received Book', 'link': '/cashrecei' },
                                { title: 'Cash Payment Book', 'link': '/cashpay' }
                            ]
                        },
                        {
                            title: 'Report', icon: 'mdi-ballot',
                            items: [
                                { title: 'Customer Group Report', 'link': '/customergroupreport' },
                                { title: 'Customer List Report', 'link': '/customerlistreport' },
                                { title: 'Product Sales Report', 'link': '/productreport' }
                            ]
                        },
                        {
                            title: 'General ledger', icon: 'mdi-wallet',
                            items: [
                                { title: 'New General ledger', link: '/gl' },
                                { title: 'Report General ledger', link: '/reportGl' },
                                // {title: 'Status General ledger', link: '/glstatus'},
                                { title: 'Edit General ledger', link: '/gledit' },
                                { title: 'A/R Balance', link: '/arbalance' },
                                { title: 'D/R Balance', link: '/drbalance' },
                                { title: 'Trial Balance(Monthly)', link: '/tbMonthly' },
                                { title: 'Trial Balance(Annually)', link: '/tbAnnually' }
                            ]
                        },
                        {
                            title: 'Code', icon: 'mdi-reorder-horizontal',
                            items: [
                                { title: 'Customer', link: '/customer' },
                                { title: 'Product', link: '/product' },
                                { title: 'Chart Of Account', link: '/chartofaccount' },
                                { title: 'Price List', link: '/pricelist' },
                                { title: 'Warehouse', link: '/warehouse' },
                                { title: 'User', link: '/users' },
                            ]
                        },
                        {
                            title: this.user, icon: 'mdi-account-circle',
                            items: [
                                // {title: 'Upload', link: '/uploadData'},
                                { title: 'Logout', link: 'logout' },
                            ]
                        },
                    ]
            }
            else {
                this.menuItem = [
                    {
                        title: 'order', icon: 'mdi-clipboard-text',
                        items: [
                            { title: 'New Order', link: '/orders' },
                            { title: 'Order Payment', link: '/orderpayment' },
                            { title: 'Order Status', link: '/orderStatus' },
                        ]
                    },
                    {
                        title: 'Invoice', icon: 'mdi-send',
                        items: [
                            { title: 'New Invoice', link: '/invoice' },
                            { title: 'Credit Note', link: '/creditnote' },
                            { title: 'Invoice Payment', link: '/invoicepayment' },
                            { title: 'Invoice Pay All', link: '/invpayall' },
                            { title: 'Invoice Status', link: '/invStatus' },
                        ]
                    },
                    {
                        title: 'Stock', icon: 'mdi-storefront',
                        items: [
                            { title: 'Purchase', link: '/purchase' },
                            { title: 'Return Products', link: '/returnproductcustom' },
                            { title: 'Stock status', link: '/stock' },
                            { title: 'Stock balance', link: '/stockbalance' },
                            { title: 'Inventory transfer', link: '/transfer' },
                        ]
                    },
                    {
                        title: 'Cash Book', icon: 'mdi-receipt-text',
                        items: [
                            { title: 'Cash Received Book', 'link': '/cashrecei' },
                            { title: 'Cash Payment Book', 'link': '/cashpay' }
                        ]
                    },
                    {
                        title: 'General ledger', icon: 'mdi-wallet',
                        items: [
                            { title: 'New General ledger', link: '/gl' },
                            { title: 'Report General ledger', link: '/reportGl' },
                            // {title: 'Status General ledger', link: '/glstatus'},
                            { title: 'Edit General ledger', link: '/gledit' },
                            { title: 'Trial Balance(Monthly)', link: '/tbMonthly' },
                            { title: 'Trial Balance(Annually)', link: '/tbAnnually' }
                        ]
                    },
                    {
                        title: 'Code', icon: 'mdi-reorder-horizontal',
                        items: [
                            { title: 'Customer', link: '/customer' },
                            { title: 'Product', link: '/product' },
                            { title: 'Warehouse', link: '/warehouse' },
                        ]
                    },
                    {
                        title: this.user, icon: 'mdi-account-circle',
                        items: [
                            { title: 'Logout' },
                        ]
                    },
                ],
                    this.navItem = [
                        {
                            title: 'order', icon: 'mdi-clipboard-text',
                            items: [
                                { title: 'New Order', link: '/orders' },
                                { title: 'Order Payment', link: '/orderpayment' },
                                { title: 'Order Status', link: '/orderStatus' },
                                { title: 'Order Summary By Code', link: '/ordersum' },
                            ]
                        },
                        {
                            title: 'Invoice', icon: 'mdi-send',
                            items: [
                                { title: 'New Invoice', link: '/invoice' },
                                // {title: 'Credit Note', link: '/creditnote'},
                                { title: 'Invoice Payment', link: '/invoicepayment' },
                                { title: 'Invoice Pay All', link: '/invpayall' },
                                { title: 'Invoice Status', link: '/invStatus' },
                            ]
                        },
                        {
                            title: 'Stock', icon: 'mdi-storefront',
                            items: [
                                { title: 'Purchase', link: '/purchase' },
                                { title: 'Stock status', link: '/stock' },
                                // {title: 'Stock O/R', link: '/stockOR'},
                                { title: 'Stock balance', link: '/stockbalance' },
                                { title: 'Inventory transfer', link: '/transfer' },
                            ]
                        },
                        {
                            title: 'Cash Book', icon: 'mdi-receipt-text',
                            items: [
                                { title: 'Cash Received Book', 'link': '/cashrecei' },
                                { title: 'Cash Payment Book', 'link': '/cashpay' }
                            ]
                        },
                        {
                            title: 'Report', icon: 'mdi-ballot',
                            items: [
                                { title: 'Customer Group Report', 'link': '/customergroupreport' },
                                { title: 'Customer List Report', 'link': '/customerlistreport' },
                                { title: 'Product Sales Report', 'link': '/productreport' }
                            ]
                        },
                        {
                            title: 'General ledger', icon: 'mdi-wallet',
                            items: [
                                { title: 'New General ledger', link: '/gl' },
                                { title: 'Report General ledger', link: '/reportGl' },
                                // {title: 'Status General ledger', link: '/glstatus'},
                                { title: 'Edit General ledger', link: '/gledit' },
                                { title: 'A/R Balance', link: '/arbalance' },
                                { title: 'D/R Balance', link: '/drbalance' },
                                { title: 'Trial Balance(Monthly)', link: '/tbMonthly' },
                                { title: 'Trial Balance(Annually)', link: '/tbAnnually' }
                            ]
                        },
                        {
                            title: 'Code', icon: 'mdi-reorder-horizontal',
                            items: [
                                { title: 'Customer', link: '/customer' },
                                { title: 'Product', link: '/product' },
                                { title: 'Chart Of Account', link: '/chartofaccount' },
                                { title: 'Price List', link: '/pricelist' },
                                { title: 'Warehouse', link: '/warehouse' },
                                { title: 'User', link: '/users' },
                            ]
                        },
                        {
                            title: this.user, icon: 'mdi-account-circle',
                            items: [
                                // {title: 'Upload', link: '/uploadData'},
                                { title: 'Logout', link: 'logout' },
                            ]
                        },
                    ]
            }
            // return this.menuItem
        },
        logout() {
            auth.signOut()
            // sessionStorage.isAdmin == 'null'
            this.$router.push('/')
        }
    },
    computed: {
        user() {
            return sessionStorage.user
        }
    },
    mounted() {
        if (sessionStorage.isAdmin == 'true') {
            this.isAdmin = true
        } else {
            this.isAdmin = false
        }
        this.menuRole()
    },
}
</script>

<style scoped>
.background {
    background-color: #FF9800;
}

.bgV-list {
    background-color: #FFE0B2;
}

.fontV-list {
    color: #FFCC80;
}
</style>
