<template>
  <div>
    <!-- style='position:relative' -->
    <Header />
    <!-- :addCompany="addComp" @createOccured="addComp = $event" -->
    <div class="addEstimateContainer mainContentContainer">

      <b-button @click="startTour">Start Tour</b-button>
      <b-container
        v-if="viewHtmlBool"
        fluid
        class="card estimateContainer"
        id="EstimationListTitleConatainer"
      >
        <b-row class="my-1">
          <label id="titleLable" class="label">Estimate List</label>
        </b-row>
      </b-container>
      <b-container id="EstimationList" v-if="viewHtmlBool" fluid class="card margBot">
        <a href="#AddEstimateCont" v-if="userValidate('row')">
          <button
            @click="showEstimateControls"
            id="addButton_1"
            class="btn yellow buttonDefSize btn-raised addButton"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon" id="estimateButton"></b-icon-plus>
            <span class="BtnTxt">Estimate</span>
          </button>
        </a>

        <b-row class="my-1 row justify-content-center">
          <v-client-table
            id="clientTable"
            class="dashBoardTable"
            :data="tableData"
            :columns="columns"
            :options="options"
          >
            <template
              slot="sales_Man"
              slot-scope="{ row }"
            >{{row.sale_person_str.sales_person_name}}</template>
            <template slot="status" slot-scope="{ row }">{{statusStr(row)}}</template>
            <template slot="actions" slot-scope="{ row }">
              <a href="#AddEstimateCont">
                <button class="editButton" v-if="userValidate(row)" @click="edit(row)">Edit</button>
              </a>
              <button class="editButton" @click="viewHtml(row)">View</button>
              <button class="editButton" @click="statusBox(row)">Update</button>
              <!-- <b-button v-if="viewHtmlBool" class="viewBtn" @click="viewHtml">
                  <b-icon class="customDocIcon_html" icon="document-richtext"></b-icon>
                  <span class="viewBtnTxt_html">view</span>
              </b-button>-->
            </template>
          </v-client-table>
        </b-row>
        <modal name="statusPopup" width="222px" height="160px">
          <div class="status">
            <!-- v-if="statusBool" -->
            <b-form-select
              v-model="statusOptionSelected"
              :options="statusOptions"
              class="statusSelect"
            ></b-form-select>
            <b-button class="statusRowBtn" id="confirmStatusBtn" @click="confirmStatus">Confirm</b-button>
            <b-button class="statusRowBtn cancelStatusBtn" @click="cancelStatus">Cancel</b-button>
          </div>
        </modal>
        <a href="#AddEstimateCont" v-if="userValidate('row')">
          <button
            @click="showEstimateControls"
            id="addButton_2"
            class="btn yellow buttonDefSize btn-raised addButton"
          >
            <b-icon-plus class="fa fa-plus customPlusIcon" id="estimateButton2"></b-icon-plus>
            <span class="BtnTxt">Estimate</span>
          </button>
        </a>
      </b-container>
      <!-- <b-row class="my-1">
          <b-button v-if="viewHtmlBool" class="htmlFormBtn" @click="viewHtml">
            <b-icon class="customDocIcon_html" icon="document-richtext"></b-icon>
            <span class="viewBtnTxt_html">view</span>
          </b-button>
      </b-row>-->
      <div id="AddEstimateCont">
        <AddEstimate
          @resetEdit="rowData = $event"
          @resetEvent="reset($event)"
          @resetVisible="addBtnBool = $event"
          :tableData="tableData"
          :editRowData="rowData"
          :tour="tour"
          :toggleRequest="putrequest"
          v-if="viewHtmlBool && addBtnBool"
          :visible="addBtnBool"
        />
      </div>
      <b-container
        v-if="!viewHtmlBool"
        fluid
        class="card estimateContainer htmlViewContainer"
        id="ename_enum_container"
      >
        <b-row class="my-1 btnRow">
          <b-button class="pdfFormBtn" @click="viewpdf">
            <b-icon class="customDocIcon_pdf" icon="document-richtext"></b-icon>
            <span class="viewBtnTxt_pdf">Open as a Pdf</span>
          </b-button>
          <b-button class="pdfFormBtn" @click="printPdf" id="printPdf">
            <!-- @click="printPdf" -->
            <b-icon class="customDocIcon_pdf" icon="document-richtext"></b-icon>
            <span class="viewBtnTxt_pdf">Print as a Pdf</span>
          </b-button>
          <!-- <a :href='doc_pdfView'>Pdf View</a> -->
          <b-icon class="customXIcon" @click="closeHtmlView" icon="x-square"></b-icon>
        </b-row>
        <iframe id="printHtmlView" name="printHtmlView" class="htmlView" :src="doc_htmlView">
          <p>Your browser does not support iframes.</p>
        </iframe>
      </b-container>
    </div>
    <Sidebar />
    <v-tour name="myTour" :steps="steps" :options="{ highlight: true }"></v-tour>
  </div>
</template>

<script>
import Sidebar from './Sidebar_new'
import Header from './Header_new'
import AddEstimate from './AddEstimate'
import axios from 'axios'
// window.onbeforeunload = function () {
//   console.log('refresh this', this)
//   this.$router.push('quotations')
// }
export default {
  name: 'my-tour',
  components: {
    AddEstimate: AddEstimate,
    Sidebar,
    Header
  },
  created () {
    // console.log('Created Estimate')
    axios.defaults.baseURL =
      'http://' + localStorage.activeCompany + '.widgetor.com/quotation'
    // console.log('axios.defaults.baseURL', axios.defaults.baseURL)
    this.$store.dispatch('selectPageAction', 3)
  },
  mounted () {
    const data = {
      refresh: localStorage.refreshToken
    }

    this.$store.state.user.token = localStorage.accessToken
    axios
      .get('quotes/quotations/', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(response => {
        this.tableData = response.data
        // console.log('response.data', response.data)
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
  data () {
    return {
      steps: [
          {
            target: '#estimateButton',  // We're using document.querySelector() under the hood
            header: {
              title: 'Get Started',
            },
            content: `Use this button to add an estimate!`
          },
          {
            target: '#clientTable',
            content: 'Use the Buttons to Edit, View and Update specific Estimates',
            params: {
              placement: 'left'
            }
          },
          {
            target: '#estimateButton2',  // We're using document.querySelector() under the hood
            content: `You can also use this button to add an estimate!`
          },

          // {
          //   target: '[data-v-step="2"]',
          //   content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
          //   params: {
          //     placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          //   }
          // }
        ],
      tour: false,
      statusBool: false,
      viewHtmlBool: true,
      doc_htmlView: '',
      doc_pdfView: '',
      putrequest: false,
      addBtnBool: false,
      rowData: '',
      // statusRowData: '',
      statusStrings: {
        P: 'Prepared',
        S: 'Sent',
        A: 'Approved'
      },
      statusOptions: [
        { value: 'P', text: 'Prepared' },
        { value: 'S', text: 'Sent' },
        { value: 'A', text: 'Approved' }
      ],
      statusOptionSelected: '',
      quotationId: '',
      columns: [
        'quotation_id',
        'generated_date',
        'customer_str',
        'sales_Man',
        'prepared_by',
        'status',
        'amount',
        'actions'
      ],
      tableData: [],
      options: {
        headings: {
          quotation_id: 'Estimate ID',
          generated_date: 'Date',
          customer_str: 'Customer',
          sales_Man: 'Sales Man',
          prepared_by: 'Prepared by',
          status: 'Status',
          amount: 'Amount'
          // credit_days: 'Credit Days',
        },

        sortable: [
          'quotation_id',
          'generated_date',
          'customer_str',
          'sale_person_str.sales_person_name'
        ],
        filterable: [
          'quotation_id',
          'generated_date',
          'customer_str',
          'sale_person_str.sales_person_name'
        ]
      }
    }
  },
  methods: {
    startTour() {
    this.$tours['myTour'].start()
    this.tour = true
    },
    confirmStatus () {
      axios
        .put(
          `quotes/updatestatus/${this.quotationId}/`,
          { status: this.statusOptionSelected },
          {
            headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
          }
        )
        .then(response => {
          // console.log('response', response)
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancelStatus () {
      this.statusOptionSelected = ''
      // this.statusBool = false
      this.$modal.hide('statusPopup')
    },
    statusBox (rowData) {
      // this.statusBool = true
      this.$modal.show('statusPopup')
      this.quotationId = rowData.id
      // this.statusRowData = rowData
      this.statusOptionSelected = rowData.status
    },

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
    statusStr (rowData) {
      return this.statusStrings[rowData.status]
    },
    scrollToEnd () {
      // var container = this.$el.querySelector('#app')
      // console.log('container.scrollHeight', container.scrollHeight)
      // container.scrollTop = container.scrollHeight
    },
    reset (eventTarget) {
      this.addBtnBool = eventTarget
      this.rowData = ''
      this.putrequest = false
    },
    viewHtml (row) {
      // console.log('rowData', row)
      var quotationId = row.id
      this.getCotationTemplateLinks(quotationId)
      this.viewHtmlBool = false
    },
    viewpdf () {
      window.open(this.doc_pdfView)
    },
    printPdf () {
      // if (window.addEventListener) {
      //   window.addEventListener('message', onMessageReceived, false)
      // } else {
      //   window.attachEvent('onmessage', onMessageReceived, false)
      // }
      // var printable = document.querySelector('iframe')
      // var printableOrigin = 'http://public.widgetor.com'
      // var data = {
      //   method: 'print'
      // }
      // var message = JSON.stringify(data)
      // printable.contentWindow.postMessage(message, printableOrigin)
      // function onMessageReceived (event) {
      //   console.log((/^https?:\/\/player.vimeo.com/).test(event.origin))
      //   if (!(/^http?:\/\/public.widgetor.com/).test(event.origin)) {
      //     // console.log('in if and ')
      //     return false
      //   }
      // }
      // var f = window.frames[0]
      var printable = document.querySelector('iframe')
      console.log('Sending')
      printable.contentWindow.postMessage('Print', `http://${this.$store.state.user.activeCompany}.widgetor.com`)
      // var f = window.frames['printHtmlView']
      // console.log('Sending', window)
      // f.postMessage('Print', 'http://widgetor.com')
    },
    closeHtmlView () {
      this.viewHtmlBool = true
      this.doc_htmlView = ''
    },
    getCotationTemplateLinks (index) {
      axios
        .post(
          'quotes/createquotation/' + index + '/',
          {},
          {
            headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
          }
        )
        .then(res => {
          this.doc_htmlView = res.data.doc_html
          this.doc_pdfView = res.data.doc_pdf
        })
        .catch(error => {
          console.log(error)
        })
    },
    showEstimateControls () {
      this.addBtnBool = true
      // setTimeout(() => this.$router.push('quotations'), 2000)
      // this.scrollToEnd()
    },

    // editButton () {
    //   this.putrequest = false
    // },

    edit (rowData) {
      this.putrequest = true
      this.isdisplay = 'block'
      this.rowData = rowData
      this.addBtnBool = true
      // console.log(this.rowData)
      // this.scrollToEnd()
      // setTimeout(() => this.$router.push('quotations'), 2000)
      // console.log(this.tableData[id])
    }
  }
}
</script>

<style scoped>
.statusRowBtn {
  width: 70px;
  position: relative;
  background-color: #ffc000;
}
.cancelStatusBtn:hover {
  color: #ffc000;
}
#confirmStatusBtn {
  left: 21px;
}
#confirmStatusBtn:hover {
  background-color: #ffc000;
  color: #333;
}
.cancelStatusBtn {
  background-color: #3a3636;
  margin-left: 33px;
}
.status {
  border: 2px solid #ffc000;
  height: 130px;
  width: 200px;
  border-radius: 10px;
  position: absolute;
  background: white;
  /* right: 0.2%;
    top: 34%; */
  left: 5%;
  top: 9%;
  /* transform: translate(-50%, -50%); */
  box-shadow: 0px 0px 3px 1px #ffc000;
}
.statusSelect {
  width: 80%;
  margin: 10% 10%;
  font-size: 16px;
  border: 1px solid lightgrey !important;
  border-radius: 4px;
  padding-right: 46px;
  font: 15px/23px "Open Sans", Helvetica, Arial, sans-serif;
  color: #404040;
  font-weight: 500;
}
.statusSelect:focus {
  border-color: #ffc000 !important;
  box-shadow: 0px 0px 3px 1px #ffc000;
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

.margBot {
  margin-bottom: 20px;
}
.btnRow {
  position: relative;
  padding: 10px;
}
.pdfFormBtn {
  position: relative;
  background-color: #ffc000;
  width: auto;
  transform: translateX(-50%);
  left: 42%;
}
#printPdf {
  left: 44%;
}
.customDocIcon_pdf {
  font-size: 200% !important;
  position: absolute !important;
  left: 6px;
  bottom: 2px;
}
.customDocIcon_html {
  font-size: 200% !important;
  position: absolute !important;
  left: 3px;
  bottom: 4px;
}
.viewBtnTxt_pdf {
  padding-left: 28px;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
}
.viewBtnTxt_html {
  padding-left: 25px;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
}
.viewBtn {
  padding: 6px 8px !important;
  position: relative;
  background-color: #ffc000;
}
.htmlViewContainer {
  position: absolute;
  height: 100%;
  width: 80%;
  margin-left: 7%;
}
.estimateContainer {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.htmlView {
  height: 100%;
  margin: 10px;
}
.customXIcon {
  color: #ffc000;
  font-size: 43px;
  position: absolute;
  right: 2%;
  cursor: pointer;
}
/* .customPlusIcon {
  font-size: 200% !important;
  position: absolute !important;
  left: 9px;
  bottom: 6px;
} */
.customXIcon:hover {
  color: #333;
}
/* #addEstimate {
    width: 10% !important;
    height: 50px;
    margin-left: 15px;
    margin-bottom: 15px;
    position: relative;
} */
/* .yellow {
  background-color: #ffc000;
  color: white; */
/* } */
.yellow:hover {
  color: #333;
}
/* .customPlusIconEstimate {
  font-size: 280% !important;
  position: absolute !important;
  left: 1px;
  top: 5px;
  font-weight: 700;
}
.estimateBtnTxt {
  font: 25px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  padding-left: 25px;
  font-size: 20px;
  font-weight: 600;
} */
.table-responsive > .table-bordered {
  border: 1px solid #ddd;
}
.row {
  padding: 10px;
  position: relative;
}
#addEstimate a,
.editButton a {
  color: inherit;
}
.addButton {
  width: 150px !important;
  height: 50px;
  margin-left: 40px;
  margin-bottom: 20px;
  color: white;
}
a {
  color: inherit;
}

.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0,0,0,.4);
}
</style>
