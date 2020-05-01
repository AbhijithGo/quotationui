<template>
  <div @click="anywhereClick">
    <b-container fluid class="card estimateContainer margBot" id="titleConatainer">
      <b-row class="my-1">
        <label id="titleLable" class="label">Add an Estimate</label>
      </b-row>
    </b-container>
    <form>
    <b-container fluid class="card estimateContainer margBot" id="ename_enum_container">
      <b-row class="my-1">
        <b-col sm="4">
          <label class="label">
            Estimate Name:
            <span class="text-danger">*</span>
          </label>
          <label class="inputContainer">
            <b-icon class="docIcon" icon="document-richtext"></b-icon>
            <b-form-input
              v-model="eName"
              class="rowInput"
              size="md"
              id="eName"
              type="text"
              placeholder="Estimate Name.."
              required
            ></b-form-input>
          </label>
        </b-col>
        <b-col sm="4">
          <label class="label">
            Estimate number:
            <span class="text-danger">*</span>
          </label>
          <label class="inputContainer">
            <b-icon class="docIcon" icon="document-richtext"></b-icon>
            <b-form-input
              v-model="eNumber"
              class="rowInput"
              size="md"
              id="eNumber"
              type="text"
              @change="validateEnum"
              placeholder="Estimate number.."
              :disabled="disableInput"
              required
            ></b-form-input>
            <div class="dateError" v-if="presentIdBool">This Estimate no. is present pls input another.</div>
          </label>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="card estimateContainer margBot" id="eDetails">
      <b-row class="my-1">
        <b-col sm="3">
          <label class="label">
            Customer:
            <span class="text-danger">*</span>
          </label>
          <b-form-input
            class="rowInput"
            size="md"
            id="eCustomer"
            @input="changeInp"
            type="text"
            v-model="customerSelected"
            placeholder="Type Customer name..."
            required
          ></b-form-input>
          <template v-if="customerListBool">
            <div class="dropdown-content">
              <div
                class="dropdown-item"
                @mousedown="selectOption(option)"
                v-for="(option, index) in  filteredList(customerList)"
                :key="index+'af'"
              >{{ option.text || option.id || '-' }}</div>
            </div>
          </template>
        </b-col>
        <b-col sm="3">
          <label class="label">
            Date:
            <span class="text-danger">*</span>
          </label>
          <b-form-datepicker
            class="rowInput"
            @input="DateValidation"
            size="md"
            id="eDate"
            v-model="eDate"
            locale="en"
            :state="eDateBool"
          ></b-form-datepicker>
        </b-col>
        <b-col sm="3">
          <label class="label">
            Subheading:
            <span class="text-danger">*</span>
          </label>
          <b-form-input
            v-model="eSubheading"
            class="rowInput"
            size="md"
            id="eSubheading"
            type="text"
            placeholder="Subheading.."
            required
          ></b-form-input>
        </b-col>
        <b-col sm="3">
          <label class="label">P.O./S.O.:</label>
          <!-- <span class="text-danger">*</span> -->
          <b-form-input
            v-model="ePoso"
            class="rowInput"
            size="md"
            id="ePoso"
            type="text"
            placeholder="P.O./S.O.."
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="3">
          <label class="label">
            Sales Man:
            <span class="text-danger">*</span>
          </label>
          <!-- <b-form-input  class="rowInput" size="md" id="eSalesMan" type="text" placeholder="Sales Man.."></b-form-input> -->
          <b-form-select
            v-model="eSalesManSelected"
            class="rowInput"
            id="eSalesMan"
            :options="eSalesManList"
            required
            placeholder="Sales Man.."
          >
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Please select a SalesMan --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
        <b-col sm="3">
          <label class="label">
            Expiry Date:
            <span class="text-danger">*</span>
          </label>
          <b-form-datepicker
            class="rowInput"
            size="md"
            :state="errorBool"
            id="eDate_expiry"
            v-model="eDate_expiry"
            @input="expDateValidation"
            :min="min_eDate_expiry"
            :max="max_eDate_expiry"
            locale="en"
          ></b-form-datepicker>
          <div class="dateError" v-if="show">Invalid Date, pls select correct expiry date !!!</div>
        </b-col>
        <b-col sm="3">
          <label class="label">
            Footer:
            <span class="text-danger">*</span>
          </label>
          <b-form-input
            v-model="eFooter"
            class="rowInput"
            size="md"
            id="eFooter"
            type="text"
            placeholder="Footer.."
            required
          ></b-form-input>
        </b-col>
        <b-col sm="3">
          <label class="label">
            Memo:
            <span class="text-danger">*</span>
          </label>
          <!-- <b-form-input  class="rowInput" size="md" id="eMemo" type="text" placeholder="Memo.."></b-form-input> -->
          <b-form-textarea id="memotextarea" required v-model="eMemotext" placeholder="Memo..." max-rows="3"></b-form-textarea>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="card estimateContainer" style="overflow-x:auto;" id="eTable">
      <div id="resp-table">
        <div id="resp-table-header">
          <div class="table-header-cell"></div>
          <div class="table-header-cell">Item Type</div>
          <div class="table-header-cell">Item</div>
          <div class="table-header-cell">Search</div>
          <div class="table-header-cell">Description</div>
          <div class="table-header-cell">Unit</div>
          <div class="table-header-cell">Quantity</div>
          <div class="table-header-cell">Price</div>
          <div class="table-header-cell">Discount(%)</div>
          <div class="table-header-cell">Total</div>
        </div>
        <div id="resp-table-body">
          <div class="resp-table-row" v-for="(row, i) in rows" track-by="i" :key="i">
            <div class="table-body-cell delete">
              <b-icon-trash class="customtrashIcon" @click="deleteRow(i)"></b-icon-trash>
            </div>
            <div class="table-body-cell itemType">
              <b-form-select
                v-model="row.itemTypedPicked"
                @change="getselectedValue(i)"
                class="rowInput table_itemTypeSelect"
                :options="typeList"
                required
              >
              </b-form-select>
            </div>
            <div class="table-body-cell item">
              <b-form-input
                class="rowInput"
                size="md"
                @input="itemChangeInput(i)"
                type="text"
                v-model="row.itemSelected"
                required
                aria-required="false"
              ></b-form-input>
              <template v-if="row.itemListBool">
                <div class="dropdown-content">
                  <div
                    class="dropdown-item"
                    @mousedown="itemSelectOption(option, i)"
                    v-for="(option, index) in  itemFilteredList(row.itemList, i)"
                    :key="index+'af'"
                  >{{ option.text || option.id || '-' }}</div>
                </div>
              </template>
            </div>
            <div>
              <b-button @click="toggleSearch(i)">Search</b-button>
            </div>

            <div class="table-body-cell description">
              <b-form-textarea class='descriptionClass' v-model="row.description" max-rows="3"></b-form-textarea>
            </div>
            <div class="table-body-cell unit">
              <input class="rowInput" v-model="row.unit" :disabled="row.disabledUnit"/>
            </div>
            <div class="table-body-cell quantity">
              <input
                type="number"
                class="rowInput"
                @change="calculateTotal(i)"
                v-model="row.quantity"
                number
              />
            </div>
            <div class="table-body-cell price">
              <input
                type="number"
                class="rowInput"
                @change="calculateTotal(i)"
                v-model="row.price"
                step="0.01"
              />
            </div>
            <div class="table-body-cell discount">
              <input
                type="number"
                class="rowInput"
                @change="calculateTotal(i)"
                v-model="row.discount"
                number
              />
            </div>

            <div class="table-body-cell total">
              <input type="number" disabled class="rowInput" v-model="row.total" number />
            </div>
          </div>
        </div>
      </div>
      <hr />

        <b-row class="my-1 row justify-content-center" v-if="elasticSearch">
        <v-client-table :data="elasticTableData" :columns="columns" :options="options">
          <template slot="actions" slot-scope="{ row }">
            <button class="editButton" @click="select(row)">Select</button>
          </template>
        </v-client-table>
      </b-row>

      <b-row class="my-1 tableBottomContainer">
        <b-col sm="6">
          <b-button class="addRowBtn" @click="addRow">
            <b-icon-plus class="customPlusIcon"></b-icon-plus>
            <span class="addBtnTxt">Add</span>
          </b-button>
        </b-col>
        <b-col sm="6">
          <label class="label customTotal">
            <span class="allTotalTxt">Sub total:</span>
            <span class="alltotal">{{overSubAllTotal}}</span>
          </label>
          <label class="label customTotal discountTotal">
            <span class="allTotalTxt">Discount:</span>
            <span class="alltotal">{{overAllDiscount}}</span>
          </label>
          <label class="label customTotal">
            <span class="allTotalTxt">Total:</span>
            <span class="alltotal">{{overAllTotal}}</span>
          </label>
        </b-col>
      </b-row>

      <b-row class="my-1 tableBottomContainer">
        <b-button  type="submit" @click="save" class="saveFormBtn">
          <b-icon-plus class="customPlusIcon_save"></b-icon-plus>
          <span class="addBtnTxt_save">Save</span>
        </b-button>
        <b-button  @click="reset" class="saveFormBtn resetFormBtn">
          <!-- <b-icon-plus class="customPlusIcon_save"></b-icon-plus> -->
          <span class="addBtnTxt_save resetBtnTxt_reset">Reset</span>
        </b-button>
      </b-row>
    </b-container>
    </form>
    <!-- <b-container fluid class="customPopup" style="overflow-x:auto;" id="savePopup">
    </b-container> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['editRowData', 'toggleRequest', 'tableData'],
  mounted () {
    this.$store.state.user.token = localStorage.accessToken

    // console.log('Mounted')
    // console.log('editRowData', this.editRowData)
    // console.log('eSalesManList', this.eSalesManList)
    if (this.toggleRequest) {
      this.eName = this.editRowData.quotation_name
      this.eNumber = this.editRowData.quotation_id
      this.eSubheading = this.editRowData.sub_heading
      this.eFooter = this.editRowData.footer
      this.eMemotext = this.editRowData.memo
      this.ePoso = this.editRowData.po_so
      this.eDate = this.editRowData.generated_date
      this.eDate_expiry = this.editRowData.expiry_date
      this.rows.length = 0
      for (let i = 0; i < this.editRowData.quotation_products.length; i++) {
        this.addRow()
      }
      var self = this
      this.editRowData.quotation_products.forEach((element, i) => {
        self.rows[i].itemTypedPicked = self.typeList.filter(word => word[0] === element.item_type)[0]
        self.getselectedValue(i)
        self.rows[i].description = element.description
        self.rows[i].itemSelected = element.item_code
        self.rows[i].quantity = element.quantity
        self.rows[i].price = element.price
        self.rows[i].discount = element.discount
        self.rows[i].unit = element.unit
        const check = (element) => element.text === self.editRowData.quotation_products[i].item_code
        var checkItemId = self.rows[i].itemList.some(check)
        // console.log('checkItemId', checkItemId)
        if (!checkItemId) {
          if (element.item_type === 'S') {
            self.rows[i].itemList.push({
              value: element.service,
              text: element.item_code,
              description: element.description,
              price: element.price,
              unit: element.unit
            })
          } else {
            self.rows[i].itemList.push({
              value: element.product,
              text: element.item_code,
              description: element.description,
              price: element.price,
              unit: element.unit
            })
          }
        }

        if (element.item_type === 'S') {
          self.rows[i].disabledUnit = true
          self.rows[i].itemSelectedId = element.service
        } else {
          self.rows[i].itemSelectedId = element.product
        }
        this.calculateTotal(i)
      })
    }
  },
  created () {
    // console.log('Created')
    axios
      .get('customers/customers/', {
        headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      })
      .then(res => {
        this.refelectIntoLocalVar(res)
      })
      .catch((error) => {
        this.$router.push('/')
        console.log(error)
      })

    if (!this.toggleRequest) {
      // axios
      //   .get('users/masters/', {
      //     headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      //   })
      //   .then(res => {
      this.eName = this.$store.state.masterData[0].settings.default_estimate_name
      this.eNumber = this.$store.state.masterData[0].settings.next_estimate_no
      this.eSubheading = this.$store.state.masterData[0].settings.default_sub_heading
      this.eFooter = this.$store.state.masterData[0].settings.default_footer
      this.eMemotext = this.$store.state.masterData[0].settings.default_memo
      this.$store.state.masterData[7].sales_persons.forEach(element => {
        this.eSalesManList.push({
          value: element.id,
          text: element.sales_person_name
        })
      })
      // console.log('res.data[8].sales_persons', res.data[8].sales_persons)
      // })
      // .catch(error => {
      //   console.log(error)
      // })
      // console.log('eSalesManlist.length', this.eSalesManList.length)
    } else {
      // axios
      // .get('users/masters/', {
      //   headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      // })
      // .then(res => {
      this.$store.state.masterData[7].sales_persons.forEach(element => {
        this.eSalesManList.push({
          value: element.id,
          text: element.sales_person_name
        })
      })
      this.salesManListUpdate = true
      // })
      // .catch(error => {
      //   console.log(error)
      // })
    }
  },
  data: function () {
    return this.initialValues()
  },
  watch: {
    isSucess (val) {
      if (val === true) {
        setTimeout(() => (this.isSucess = false), 1500)
        // this.$router.push('quotations')
        // this.$router.go()
        this.$alert('Saved Estimate !!!!', 'Successfully', 'success').then(() => {
          this.$router.go()
        })
      }
    },
    editRowData (newEditRowData) {
      // console.log('toggleRequest', this.toggleRequest)
      // console.log('newEditRowData watch', newEditRowData)
      if (this.toggleRequest) {
        this.eName = newEditRowData.quotation_name
        this.eNumber = newEditRowData.quotation_id
        this.eSubheading = newEditRowData.sub_heading
        this.eFooter = newEditRowData.footer
        this.eMemotext = newEditRowData.memo
        this.ePoso = newEditRowData.po_so
        this.eDate = newEditRowData.generated_date
        this.eDate_expiry = newEditRowData.expiry_date
        this.editCustomer()
        this.editsalesMan()
        this.rows.length = 0
        for (let i = 0; i < newEditRowData.quotation_products.length; i++) {
          this.addRow()
        }
        var self = this
        newEditRowData.quotation_products.forEach((element, i) => {
          self.rows[i].itemTypedPicked = self.typeList.filter(word => word[0] === element.item_type)[0]
          self.getselectedValue(i)
          self.rows[i].itemSelected = element.item_code
          self.rows[i].description = element.description
          self.rows[i].quantity = element.quantity
          self.rows[i].price = element.price
          self.rows[i].discount = element.discount
          self.rows[i].unit = element.unit
          const check = (element) => element.text === newEditRowData.quotation_products[i].item_code
          var checkItemId = self.rows[i].itemList.some(check)
          if (!checkItemId) {
            if (element.item_type === 'S') {
              self.rows[i].itemList.push({
                value: element.service,
                text: element.item_code,
                description: element.description,
                price: element.price,
                unit: element.unit
              })
            } else {
              self.rows[i].itemList.push({
                value: element.product,
                text: element.item_code,
                description: element.description,
                price: element.price,
                unit: element.unit
              })
            }
          }

          if (element.item_type === 'S') {
            self.rows[i].disabledUnit = true
            self.rows[i].itemSelectedId = element.service
          } else {
            self.rows[i].itemSelectedId = element.product
          }
          this.calculateTotal(i)
        })
      }
    },
    customerListUpdate (val) {
      this.editCustomer()
    },
    salesManListUpdate (val) {
      this.editsalesMan()
    }
  },
  methods: {

    select (element) {
      // console.log('element', element)
      this.rows[this.rowIndex].description = element.description
      if (this.rows[this.rowIndex].itemTypedPicked.toLowerCase() === 'services') {
        this.rows[this.rowIndex].itemSelected = element.service_code
        this.rows[this.rowIndex].unit = 'none'
      } else {
        this.rows[this.rowIndex].itemSelected = element.item_code
        this.rows[this.rowIndex].unit = element.unit.unit
      }
      this.rows[this.rowIndex].itemSelectedId = element.id
      this.rows[this.rowIndex].quantity = 1
      this.rows[this.rowIndex].price = element.selling_price
      this.calculateTotal(this.rowIndex)
      this.elasticSearch = false
    },

    toggleSearch (i) {
      this.rowIndex = i
      this.elasticSearch = true
      this.elasticTableData = []
      if (this.rows[i].itemTypedPicked.toLowerCase() === 'services') {
        this.columns = ['service_code', 'description', 'selling_price', 'actions']
      } else {
        this.columns = ['item_code', 'description', 'selling_price', 'actions']
      }
      axios
        .get(`/products/${this.rows[i].itemTypedPicked.toLowerCase()}/?search=${this.rows[i].itemSelected}`, {
          headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        })
        .then(response => {
          if (response.data.length === 0) {
            this.$alert('No results found!!!!', 'Error', 'error')
          } else {
            this.elasticTableData.length = 0
            this.elasticTableData = []
            response.data.forEach(element => {
              this.elasticTableData.push(element)
            })
          }
        }).catch(err => {
          console.log(err)
        })
    },
    validateEnum () {
      const check = (element) => element.quotation_id === this.eNumber
      this.presentIdBool = this.tableData.some(check)
      // console.log('presentIdBool', this.presentIdBool)
    },
    editsalesMan () {
      if (this.toggleRequest) {
        const check = (element) => element.value === this.editRowData.sale_person_str.id
        var customerBool = this.eSalesManList.some(check)
        if (customerBool) {
          this.eSalesManSelected = this.editRowData.sale_person_str.id
        } else {
          this.eSalesManList.push({
            value: this.editRowData.sale_person_str.id,
            text: this.editRowData.sale_person_str.sales_person_name
          })
          this.eSalesManSelected = this.editRowData.sale_person_str.id
        }
      }
    },
    editCustomer () {
      if (this.toggleRequest) {
        const check = (element) => element.value === this.editRowData.customer
        var customerBool = this.customerList.some(check)
        if (customerBool) {
          this.customerSelected = this.editRowData.customer_str
          this.customerSelectedId = this.editRowData.customer
        } else {
          this.customerList.push({
            value: this.editRowData.customer,
            text: this.editRowData.customer_str
          })
          this.customerSelected = this.editRowData.customer_str
          this.customerSelectedId = this.editRowData.customer
        }
      }
    },
    reset (evt) {
      // this.$alert('Hello Vue Simple Alert.', 'Success', 'success')
      // self = this
      this.$confirm('Are you sure?', 'Warning', 'warning').then(() => {
        this.$emit('resetEvent', false)
        // this.editRowData = this.initialValues()
        // this.$emit('resetEdit', this.editRowData)
        // console.log('this.$data', this.$data)
        // console.log('editrowdata', this.editRowData)

        evt.preventDefault()
        setTimeout(() => {
          Object.assign(this.$data, this.initialValues())
          Object.assign(this.editRowData, this.initialValues())
          // this.editRowData = this.$data
          this.disableInput = false
          // console.log('this.$data in settimeout', this.$data)
          // console.log('editrowdata', this.editRowData)
        }, 5000)
      })
    },
    initialValues () {
      return {
        rowIndex: null,
        elasticSearch: false,
        columns: ['item_code', 'description', 'selling_price', 'actions'],
        elasticTableData: [],
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
        },

        addComp: false,
        disableInput: this.toggleRequest,
        eName: '',
        eNumber: '',
        eDate: '',
        eDate_expiry: '',
        eMemotext: '',
        eSubheading: '',
        ePoso: '',
        eFooter: '',
        customerList: [],
        customerListBool: false,
        customerSelected: '',
        customerSelectedId: '',
        eSalesManList: [],
        eSalesManSelected: '',
        min_eDate_expiry: '',
        max_eDate_expiry: '',
        errorBool: null,
        eDateBool: null,
        show: false,
        typeList: ['Products', 'Services'],
        rows: [
          {
            itemTypedPicked: '',
            itemList: [],
            itemSelected: '',
            itemSelectedId: '',
            itemListBool: false,
            description: '',
            quantity: 0,
            price: 0,
            discount: 0,
            unit: '',
            disabledUnit: false,
            total: 0
          }
        ],
        overSubAllTotal: 0,
        overAllDiscount: 0,
        overAllTotal: 0,
        isSucess: false,
        customerListUpdate: false,
        salesManListUpdate: false,
        serviceListUpdate: false,
        productListUpdate: false,
        presentIdBool: false
      }
    },
    save () {
      // console.log('this.rows', this.rows)
      this.postQuotaion()
    },
    findId (localArray, txt) {
      // console.log('localArray', localArray)
      localArray.forEach(element => {
        // console.log('txt', txt)
        // console.log('element.text', element.text)
        if (element.text === txt) {
          return element.value
        }
      })
    },
    quotation_products_obj () {
      var newObj = this.rows.map(element => {
        if (element.itemTypedPicked[0].toUpperCase() === 'S') {
          return {
            item_type: element.itemTypedPicked[0].toUpperCase(),
            description: element.description,
            quantity: element.quantity,
            price: Number(element.price),
            discount: Number(element.discount),
            unit: element.unit,
            product: null,
            service: element.itemSelectedId
          }
        } else {
          return {
            item_type: element.itemTypedPicked[0].toUpperCase(),
            description: element.description,
            quantity: element.quantity,
            price: Number(element.price),
            discount: Number(element.discount),
            unit: element.unit,
            product: element.itemSelectedId,
            service: null
          }
        }
      })
      // console.log('newObj', newObj)
      // console.log('rows', this.rows)
      return newObj
    },
    postQuotaion () {
      // this.isSucess = true
      const check = (element) => element.itemTypedPicked === ''
      var itemTypedPickedBool = this.rows.some(check)
      const checkSelected = (element) => element.itemSelected === ''
      var itemSelectedBool = this.rows.some(checkSelected)
      // console.log('itemTypedPickedBool', itemTypedPickedBool)

      if (this.overAllTotal !== 0 && this.presentIdBool === false && this.customerSelected !== '' && this.eDate !== '' && this.eDate_expiry !== '' && this.eSalesManSelected !== '' && !itemTypedPickedBool && !itemSelectedBool) {
        const data = {
          sale_person: Number(this.eSalesManSelected),
          quotation_products: this.quotation_products_obj(),
          quotation_id: this.eNumber,
          generated_date: this.eDate,
          expiry_date: this.eDate_expiry,
          po_so: this.ePoso,
          quotation_name: this.eName,
          sub_heading: this.eSubheading,
          footer: this.eFooter,
          memo: this.eMemotext,
          currency: 'QAR',
          customer: Number(this.customerSelectedId)
        }
        if (this.toggleRequest) {
          axios
            .put('quotes/quotations/' + this.editRowData.id + '/', data, {
              headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
            })
            .then(res => {
              // console.log(res)
              this.isSucess = true
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          axios
            .post('quotes/quotations/', data, {
              headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
            })
            .then(res => {
              // console.log(res)
              this.isSucess = true
            })
            .catch(error => {
              console.log(error)
            })
        }
        // console.log(data)
      } else {
        if (this.eDate === '') {
          this.eDateBool = false
          alert('Date is not Selected !!!!')
        }
        if (this.eDate_expiry === '') {
          this.errorBool = false
          alert('Expiry Date is not Selected !!!!')
        }
        if (this.this.overAllTotal === 0) {
          // this.errorBool = false
          alert('Total should not be zero !!!!')
        }
      }
    },
    deleteRow (index) {
      if (this.rows.length !== 1) {
        this.rows.splice(index, 1)
      }
    },
    addRow () {
      this.rows.push({
        itemTypedPicked: '',
        itemList: [],
        itemSelected: '',
        itemSelectedId: '',
        itemListBool: false,
        description: '',
        quantity: 0,
        price: 0,
        discount: 0,
        unit: '',
        disabledUnit: false,
        total: 0
      })
    },
    itemFilteredList: function (list, index) {
      var self = this
      // console.log("this.customerList",this.customerList);
      return list.filter(function (cust) {
        return (
          cust.text.toLowerCase().indexOf(self.rows[index].itemSelected.toLowerCase()) >= 0
        )
      })
    },
    itemChangeInput (index) {
      if (this.rows[index].itemSelected.length === 2) {
        this.rows[index].itemListBool = true
        // this.rows[index].itemList.length = 0
        // console.log('itemList empty', this.rows[index].itemList)

        // let selectedType = this.rows[index].itemTypedPicked
        // axios
        //   .get('products/' + selectedType.toLowerCase() + '/?search=' + this.rows[index].itemSelected, {
        //     headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        //   })
        //   .then(res => {
        //     this.rows[index].itemList.length = 0
        //     res.data.forEach(element => {
        //       this.rows[index].itemList.push({
        //         value: element.id,
        //         text: element.description
        //       })
        //     })
        //     console.log('itemList response', this.rows[index].itemList)
        //   })
        //   .catch(error => {
        //     console.log(error)
        //   })
      } else {
        if (this.rows[index].itemSelected.length < 2) this.rows[index].itemListBool = false
      }
    },
    itemSelectOption (option, index) {
      this.rows[index].itemSelected = option.text
      this.rows[index].itemSelectedId = option.value
      this.rows[index].itemListBool = false
      // console.log('option', option)
      this.getItemDetails(option, index)
    },
    filteredList: function (list) {
      var self = this
      // console.log("this.customerList",this.customerList);
      return list.filter(function (cust) {
        return (
          cust.text
            .toLowerCase()
            .indexOf(self.customerSelected.toLowerCase()) >= 0
        )
      })
      // return this.customers;
    },
    changeInp () {
      if (this.customerSelected.length > 1) {
        this.customerListBool = true
      } else {
        this.customerListBool = false
      }
    },
    selectOption (option) {
      this.customerSelected = option.text
      this.customerSelectedId = option.value
      this.customerListBool = false
    },
    anywhereClick () {
      this.customerListBool = false
      this.rows.forEach(elem => {
        elem.itemListBool = false
      })
    },
    DateValidation () {
      this.min_eDate_expiry = new Date(this.eDate)
      if (
        this.eDate_expiry !== '' &&
        (new Date(this.eDate_expiry).getDate() <
          new Date(this.eDate).getDate() ||
          new Date(this.eDate_expiry).getMonth() <
            new Date(this.eDate).getMonth() ||
          new Date(this.eDate_expiry).getFullYear() <
            new Date(this.eDate).getFullYear())
      ) {
        this.errorBool = false
        this.show = true
      } else {
        this.errorBool = null
        this.eDateBool = null
        this.show = false
      }
    },
    expDateValidation () {
      if (
        this.eDate !== '' &&
        (new Date(this.eDate_expiry).getDate() >
          new Date(this.eDate).getDate() ||
          new Date(this.eDate_expiry).getMonth() >
            new Date(this.eDate).getMonth() ||
          new Date(this.eDate_expiry).getFullYear() >
            new Date(this.eDate).getFullYear())
      ) {
        this.errorBool = null
        this.eDateBool = null
        this.show = false
      }
    },
    getselectedValue (index) {
      let selectedType = this.rows[index].itemTypedPicked
      // axios
      //   .get('products/' + selectedType.toLowerCase() + '/&pagesize=20', {
      //     headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
      //   })
      //   .then(res => {
      //     res.data.forEach(element => {
      //       this.rows[index].itemList.push({
      //         value: element.id,
      //         text: element.description
      //       })
      //     })
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
      this.rows[index].description = ''
      this.rows[index].quantity = 0
      this.rows[index].price = 0
      this.rows[index].unit = ''
      this.rows[index].discount = 0
      this.rows[index].total = 0
      this.overSubAllTotal = 0
      this.overAllTotal = 0
      this.overAllDiscount = 0
      this.rows[index].itemSelected = ''
      this.rows[index].itemSelectedId = ''
      axios
        .get('products/' + selectedType.toLowerCase() + '/?pagesize=50', {
          headers: { Authorization: 'Bearer ' + this.$store.state.user.token }
        })
        .then(res => {
          this.rows[index].itemList.length = 0
          if (selectedType.toLowerCase() === 'services') {
            // console.log('this.rows[index].disabledUnit', this.rows[index].disabledUnit)
            this.rows[index].disabledUnit = true
            res.data.forEach(element => {
              this.rows[index].itemList.push({
                value: element.id,
                text: element.service_code,
                description: element.description,
                price: element.selling_price,
                unit: 'none'
              })
            })
          } else {
            this.rows[index].disabledUnit = false
            res.data.forEach(element => {
              this.rows[index].itemList.push({
                value: element.id,
                text: element.item_code,
                description: element.description,
                price: element.selling_price,
                unit: element.unit_str
              })
            })
          }

          // console.log('this.rows[index].itemList', this.rows[index].itemList)
        })
        .catch(error => {
          console.log(error)
        })
      this.calculateTotal(index)
    },
    refelectIntoLocalVar (dataArray) {
      dataArray.data.forEach(element => {
        this.customerList.push({
          value: element.id,
          text: element.customer_name
        })
      })
      this.customerListUpdate = true
    },
    calculateTotal (index) {
      if (Number(this.rows[index].discount) > 100) {
        this.rows[index].discount = 100
      }
      if (Number(this.rows[index].discount) < 0) {
        this.rows[index].discount = 0
      }
      var actualDiscount =
        Number(this.rows[index].quantity) *
        ((Number(this.rows[index].price) / 100) * Number(this.rows[index].discount))
      this.rows[index].total =
        (Number(this.rows[index].price) * Number(this.rows[index].quantity)) - actualDiscount
      this.rows[index].total = this.rows[index].total.toFixed(2)

      this.calcOverAllTotal()
    },
    calcOverAllTotal () {
      Number(this.overSubAllTotal)
      Number(this.overAllDiscount)
      Number(this.overAllTotal)
      this.overSubAllTotal = 0
      this.overAllTotal = 0
      this.overAllDiscount = 0
      this.rows.forEach(element => {
        this.overSubAllTotal +=
          (Number(element.quantity) * Number(element.price))
        this.overAllDiscount += Number(element.quantity * ((element.price / 100) * element.discount))
      })
      this.overAllTotal =
          Number(this.overSubAllTotal) - Number(this.overAllDiscount)
      this.overSubAllTotal = this.overSubAllTotal.toFixed(2)
      this.overAllTotal = this.overAllTotal.toFixed(2)
      this.overAllDiscount = this.overAllDiscount.toFixed(2)
    },
    getItemDetails (option, index) {
      // axios
      //   .get(
      //     'http://35.225.127.81/quotation/products/' +
      //       this.rows[index].itemTypedPicked.toLowerCase() +
      //       '?user=1&search=' +
      //       this.rows[index].itemSelected
      //   )
      //   .then(res => {
      //     this.rows[index].description = res.data[0].description
      //     this.rows[index].quantity = 1
      //     this.rows[index].price = res.data[0].selling_price
      //     this.rows[index].unit = res.data[0].unit_str
      //     this.rows[index].discount = '00.00'
      //     this.calculateTotal(index)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })

      this.rows[index].description = option.description
      this.rows[index].quantity = 1
      this.rows[index].price = option.price
      this.rows[index].unit = option.unit
      this.rows[index].discount = 0
      this.calculateTotal(index)
    },
    findByMatchingProperties (set, properties, value) {
      return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
          return entry[key] === value
        })
      })
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
.inputContainer {
  display: block;
  width: 100%;
  position: relative;
}
.text-danger {
  color: #ff6565;
}
.dropdown-content {
  position: absolute;
  background-color: #fff;
  /* width: 94.4%; */
  max-height: 100px;
  border: 1px solid #e7ecf5;
  overflow: auto;
  z-index: 1;
}
.dropdown-item {
  font-size: 15px;
  line-height: 1em;
  padding: 8px;
  text-decoration: none;
  display: block;
  font: 15px/23px "Open Sans", Helvetica, Arial, sans-serif;
  cursor: pointer;
  color: #404040;
}
.dropdown-item:hover {
  background-color: #ffc000;
  color: white;
}
.row {
  padding: 10px;
}
.rowInput {
  height: 34px !important;
  border: 1px solid lightgrey !important;
  border-radius: 4px;
  padding-right: 46px;
  font: 15px/23px "Open Sans", Helvetica, Arial, sans-serif;
  color: #404040;
}
.b-form-datepicker.form-control.focus,
.form-control:focus,
.rowInput:focus {
  border-color: #ffc000 !important;
  box-shadow: 0px 0px 3px 1px #ffc000;
}
.estimateContainer {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
#eDate_expiry,
#eDate {
  padding: 0 10px;
}
#eDate_expiry__value_,
#eDate__value_ {
  font-size: 13.9px;
}
.btn-outline-primary:not(:disabled):not(.disabled):active {
  background-color: #ffc000;
}

.btn-primary:not(:disabled):not(.disabled):active,
.btn-primary:not(:disabled):not(.disabled).active,
.show > .btn-primary.dropdown-toggle {
  background-color: #ffc000;
  /* border-color: #005cbf; */
}
.btn-primary:not(:disabled):not(.disabled):active:focus,
.btn-primary:not(:disabled):not(.disabled).active:focus,
.show > .btn-primary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem #ffc00085;
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  background-color: #ffc000;
}
.btn-outline-primary:hover {
  background-color: #ffc000;
  border-color: #ffc000;
}
.btn-outline-primary {
  color: #ffc000;
}
.btn-outline-primary:not(:disabled):not(.disabled):active:focus {
  -webkit-box-shadow: 0 0 0 0.2rem #ffc000;
  box-shadow: 0 0 0 0.2rem #ffc00085;
}
.btn-outline-primary:focus,
.btn-outline-primary.focus {
  box-shadow: 0 0 0 0.2rem #ffc00085;
}
.btn-primary:focus,
.btn-primary.focus {
  box-shadow: 0 0 0 0.2rem #ffc00085;
}
.btn-primary.disabled,
.btn-primary:disabled {
  background-color: #ffc000;
  border-color: #ffc000;
}
.dateError {
  font-size: 12px;
  color: red;
  font-weight: 700;
}
.descriptionClass,
#memotextarea {
  height: 34px !important;
  transition: height 1s;
  border: 1px solid lightgrey !important;
  border-radius: 4px;
}
.descriptionClass:focus,
#memotextarea:focus {
  height: 86px !important;
  border: 1px solid #ffc000 !important;
}
#resp-table {
  width: 100%;
  display: table;
  padding-top: 10px;
}
#resp-table-caption {
  display: table-caption;
  text-align: center;
  /* font-size: 30px; */
  font-weight: bold;
}
#resp-table-header {
  display: table-header-group;
  background-color: gray;
  font-weight: bold;
  /* font-size: 25px; */
}
.table-header-cell {
  display: table-cell;
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid black;
}
#resp-table-body {
  display: table-row-group;
}
.resp-table-row {
  display: table-row;
}
.table-body-cell {
  display: table-cell;
  border-radius: 4px;
  padding: 15px 10px;
  position: relative;
}
#resp-table-footer {
  display: table-footer-group;
  background-color: gray;
  font-weight: bold;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.45);
}
.table-footer-cell {
  display: table-cell;
  padding: 10px;
  text-align: justify;
  border-bottom: 1px solid black;
}

#resp-table #resp-table-body .itemType {
  width: 10%;
}
#resp-table #resp-table-body .description {
  width: 30%;
}
#resp-table input,
#table_1 input {
  width: 100%;
  padding: 5px 10px;
}
#resp-table #resp-table-body .item .dropdown input {
  height: 34px;
  border: 1px solid lightgrey !important;
}
#resp-table #resp-table-body .item .dropdown input:focus,
#resp-table input:focus,
#table_1 input:focus {
  outline-color: #ffc000;
  outline-style: auto;
  outline-width: 2px;
}
#resp-table #resp-table-body .dropdown .dropdown-input {
  min-width: 0px;
  max-width: 100%;
}
#resp-table #resp-table-body .dropdown .dropdown-content {
  min-width: 0px;
  max-width: 100%;
}
.table_itemTypeSelect {
  margin-top: -3px;
}
/* .table-body-cell .dropdown-content {
     width: 86.4%;
} */
.total input[disabled] {
  background-color: white;
}
.card hr {
  margin-top: 0;
  margin-bottom: 10px;
}
.tableBottomContainer {
  padding: 0 10px;
  font-size: 15px;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
}
.addRowBtn {
  width: 80px;
  position: relative;
  background-color: #ffc000;
}
.saveFormBtn {
  position: relative;
  background-color: #ffc000;
  width: 100px;
  transform: translateX(-50%);
  left: 45%;
  margin-bottom: 20px;
}
.resetBtnTxt_reset{
  padding: 0 !important;
}
.resetFormBtn:hover {
    color: #ffc000;
}
.resetFormBtn{
    background-color: #3a3636;
    margin-left: 15px;
}
.customPlusIcon {
  font-size: 200% !important;
  position: absolute !important;
  left: 3px;
  top: 2px;
}
.customPlusIcon_save {
  font-size: 200% !important;
  position: absolute !important;
  left: 9px;
  bottom: 6px;
}
.addBtnTxt {
  padding-left: 15px;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
}
.addBtnTxt_save {
  padding-left: 18px;
  font: 13px/1.55 "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 600;
}
.customTotal {
  font-size: 20px;
  padding: 0;
  text-align: end;
  padding-right: 10px;
}
.discountTotal {
  padding-right: 22px;
}
.customtrashIcon {
  font-size: 22px;
}
.delete {
  padding-right: 1px;
}
.total .rowInput {
  font-weight: 700;
  border: 1px solid white !important;
}
.swal2-popup{
      font-size: 1.9rem;
}
</style>
