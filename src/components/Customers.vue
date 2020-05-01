<template>
  <div>
    <Header />
    <div class="Customers mainContentContainer">
      <b-container
        fluid
        class="card estimateContainer"
        id="customerTitleContainer"
      >
        <b-row class="my-1">
          <label id="titleLable" class="label">Customers</label>
        </b-row>
      </b-container>

      <!-- Datatable simple -->
      <b-container fluid class="card CustomerList estimateContainer2 margBot">
        <!-- datatable simple -->
        <a href="#AddCustomers" v-if="userValidate('row')">
          <button
            @click="showCustomerControls"
            id="addCustomer_1"
            class="btn yellow buttonDefSize btn-raised addButton"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Customer</span>
          </button>
        </a>
        <b-row class="my-1 row justify-content-center">
          <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
        </b-row>
        <a href="#AddCustomers" v-if="userValidate('row')">
          <button
            @click="showCustomerControls"
            id="addCustomer_2"
            class="btn yellow buttonDefSize btn-raised addButton"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Customer</span>
          </button>
        </a>
      </b-container>

      <div class="editCustContainer" v-bind:style="{ display: isdisplay }">
        <editCustomers @displayNone="isdisplay = $event" id="AddCustomers" :visible="addCustomersVisible"></editCustomers>
      </div>

      <!-- <div class="editConContainer" v-bind:style="{ display: isdisplay }">
      <editContact></editContact>-->
    </div>
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from './Sidebar_new'
import Header from './Header_new'
import editCustomers from '@/components/editcustomers'
import editContact from '@/components/editcontact'

import axios from 'axios'

export default {
  created () {
    // console.log('Created Customers')
    axios.defaults.baseURL =
      'http://' + localStorage.activeCompany + '.widgetor.com/quotation'
    // console.log('axios.defaults.baseURL', axios.defaults.baseURL)
    this.$store.dispatch('selectPageAction', 2)
  },
  data () {
    return {
      isdisplay: 'none',
      addCustomersVisible: false,
      columns: [
        'id',
        'customer_name',
        'customer_type_str',
        'customer_category_str',
        'credit_days'
      ],
      tableData: [],
      options: {
        headings: {
          id: 'ID',
          customer_name: 'Customer Name',
          customer_type_str: 'Customer Type',
          customer_category_str: 'Customer Category',
          credit_allowed: 'Credit Allowed',
          credit_days: 'Credit Days'
        },

        sortable: [
          'id',
          'customer_name',
          'customer_type_str',
          'customer_category_str',
          'credit_allowed',
          'credit_days'
        ],
        filterable: [
          'id',
          'customer_name',
          'customer_type_str',
          'customer_category_str',
          'credit_allowed',
          'credit_days'
        ]
      }
    }
  },
  mounted () {
    const data = {
      refresh: localStorage.refreshToken
    }
    this.$store.state.user.token = localStorage.accessToken
    axios
      .get('/customers/customers', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(response => {
        this.tableData = response.data
      })
      .catch(response => {
        // console.log('daily token not working')

        axios
          .post('/users/token_refresh/', data, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            // console.log(response.data.access)
            this.$store.state.user.token = localStorage.accessToken
            localStorage.accessToken = response.data.access
            localStorage.loginToken = response.data.access
            this.$router.go(0)
          })
          .catch(error => {
            // console.log('response not working')
            console.log(error)
            this.$router.push('/')
          })
      })
  },
  components: {
    editContact,
    editCustomers,
    Header,
    Sidebar
  },
  methods: {
    userValidate (rowData) {
      this.$store.state.user.username = localStorage.username
      this.$store.state.user.isAdmin = localStorage.isAdmin
      // console.log('this.$store.getters.username', this.$store.getters.username)
      // console.log('rowData.prepared_by', rowData.prepared_by)
      // console.log('this.$store.state.user.isAdmin', this.$store.state.user.isAdmin)
      if (this.$store.state.user.isAdmin === 'true') {
        // console.log('in if')
        return true
      } else if (this.$store.getters.username === rowData.prepared_by) {
        // console.log('in else if')
        return true
      } else {
        // console.log('in else')
        return false
      }
    },
    showCustomerControls () {
      this.isdisplay = 'block'
      this.addCustomersVisible = true
      // setTimeout(() => this.$router.push('customers'), 1000)
    }
  }
  // mounted() {
  //         axios.get(url).then(response => {
  //           this.results = response.data
  //         })
  //       }
}
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);
@import url(
  https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300);
@import "http://fonts.googleapis.com/css?family=Open+Sans:300,400,700";
.margBot {
  margin-bottom: 20px;
}
a {
  color: inherit;
}
#titleLable {
  margin-bottom: 0;
  font-size: 25px;
  padding: 0px 17px;
}
.label {
  text-align: left;
  display: block;
  color: #666;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  /* font-family: 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; */
  font-weight: 700;
  font-size: 100%;
}
.docIcon {
  position: absolute;
  height: auto;
  width: 33px;
  right: 5px;
  color: #9e9e9e;
}
.docIcon_1 {
  right: 38px;
}
.docIcon_2 {
  right: 71px;
}
.inputContainer {
  display: block;
  width: 100%;
  position: relative;
}
.text-danger {
  color: #ff6565;
}
.row {
  padding: 10px;
}
.rowInput {
  height: 34px;
  border: 1px solid lightgrey !important;
  border-radius: 4px;
  padding-right: 46px;
  font: 15px/23px "Open Sans", Helvetica, Arial, sans-serif;
  color: #404040;
}
.rowInput:focus {
  border-color: #ffc000 !important;
  box-shadow: 0px 0px 3px 1px #ffc000;
}
.estimateContainer {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  /* margin-top: 60px !important; */
}

.estimateContainer2 {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.customercard {
  height: 40px;
  background-color: white;
  padding: 5px;
  margin-bottom: 10px;
  font-family: Helvetica;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.5);
}
.btn-dark,
.btn-warning {
  width: 50px;
  height: 50px;
  margin-left: 15px;
}

#addCustomer_1,
#addCustomer_2 {
  width: 150px !important;
  margin-bottom: 20px;
  margin-left: 30px;
}

.titleConatainer {
  margin-top: 5%;
}
/* card css */
</style>
