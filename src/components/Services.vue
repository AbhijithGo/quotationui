<template>
  <div>
    <Header />
    <!-- </div> -->
    <!-- <div> -->
    <!-- </div> -->
    <div class="Services mainContentContainer">
      <b-container fluid class="card estimateContainer" id="servicetitleConatainer">
        <b-row class="my-1">
          <label id="titleLable" class="label">Services List</label>
        </b-row>
      </b-container>

      <!-- Datatable simple -->
      <b-container fluid class="card CustomerList estimateContainer margBot" id="titleConatainer">
        <!-- datatable simple -->
        <a href="#AddServices" v-if="userValidate('row')">
          <button
            @click="showServiceControls"
            class="btn yellow buttonDefSize btn-raised addButton"
            id="addServices_1"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Service</span>
          </button>
        </a>

        <b-row class="my-1 row justify-content-center">
          <v-client-table :data="tableData" :columns="columns" :options="options">
            <template slot="actions" slot-scope="{ row }">
              <button v-if="userValidate(row)" class="editButton" @click="edit(row) , editButton()">
                <a href="#AddServices">Edit</a>
              </button>
            </template>
          </v-client-table>
        </b-row>
        <a href="#AddServices" v-if="userValidate('row')">
          <button
            @click="showServiceControls"
            class="btn yellow buttonDefSize btn-raised addButton"
            id="addServices_2"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Service</span>
          </button>
        </a>
      </b-container>

      <div class="editCustContainer" v-bind:style="{ display: isdisplay }" id="AddServices">
        <addServices
          @displayNone="isdisplay = $event"
          v-bind:editRowData="rowData"
          :toggleRequest="putrequest"
          :visible="addServicesVisible"
          @resetVisible="addServicesVisible = $event"
        ></addServices>
      </div>
    </div>
    <Sidebar />
  </div>
</template>
<script>
import Sidebar from './Sidebar_new'
import Header from './Header_new'
import addServices from '@/components/AddServices'

import axios from 'axios'
// const url = "http://35.225.127.81/quotation/customers/customers/?user=1";

export default {
  created () {
    // console.log('Created Service')
    axios.defaults.baseURL =
      'http://' + localStorage.activeCompany + '.widgetor.com/quotation'
    // console.log('axios.defaults.baseURL', axios.defaults.baseURL)
    this.$store.dispatch('selectPageAction', 4)
  },
  data () {
    return {
      isdisplay: 'none',
      putrequest: true,
      addServicesVisible: false,
      rowData: '',
      columns: ['service_code', 'description', 'category_str', 'actions'],
      tableData: [],
      options: {
        headings: {
          service_code: 'Service Code',
          description: 'Description',
          category_str: 'Category'
          // unit_str: 'Unit',
          // credit_days: 'Credit Days',
        },

        sortable: ['service_code', 'description', 'category_str'],
        filterable: ['service_code', 'description', 'category_str']
      }
    }
  },
  mounted () {
    const data = {
      refresh: localStorage.refreshToken
    }
    this.$store.state.user.token = localStorage.accessToken
    axios
      .get('/products/services/', {
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
    // editContact,
    addServices,
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
    showServiceControls () {
      this.isdisplay = 'block'
      this.putrequest = true
      this.addServicesVisible = true
      // setTimeout(() => (this.$router.push('services')), 1000)
    },
    edit (rowData) {
      this.isdisplay = 'block'
      this.rowData = rowData
      this.addServicesVisible = true
      // console.log(this.rowData)
      // setTimeout(() => (this.$router.push('services')), 1000)
    },
    editButton () {
      this.putrequest = false
      // console.log(this.putrequest)
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
}
.customercard {
  height: 40px;
  background-color: white;
  padding: 5px;
  margin-bottom: 10px;
  font-family: Helvetica;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.5);
}
#addServices_1,
#addServices_2 {
  width: 150px !important;
  height: 50px;
  width: 50px;
  margin-left: 15px;
  margin-bottom: 20px;
}

a {
  color: aliceblue;
}
</style>
