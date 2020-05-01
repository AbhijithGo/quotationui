import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import AddCompany from '@/components/AddCompany.vue'
import Quotations from '@/components/EstimateDashboard'
import Customers from '@/components/Customers'
import AddCustomers from '@/components/Customers'
import Products from '@/components/Products'
import Services from '@/components/Services'
import Salesmen from '@/components/Salesmen'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/home',
    name: 'Home',
    component: Home

  },
  {
    path: '/addcompany',
    name: 'AddCompany',
    component: AddCompany
  },
  {
    path: '/Customers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/Quotations',
    name: 'Quotations',
    component: Quotations
  },
  {
    path: '/Products',
    name: 'Products',
    component: Products
  },
  {
    path: '/Services',
    name: 'Services',
    component: Services
  },
  {
    path: '/Salesmen',
    name: 'Salesmen',
    component: Salesmen
  },
  {
    path: '/AddEstimateCont',
    name: 'Quotations',
    component: Quotations
  },
  {
    path: '/AddProducts',
    name: 'Products',
    component: Products
  },
  {
    path: '/AddCustomers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/AddServices',
    name: 'Services',
    component: Services
  },
  {
    path: '/AddSalesman',
    name: 'Salesmen',
    component: Salesmen
  }

  ]
})
