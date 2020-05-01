<template>
  <div>
    <Header />
    <div class="Products mainContentContainer">
      <b-container fluid class="card estimateContainer" id="productTitleConatainer">
        <b-row class="my-1">
          <label id="titleLable" class="label">Products List</label>
        </b-row>
      </b-container>

      <!-- Datatable simple -->
      <b-container fluid class="card CustomerList estimateContainer margBot" id="titleConatainer">
        <!-- <a href="#AddProducts"> -->
        <a href="#AddProducts" v-if="userValidate('row')">
          <button
            @click="showProductControls"
            class="btn yellow buttonDefSize btn-raised addButton"
            id="addproducts_1"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Product</span>
          </button>
        </a>
        <!-- </a> -->
        <!-- datatable simple -->
        <b-row class="elasticSearchBox">
          <b-col sm="3">
            <input
              type="text"
              v-model="elasticSearchData"
              class="form-control"
              aria-describedby="emailHelp"
              placeholder="Elastic Search"
              @keyup.enter="elasticSearch"
            />
          </b-col>
          
          <b-col sm="1">
            <button type="button" class="btn yellow elasticButton" @click="elasticSearch">Search</button>
          </b-col>
          <b-col sm="1">
            <button
              type="button"
              class="btn yellow elasticSearchButton"
              @click="onReset"
            >Reset</button>
          </b-col>
        </b-row>
        <b-row class="my-1 row justify-content-center">
          <v-client-table :data="tableData" :columns="columns" :options="options">
            <template slot="actions" slot-scope="{ row }">
              <button v-if="userValidate(row)" class="editButton" @click="edit(row) , editButton()">
                <a href="#AddProducts">Edit</a>
              </button>
            </template>
          </v-client-table>
        </b-row>

        <a href="#AddProducts" v-if="userValidate('row')">
          <button
            @click="showProductControls"
            class="btn yellow buttonDefSize btn-raised addButton"
            id="addproducts_2"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon"></b-icon-plus>
            <span class="BtnTxt">Product</span>
          </button>
        </a>
      </b-container>

      <div class="editCustContainer" v-bind:style="{ display: isdisplay }" id="AddProducts">
        <addProducts
          @displayNone="isdisplay = $event"
          v-bind:editRowData="rowData"
          :toggleRequest="putrequest"
          :elasticSearch="elasticSearchToggle"
          :visible="addProductsVisible"
        ></addProducts>
      </div>
    </div>
    <Sidebar />
  </div>
</template>
<script>
import Sidebar from './Sidebar_new'
import Header from './Header_new'
import addProducts from '@/components/AddProducts'

import axios from 'axios'
// const url = "http://35.225.127.81/quotation/customers/customers/?user=1";

export default {
  created () {
    // console.log('Created Products')
    axios.defaults.baseURL =
      'http://' + localStorage.activeCompany + '.widgetor.com/quotation'
    // console.log('axios.defaults.baseURL', axios.defaults.baseURL)
    this.$store.dispatch('selectPageAction', 1)
  },
  data () {
    return {
      putrequest: true,
      isdisplay: 'none',
      addProductsVisible: false,
      rowData: '',
      elasticSearchData: '',
      elasticSearchToggle: false,

      columns: ['item_code', 'description', 'selling_price', 'actions'],
      tableData: [],
      options: {
        headings: {
          item_code: 'Item Code',
          description: 'Description',
          selling_price: 'Selling Price'
          // credit_days: 'Credit Days',
        },

        sortable: ['item_code', 'description', 'category_str', 'unit_str'],
        filterable: ['item_code', 'description', 'category_str', 'unit_str'],
        texts: {
          filterPlaceholder: 'Internal Table Search'
        }
      }
    }
  },
  mounted () {
    const data = {
      refresh: localStorage.refreshToken
    }

    this.$store.state.user.token = localStorage.accessToken
    axios
      .get('/products/products/?pagesize=50', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(response => {
        response.data.forEach(element => {
          this.tableData.push(element)
        })
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
    addProducts,
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
    showProductControls () {
      this.isdisplay = 'block'
      this.putrequest = true
      this.addProductsVisible = true
      // setTimeout(() => (this.$router.push('products')), 1000)
    },

    editButton () {
      this.putrequest = false
      this.addProductsVisible = true
      // console.log(this.putrequest)
    },

    edit (rowData) {
      this.isdisplay = 'block'
      this.rowData = rowData
      // console.log(this.rowData)
      // setTimeout(() => (this.$router.push('products')), 1000)

      // console.log(this.tableData[id])
    },
    elasticSearch () {
      this.columns = ['item_code', 'description', 'selling_price', 'actions']
      axios
        .get(`/products/products/?search=${this.elasticSearchData}`, {
          headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        })
        .then(response => {
          if (response.data.length === 0) {
            this.$alert('No results found!!!!', 'Error', 'error')
          } else {
            this.tableData.length = 0
            this.tableData = []
            response.data.forEach(element => {
              this.tableData.push(element)
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.elasticSearchToggle = true
    },
    onReset () {
      this.isdisplay = 'none'
      this.elasticSearchToggle = false
      axios
        .get('/products/products/?pagesize=50', {
          headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        })
        .then(response => {
          this.tableData.length = 0
          this.tableData = []
          response.data.forEach(element => {
            this.tableData.push(element)
          })
        })
        .catch(err => {
          console.log(err)
        })
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
/* .rowInput:focus {
  border-color: #ffc000 !important;
  box-shadow: 0px 0px 3px 1px #ffc000;
} */
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
#addproducts_1,
#addproducts_2 {
  width: 150px !important;
  height: 50px;
  width: 50px;
  margin-left: 40px;
  margin-bottom: 20px;
}
.elasticSearchBox {
  margin-left: 30%;
}

a {
  color: white;
}
@media only screen and (min-width: 601px) {
  .elasticSearchButton {
    margin-left: 20px;
  }
}

@media only screen and (max-width: 600px) {
  .elasticSearchBox {
  margin-left: 10px;
}
/* .elasticSearchButton{
  margin-left: 0px;
} */

.elasticButton{
  margin-top: 10px;
  margin-bottom: 10px;
}
}

</style>
