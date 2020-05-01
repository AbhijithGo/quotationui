<template>
  <div>
    <b-container fluid class="card estimateContainer" id="titleConatainer">
      <b-row class="my-1">
        <label id="titleLable" class="label">Add Customer</label>
      </b-row>
    </b-container>

    <b-form inline @submit="onSubmit" @reset="onReset" v-if="show">
      <b-container fluid class="card estimateContainer eDetailsContainer" id="eDetails">
          <b-row class="my-1">
            <b-col sm="4">
              <b-form-group>
              <label class="label">
                Name:
                <span class="text-danger">*</span>
              </label>
              <b-form-input
                class="rowInput w-100"
                v-model="form.customer_name"
                size="md"
                id="c_name"
                type="text"
                required
                placeholder="Name"
              ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col sm="3">
              <label class="label">
                Customer Type
                <span class="text-danger">*</span>
              </label>
              <b-form-select
                v-model="form.customer_type"
                :options="CustomerTypeList"
                class="rowInput"
                required
              ></b-form-select>
              <div class="mt-3">
                <strong>{{ selected }}</strong>
              </div>
            </b-col>

            <b-col sm="3">
              <label class="label">
                Customer Category
                <span class="text-danger">*</span>
              </label>

              <b-form-select
                v-model="form.customer_category"
                :options="CustomerCategoryList"
                class="rowInput"
                required
              ></b-form-select>
              <div class="mt-3">
                <strong>{{ selected2 }}</strong>
              </div>
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="3">
              <label class="label">Credit Allowed:</label>
              <div>
                <b-form-checkbox
                  v-model="form.credit_allowed"
                  name="check-button"
                  switch
                  size="lg"
                  class="toggleSwitch"
                >
                  <!-- <b>({{ checked }})</b> -->
                </b-form-checkbox>
              </div>
            </b-col>

            <b-col sm="3" v-if="form.credit_allowed">
              <label class="label">Credit Days:</label>
              <b-form-input
                class="rowInput"
                v-model="form.credit_days"
                size="md"
                id="contact_name"
                type="text"
                placeholder="Contact.."
              ></b-form-input>
            </b-col>
          </b-row>

          <b-button class="yellow btn addContactButton" @click="showContact">Add Contacts<a href="#eDetails"></a></b-button>
          </a>
          <!-- <b-button class="row m-3" type="submit" variant="warning">Submit</b-button>
          <b-button class="row m-2" type="reset" variant="dark">Reset</b-button>-->
      </b-container>

      <!-- <b-container fluid class="card estimateContainer" id="titleConatainer">
        <b-row class="my-1">
          <label id="titleLable" class="label">Add Contacts</label>
        </b-row>
      </b-container> -->

      <b-container fluid class="card estimateContainer" id="titleConatainer" v-bind:style="{ display: isdisplay }">
          <!-- <h3>List Of Contacts: </h3> -->
          <b-row class="my-1">
            <label id="titleLable" class="label">List Of Contacts: </label>
          </b-row>
        <b-row class="my-1" v-for="(item,index) in contactsList" :key="index">
          <h3 style="margin-left: 20px ;margin-top: 2px ; ">{{contactsList[index].contact_name}} </h3>
        </b-row>
      </b-container>

      <b-container fluid class="card estimateContainer margBot" id="eDetails" v-bind:style="{ display: isdisplay }">
        <b-row class="my-1">
          <b-col sm="3">
            <label class="label">
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              class="rowInput"
              size="md"
              id="c_contact_name"
              type="text"
              placeholder="Enter Name"
              v-model="form.contacts[0].contact_name"
            ></b-form-input>
          </b-col>
          <b-col sm="3">
            <label class="label">
              Designation:
              <span class="text-danger">*</span>
            </label>

            <!-- Designation dropdown -->
            <b-form-select
              :options="DesignationList"
              class="rowInput"
              id='c_designation'
              v-model="form.contacts[0].designation"
            ></b-form-select>
            <div class="mt-3"></div>
          </b-col>

          <!-- <b-col sm="3">
            <label class="label">
              Customer(DropDown)
              <span class="text-danger">*</span>
            </label>

            <b-form-select
              :options="CustomerList"
              class="rowInput"
              id='c_customer'
              v-model="form.contacts[0].customer"
            ></b-form-select>
            <div class="mt-3"></div>
          </b-col> -->
        </b-row>

          <b-row sm="6" class="w-50">
            <b-row v-for="(emailEle, i) in form.contacts[0].emails" :key="i">
              <b-col>
                <label class="label">
                  Email
                  <span class="text-danger">*</span>
                </label>
                <b-form-input
                  class="rowInput"
                  size="md"
                  id="c_email"
                  type="text"
                  placeholder="Enter Email"
                  v-model="emailEle.email"
                ></b-form-input>
              </b-col>

              <b-col>
                <label class="label">Is Primary?</label>
                <b-form-checkbox name="check-button" size="lg" v-model="emailEle.is_primary" @change="emailChk(i)">
                  <!-- <b>({{ checked }})</b> -->
                </b-form-checkbox>
              </b-col>

              <b-col sm="1">
                <b-button variant="success" @click="addEmail">Add</b-button>
              </b-col>
              <b-col>
                <b-button variant="danger" @click="delEmail(i)">Delete</b-button>
              </b-col>
            </b-row>
          </b-row>

          <b-row sm="6" class="w-50">
            <b-row v-for="(phoneEle, i) in form.contacts[0].phones" :key="i">
              <b-col>
                <label class="label">
                  Phone
                  <span class="text-danger">*</span>
                </label>
                <b-form-input
                  class="rowInput"
                  size="md"
                  id="phone"
                  type="text"
                  placeholder="Enter Phone Number"
                  v-model="phoneEle.phone"
                ></b-form-input>
              </b-col>

              <b-col>
                <label class="label">Is Primary?</label>
                <b-form-checkbox name="check-button" size="lg" v-model="phoneEle.is_primary" @change="phoneChk(i)">
                  <!-- <b>({{ checked }})</b> -->
                </b-form-checkbox>
              </b-col>

              <b-col sm="1">
                <b-button variant="success" @click="addPhone">Add</b-button>
              </b-col>

              <b-col>
                <b-button variant="danger" @click="delPhone(i)">Delete</b-button>
              </b-col>
            </b-row>
          </b-row>
          <b-button class="yellow addEdetails" @click="addContact">Add</b-button>
          <b-row class="w-100 ">
          <b-button class="yellow submitBtn" type="submit" ref="formSubmitBtnCustomers">Submit</b-button>
          <b-button class="submitBtn resetBtn" type="reset" @click="onReset" >Reset</b-button>
          </b-row>
      </b-container>

      <!-- new added -->
    </b-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['visible'],

  data () {
    return {

      isdisplay: 'none',

      checked: false, // for crdit allowed checkbox
      selected: null, // For cutomer type list
      CustomerTypeList: [],
      selected2: null, // for customer category list
      CustomerCategoryList: [],
      selected3: null,
      DesignationList: [],
      selected4: null,
      CustomerList: [],

      isSucess: false,

      test: [],
      contactsList: [],

      emailIndex: 0,
      phoneIndex: 0,

      form: {
        customer_name: '',
        credit_allowed: false,
        customer_type: '',
        customer_category: '',
        credit_days: '',
        contacts: [
          {
            contact_name: '',
            designation: '',
            emails: [
              {
                email: '',
                is_primary: true
              }
            ],
            phones: [
              {
                phone: '',
                is_primary: true
              }
            ]
          }
        ]
      },
      show: true
    }
  },
  created () {
    // axios
    //   .get('users/masters/', {
    //     headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
    //   })
    //   .then(res => {
    // console.log(res)
    if (
      this.$store.state.masterData[2].customer_types != null &&
          this.$store.state.masterData[2].customer_types.length > 0
    ) {
      this.$store.state.masterData[2].customer_types.forEach(element => {
        this.CustomerTypeList.push({
          value: element.id,
          text: element.customer_type
        })
      })
    }
    if (
      this.$store.state.masterData[1].customer_categories != null &&
          this.$store.state.masterData[1].customer_categories.length > 0
    ) {
      this.$store.state.masterData[1].customer_categories.forEach(element => {
        this.CustomerCategoryList.push({
          value: element.id,
          text: element.customer_category
        })
      })
    }
    if (
      this.$store.state.masterData[3].designations != null &&
          this.$store.state.masterData[3].designations.length > 0
    ) {
      this.$store.state.masterData[3].designations.forEach(element => {
        this.DesignationList.push({
          value: element.id,
          text: element.designation
        })
      })
    }
    // })
  },
  beforeDestroy () {
    console.log('this.isdisplay removed')
    // window.removeEventListener('keydown', this)
    this.isdisplay = 'none'
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      console.log(this.isdisplay, 'this.isdisplay')
      if (e.key === 'Enter' && this.visible && this.isdisplay === 'block') {
        const elem = this.$refs.formSubmitBtnCustomers
        elem.click()
      }
    })
    this.$store.state.user.token = localStorage.accessToken

    axios
      .get('/customers/customers', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(response => {
        response.data.forEach(element =>
          this.CustomerList.push({
            value: element.id,
            text: element.customer_name
          })
        )
      })
  },
  watch: {
    isSucess (val) {
      if (val === true) {
        setTimeout(() => (this.isSucess = false), 1500)
        this.$router.go(0)
      }
    }
  },
  methods: {

    showContact () {
      this.isdisplay = 'block'
      setTimeout(() => (this.$router.push('customers')), 1000)
    },

    addEmail () {
      if (!this.form.contacts[0].emails[this.emailIndex].email == '') {
        this.form.contacts[0].emails.push({
          email: '',
          is_primary: false
        }),
        this.emailIndex++
      } else {
        alert('Fill in missing email details before adding')
      }
    },
    addPhone () {
      if (!this.form.contacts[0].phones[this.phoneIndex].phone == '') {
        this.form.contacts[0].phones.push({
          phone: '',
          is_primary: false
        })
        this.phoneIndex++
      } else {
        alert('Fill in missing phone details before adding')
      }
    },
    delEmail (i) {
      this.form.contacts[0].emails.splice(i, 1)
      this.emailIndex--
    },
    delPhone (i) {
      // console.log(i)
      this.form.contacts[0].phones.splice(i, 1)
      this.phoneIndex--
    },
    onSubmit (evt) {
      evt.preventDefault()
      const data = {
        'customer_name': this.form.customer_name,
        'credit_allowed': this.form.credit_allowed,
        'customer_type': Number(this.form.customer_type),
        'customer_category': Number(this.form.customer_category),
        'credit_days': Number(this.form.credit_days),
        'contacts': [this.contactsList[0]]
      }
      axios
        .post('/customers/customers/', data, {
          headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        })
        .then(res => {
          // console.log(res)
          this.isSucess = true
          alert('Customer successfully added!')
        })
        .catch(error => alert(error))
    },

    onReset (evt) {
      this.$emit('displayNone', 'none')
      evt.preventDefault()
      this.form.customer_name = ''
      this.form.credit_allowed = ''
      this.form.customer_type = ''
      this.form.customer_category = ''
      this.form.credit_days = ''
      this.contactsList = []
      this.form.contacts = [{
        contact_name: '',
        designation: '',
        emails: [
          {
            email: '',
            is_primary: true
          }
        ],
        phones: [
          {
            phone: '',
            is_primary: true
          }
        ]
      }],
      this.$nextTick(() => {
        this.show = true
      })
    },

    addContact () {
      if (!this.form.contacts[0].emails[this.emailIndex].email == '' && !this.form.contacts[0].phones[this.phoneIndex].phone == '' && !this.form.contacts[0].contact_name == '' && !this.form.contacts[0].designation == '') {
        var cName = this.form.contacts[0].contact_name
        var cDesignation = this.form.contacts[0].designation
        var cCustomer = this.form.contacts[0].customer
        var cEmails = this.form.contacts[0].emails.map(x => ({
          email: x.email,
          is_primary: x.is_primary
        })
        )
        var cPhones = this.form.contacts[0].phones.map(x => ({
          phone: x.phone,
          is_primary: x.is_primary
        }))
        this.contactsList.push({
          contact_name: cName,
          designation: cDesignation,
          customer: cCustomer,
          emails: cEmails,
          phones: cPhones
        })
        this.form.contacts = [{
          contact_name: '',
          designation: '',
          emails: [
            {
              email: '',
              is_primary: false
            }
          ],
          phones: [
            {
              phone: '',
              is_primary: false
            }
          ]
        }]
      } else {
        alert('fill in missing contact details')
      }
    },

    emailChk (index) {
      for (var m in this.form.contacts[0].emails) {
        this.form.contacts[0].emails[m].is_primary = false
      }
      this.form.contacts[0].emails[index].is_primary = true
    },

    phoneChk (index) {
      for (var m in this.form.contacts[0].phones) {
        this.form.contacts[0].phones[m].is_primary = false
      }
      this.form.contacts[0].phones[index].is_primary = true
    }

  }
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
  display: block !important;
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
.btn-dark,
.btn-warning {
  width: 100px !important;
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
  width: 100%;
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
  /* padding-bottom: 10px; */
}
.customercard {
  height: 40px;
  background-color: white;
  padding: 5px;
  margin-bottom: 10px;
  font-family: Helvetica;
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.5);
}
.alert {
  background-color: lightgreen;
  padding: 15px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.toggleSwitch {
  margin-left: 20px;
}

#c_name {
  width: 95%;
}
.addContactButton{
  width: 130px;
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
  font-weight: bold;
}
.eDetailsContainer{
  padding-bottom:10px;
}
.addEdetails{
    width: 70px;
    font-weight: bold;
    margin-left: 15px;
}
/* card css */
.submitBtn{
  background-color: #ffc000;
  width: 100px;
  transform: translateX(-50%);
  left: 45%;
  margin-bottom: 20px;
  font-weight: bold;
  position:relative;
}
.resetBtn:hover {
    color: #ffc000;
}
.resetBtn{
    background-color: #3a3636;
    margin-left: 15px;
}
</style>
