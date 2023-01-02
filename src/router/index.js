import Vue from 'vue'
import VueRouter from 'vue-router'
// import Router from 'vue-router'
// import mainMenuView from '@/components/mainMenu'

import orders from '@/views/Orders'
import OrderPayment from '@/views/orderPayment'
import Invoice from '@/views/invoice'
import InvoicePayment from '@/views/invPayment'
import invpayall from '@/views/invpayall'
import cashrecei from '@/views/cashrecei'
import cashpay from '@/views/cashpay'
import Generalledger from '@/views/gl'
import Customer from '@/views/customer'
import Product from '@/views/product'
import user from '@/views/users'
import ReportGl from '@/views/reportGl'
import glstatus from '@/views/glstatus'
import tbMonthly from '@/views/tbMonthly'
import tbAnnually from '@/views/tbAnnually'
import orderStatus from '@/views/orderStatus'
import invStatus from '@/views/invStatus'
import login from '@/views/login'
import index from '@/views/index'
import uploadData from '@/views/uploadData'
import pricelist from '@/views/pricelist'
import gledit from '@/views/gledit'
import chartofaccount from '@/views/chartofaccount'
import customergroupreport from '@/views/customergroupreport'
import customerlistreport from '@/views/customerlistreport'
import productreport from '@/views/productreport'
import purchase from '@/views/purchase'
import stock from '@/views/stock'
import arbalance from '@/views/arbalance'
import drbalance from '@/views/drbalance'
import proddelivery from '@/views/proddelivery'
import warehouse from '@/views/warehouse'
import printFormDelivery from '@/views/printFormDelivery'
import stockBalance from '@/views/stockBalance'
import stockor from '@/views/stockor'
import ordersum from '@/views/ordersum'
import creditnote from '@/views/creditnote'
import returnproduct from '@/views/returnproduct'
import returnproductcustom from '@/views/returnproductcustom'
import transfer from '@/views/transfer'

Vue.use(VueRouter)

export default new VueRouter({
// const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // routes
   routes: [
    { path: '/uploadData', name: 'uploadData', component: uploadData },
    { path: '/', name: 'login', component: login },
    { path: '/index', name: 'index', component: index },
    { path: '/orders', name: 'orders', component: orders },
    { path: '/invoice', name: 'invoice', component: Invoice },
    { path: '/orderpayment', name: 'orderpayment', component: OrderPayment },
    { path: '/invoicepayment', name: 'invoicepayment', component: InvoicePayment },
    { path: '/invpayall', name: 'invpayall', component: invpayall },
    { path: '/cashrecei', name: 'cashrecei', component: cashrecei },
    { path: '/cashpay', name: 'cashpay', component: cashpay },
    { path: '/gl', name: 'Generalledger', component: Generalledger },
    { path: '/reportGl', name: 'ReportGl', component: ReportGl },
    { path: '/glstatus', name: 'glstatus', component: glstatus },
    { path: '/customer', name: 'Customer', component: Customer },
    { path: '/product', name: 'Product', component: Product },
    { path: '/users', name: 'user', component: user },
    { path: '/tbMonthly', name: 'tbMonthly', component: tbMonthly },
    { path: '/tbAnnually', name: 'tbAnnually', component: tbAnnually },
    { path: '/orderStatus', name: 'orderStatus', component: orderStatus },
    { path: '/invStatus', name: 'invStatus', component: invStatus },
    { path: '/pricelist', name: 'pricelist', component: pricelist },
    { path: '/gledit', name: 'gledit', component: gledit },
    { path: '/chartofaccount', name: 'chartofaccount', component: chartofaccount },
    { path: '/customergroupreport', name: 'customergroupreport', component: customergroupreport },
    { path: '/customerlistreport', name: 'customerlistreport', component: customerlistreport },
    { path: '/productreport', name: 'productreport', component: productreport },
    { path: '/purchase', name: 'purchase', component: purchase },
    { path: '/stock', name: 'stock', component: stock },
    { path: '/arbalance', name: 'arbalance', component: arbalance },
    { path: '/drbalance', name: 'drbalance', component: drbalance },
    { path: '/productdelivery', name: 'proddelivery', component: proddelivery },
    { path: '/warehouse', name: 'warehouse', component: warehouse },
    { path: '/formdelivery', name: 'printFormDelivery', component: printFormDelivery },
    { path: '/stockbalance', name: 'stockBalance', component: stockBalance },
    { path: '/stockOR', name: 'stockor', component: stockor },
    { path: '/ordersum', name: 'ordersum', component: ordersum },
    { path: '/creditnote', name: 'creditnote', component: creditnote },
    { path: '/returnproduct', name: 'returnproduct', component: returnproduct },
    { path: '/returnproductcustom', name: 'returnproductcustom', component: returnproductcustom },
    { path: '/transfer', name: 'transfer', component: transfer },
    { 
      path: '/orderReport',
      props: true,
      name: 'orderReport',
      component: () => import('@/views/orderReport.vue')
    },
    { 
      path: '/orderproreport',
      props: true,
      name: 'orderproreport',
      component: () => import('@/views/orderproreport.vue')
    },
    { 
      path: '/orderReportDO',
      props: true,
      name: 'orderReportDO',
      component: () => import('@/views/orderReportDO.vue')
    },
    { 
      path: '/invReport',
      // props: true,
      name: 'invReport',
      component: () => import('@/views/invReport.vue') 
    },
    { 
      path: '/invproreport',
      // props: true,
      name: 'invproreport',
      component: () => import('@/views/invproreport.vue') 
    },
    { 
      path: '/invReportDI',
      // props: true,
      name: 'invReportDI',
      component: () => import('@/views/invReportDI.vue') 
    },
    { 
      path: '/newrv',
      // props: true,
      name: 'newrv',
      component: () => import('@/views/newrv.vue') 
    },
    { 
      path: '/newpv',
      // props: true,
      name: 'newpv',
      component: () => import('@/views/newpv.vue') 
     },
  ],
})
